#!/usr/bin/env python3
"""Orbit sprite atlas reconstruction v2 — production alignment + source QA.

Reads existing user-approved source strips (10x6 intended but not reliably gridded).
Finds cyan chest-core centers per row, detects actual variable pitch, extracts one
character at a time without adjacent-frame bleed, fixes torso baseline, rebuilds
uniform padded RGBA atlases, and records incomplete source frames as holds.

Usage: python normalize_sprites.py --source source --output assets/approved/aligned
GitHub deployment: source=assets/approved/source, output=assets/approved/aligned
"""
import argparse, hashlib, json, math
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import gaussian_filter1d, binary_propagation, label, binary_dilation
from scipy.signal import find_peaks

N_COLS,N_ROWS = 10,6
FRAME=320
PAD=20
ID_ORDER=['idle','wave','listening','thinking','speaking','celebration','scanning','caution','complete','error','sleep','wake','review','idle-return']


def blue_mask(a):
    r,g,b=np.rollaxis(a[:,:,:3].astype(np.float32),2,0)
    return (b>100)&(g>r*1.3)&(b>r*1.5)&(g>75)&((b+g)>200)


def detect_centers(rgb,row,width,height):
    y0=round((row+.36)*height/N_ROWS);y1=round((row+.86)*height/N_ROWS)
    view=rgb[y0:y1]
    line=gaussian_filter1d(blue_mask(view).sum(axis=0).astype(float),4.0)
    peaks,_=find_peaks(line,distance=width/16,prominence=max(line.max()*.10,.2))
    # Weak background glow cannot be treated as a sprite. Core peaks are strong.
    centers=[float(x) for x in peaks]
    if len(centers)>10:
        ranked=sorted(peaks,key=lambda x:line[x],reverse=True)[:10]
        centers=sorted(float(x) for x in ranked)
    if len(centers)<8:
        raise ValueError(f'Row {row}: only {len(centers)} cyan-core detections; manual review required.')
    # There can be 9 (not 10) visible characters in a 10-column image-gen
    # strip. The last one was rendered outside the right image boundary.
    diffs=np.diff(centers)
    pitch=float(np.median(diffs)) if len(diffs) else width/10
    if not (width/12<pitch<width/8):
        raise ValueError(f'Row {row}: implausible frame pitch {pitch:.1f}')
    if len(centers)==9:
        centers.append(centers[-1]+pitch)
    if len(centers)!=10:
        raise ValueError(f'Row {row}: expected 10 inferred centers, got {len(centers)}')
    return centers,pitch


def detect_row_cores(rgb):
    """Detect real core Y positions, not equal h/6 cuts or eye-line peaks."""
    h,w=rgb.shape[:2]
    vertical=gaussian_filter1d(blue_mask(rgb).sum(axis=1).astype(float),3)
    # Generated sheets are laid out in 6 approximate rows, but row-to-row
    # pitch changes. Core tends toward the lower 30% of each intended row.
    centers=[]
    for row in range(N_ROWS):
        expected=(row+.72)*h/N_ROWS
        y0=max(0,int(expected-h/N_ROWS*.50))
        y1=min(h,int(expected+h/N_ROWS*.30))
        ys=np.arange(y0,y1)
        weights=np.exp(-.5*((ys-expected)/(h/N_ROWS*.35))**2)
        y=int(ys[np.argmax(vertical[ys]*weights)])
        centers.append(float(y))
    smooth=np.linspace(centers[0],centers[-1],N_ROWS)
    # Face-screen scan icons can produce false blue peaks one eye-level above
    # the real core. Anomalous detections are brought back onto the row lattice.
    centers=[float(np.clip(v, pred-12, pred+12)) for v,pred in zip(centers,smooth)]
    spacings=np.diff(centers)
    if np.any(spacings<h/8) or np.any(spacings>h/4.5):
        raise ValueError(f'Rows not separable: {centers}')
    return centers,float(np.median(spacings))


def core_anchor(rgb,cell,xcenter,y0,y1):
    h,w=rgb.shape[:2]
    # The strongest blue circle in the lower face/body region is the chest core.
    core_estimate=(y0+y1)*.5
    ylow=max(0,int(core_estimate-19));yhigh=min(h,int(core_estimate+19))
    left=max(0,int(xcenter-32));right=min(w,int(xcenter+32))
    sub=rgb[ylow:yhigh,left:right]
    if sub.size==0:return float(xcenter),float((y0+y1)*.5)
    m=blue_mask(sub).astype(np.float32)
    # Spatial smoothing suppresses bright single-pixel flecks.
    xp=gaussian_filter1d(m.sum(axis=0),1.8)
    yp=gaussian_filter1d(m.sum(axis=1),1.8)
    if xp.max()<.5 or yp.max()<.5:return float(xcenter),float((y0+y1)*.5)
    x=left+float(np.argmax(xp));y=ylow+float(np.argmax(yp))
    return x,y


def remove_black_background(array):
    rgb=array[...,:3]
    # Only background *connected to crop border* is transparent, so dark face
    # glass is retained instead of punched out like a naive black key.
    dark=(np.max(rgb,axis=2)<31)
    seed=np.zeros(dark.shape,bool)
    seed[0,:]=dark[0,:];seed[-1,:]=dark[-1,:]
    seed[:,0]=dark[:,0];seed[:,-1]=dark[:,-1]
    outside=binary_propagation(seed,mask=dark)
    alpha=np.where(outside,0,255).astype(np.uint8)
    # Sub-pixel antialiasing at the outer contour; never blur colours.
    alpha=np.array(Image.fromarray(alpha,'L').filter(ImageFilter.GaussianBlur(.6)),copy=True)
    return alpha


def extract_frame(src_rgb, src_alpha, source_mode, centers,pitch,row,col,
                  core_rows,ypitch,size, previous=None):
    h,w=src_rgb.shape[:2]
    center=float(centers[col]);ycenter=core_rows[row]
    y0=max(0,round(ycenter-ypitch*.80));y1=min(h,round(ycenter+ypitch*.34))
    # A full circle cannot fit beyond this point. Use a valid hold rather than
    # a frame made from half a head and half a neighbour.
    if center >= w-pitch*.34 or center<=pitch*.26:
        return previous.copy() if previous is not None else None,{'source':'held_complete_prior','reason':'source sprite clipped at image boundary','center':round(center,1)}
    lower=(centers[col-1]+center)/2 if col else max(0,center-pitch*.52)
    upper=(center+centers[col+1])/2 if col<9 else min(w,center+pitch*.52)
    # Respect 3-pixel contamination-free guard bands separating neighbouring poses.
    x0=max(0,int(math.floor(lower+2)));x1=min(w,int(math.ceil(upper-2)))
    top=max(0,y0+2);bottom=min(h,y1-2)
    if x1<=x0 or bottom<=top:
        return previous.copy() if previous is not None else None,{'source':'held_complete_prior','reason':'zero-sized source tile'}
    cropped=src_rgb[top:bottom,x0:x1].copy()
    a=src_alpha[top:bottom,x0:x1].copy() if source_mode=='RGBA' else remove_black_background(cropped)
    # Alpha fade 3 source pixels at cell boundaries prevents hard lines and the
    # small fragments of the next sprite leaking into this one.
    kh,kw=a.shape
    ew=min(4,kw//6);eh=min(3,kh//8)
    if ew:
        ramp=(np.arange(ew,dtype=np.float32)+1)/(ew+1)
        a[:,:ew]=(a[:,:ew].astype(float)*ramp[None,:]).astype(np.uint8)
        a[:,-ew:]=(a[:,-ew:].astype(float)*ramp[::-1][None,:]).astype(np.uint8)
    if eh:
        ramp=(np.arange(eh,dtype=np.float32)+1)/(eh+1)
        a[:eh,:]=(a[:eh,:].astype(float)*ramp[:,None]).astype(np.uint8)
        a[-eh:,:]=(a[-eh:,:].astype(float)*ramp[::-1,None]).astype(np.uint8)
    xcore,ycore=core_anchor(src_rgb,None,center,y0,y1)
    if abs(ycore-ycenter)>12:ycore=ycenter
    if True:
        # Supplied RGBA sheets contain red/yellow/grey background flecks,
        # some of which have high alpha. Keep only an anatomically generous
        # envelope around the original helmet, torso, and two flipper arms.
        yy,xx=np.mgrid[top:bottom,x0:x1]
        radius=max(130,pitch)
        # Halo-safe ellipses (broad enough for waving / celebration arms).
        head=((xx-xcore)/(radius*.45))**2+((yy-(ycore-52))/(ypitch*.50))**2
        body=((xx-xcore)/(radius*.37))**2+((yy-(ycore+14))/(ypitch*.35))**2
        arms=((xx-xcore)/(radius*.59))**2+((yy-(ycore+6))/(ypitch*.29))**2
        boundary=np.minimum(np.minimum(head,body),arms)
        envelope=np.clip((1.13-boundary)/.14,0,1)
        a=(a.astype(np.float32)*envelope).astype(np.uint8)
    src_rgba=np.dstack((cropped,a))
    # Align the glowing CHEST CORE, not the bounding-box centroid. That stops
    # artificial whole-character drifting but preserves arm/head performances.
    # A strong outlier in core centre would cause a frame jump; bound adjustments.
    if abs(xcore-center)>pitch*.19:xcore=center
    if abs(ycore-ycenter)>ypitch*.16:ycore=ycenter
    factor=min((size-2*PAD)/(ypitch*.96), (size-2*PAD)/(pitch*.93))
    factor*=.86  # 14% safety margin: no arm/head can touch adjacent cell
    iw=max(1,int(round((x1-x0)*factor)));ih=max(1,int(round((bottom-top)*factor)))
    frame_img=Image.fromarray(src_rgba,'RGBA').resize((iw,ih),Image.Resampling.LANCZOS)
    frame_canvas=Image.new('RGBA',(size,size),(0,0,0,0))
    anchorX=size*.5;anchorY=size*.68
    left=round(anchorX-(xcore-x0)*factor);up=round(anchorY-(ycore-top)*factor)
    frame_canvas.alpha_composite(frame_img,(left,up))
    # Remove detached fragments of the previous/next row. This is the second
    # source of 'an adjacent frame entering my sprite' in image-generated grids.
    arr=np.array(frame_canvas,copy=True)
    labeled,count=label(arr[:,:,3]>90,structure=np.ones((3,3)))
    if count>1:
        areas=np.bincount(labeled.ravel());areas[0]=0
        largest=int(np.max(areas))
        good=(areas>=max(135,largest*.013))
        good[0]=False
        keep=binary_dilation(good[labeled],iterations=2)
        arr[~keep,3]=0
        frame_canvas=Image.fromarray(arr,'RGBA')
    # The outside 8 pixels of an atlas frame must be fully transparent.
    # Feather the final 18-pixel guard to prevent texture sampling bleed.
    arr=np.array(frame_canvas,copy=True)
    ydim,xdim=arr.shape[:2]
    dist=np.minimum.reduce(np.broadcast_arrays(np.arange(ydim)[:,None],
             ydim-1-np.arange(ydim)[:,None],np.arange(xdim)[None,:],
             xdim-1-np.arange(xdim)[None,:])).astype(np.float32)
    fade=np.clip((dist-9)/9,0,1)
    arr[:,:,3]=np.round(arr[:,:,3].astype(np.float32)*fade).astype(np.uint8)
    frame_canvas=Image.fromarray(arr,'RGBA')
    # Check whether the refined frame still touches any outer edge. Catch
    # bad extraction and invalid sheet layouts *before* future publication.
    edge=np.concatenate((arr[:8,:,3].ravel(),arr[-8:,:,3].ravel(),arr[:,:8,3].ravel(),arr[:,-8:,3].ravel()))
    edge_opaque=int(np.count_nonzero(edge>100))
    status={'source':'aligned_original','cx':round(center,1),'core_x':round(xcore,1),'core_y':round(ycore,1),
            'source_region':[x0,top,x1,bottom],'scale':round(factor,4), 'border_opaque_pixels':edge_opaque,
            'clipped_by_canvas':bool(edge_opaque>8)}
    return frame_canvas,status


def process(image_path,outdir,contact_dir):
    im=Image.open(image_path)
    rgb=np.asarray(im.convert('RGB'))
    mode=im.mode
    alpha=np.asarray(im.getchannel('A')) if mode=='RGBA' else None
    w,h=im.size
    frames=[];stats=[];centers_rows=[];reconstructed=0
    core_rows,ypitch=detect_row_cores(rgb)
    for row in range(N_ROWS):
        centers,pitch=detect_centers(rgb,row,w,h)
        centers_rows.append([round(x,2) for x in centers])
        row_frames=[]
        for col in range(N_COLS):
            previous=row_frames[-1] if row_frames else (frames[-1] if frames else None)
            frame,status=extract_frame(rgb,alpha,mode,centers,pitch,row,col,core_rows,ypitch,FRAME,previous)
            if frame is None:raise RuntimeError('No valid source frame available to reconstruct')
            if status['source']!='aligned_original':reconstructed+=1
            row_frames.append(frame);frames.append(frame);status.update({'index':len(frames)-1,'row':row,'col':col});stats.append(status)
    assert len(frames)==60
    atlas=Image.new('RGBA',(FRAME*N_COLS,FRAME*N_ROWS),(0,0,0,0))
    for index,frame in enumerate(frames):atlas.alpha_composite(frame,((index%N_COLS)*FRAME,(index//N_COLS)*FRAME))
    atlas.save(outdir/f'{image_path.stem}.webp','WEBP',quality=90,method=3,exact=True)
    atlas.save(outdir/f'{image_path.stem}.png','PNG',compress_level=1)
    # Produce lightweight thumbnails to avoid keeping all 14 decoded 3200px
    # atlases in browser memory just to draw sidebar item previews.
    thumb=frames[0].copy();thumb.thumbnail((140,140))
    thumb.save(outdir/f'{image_path.stem}.thumb.webp','WEBP',quality=86,method=3)
    assert Image.open(outdir/f'{image_path.stem}.webp').size==(FRAME*N_COLS,FRAME*N_ROWS)
    preview=Image.new('RGB',(960,256),(21,38,49))
    for j,k in enumerate([0,9,20,29,40,49,50,59]):
        p=frames[k].copy();p.thumbnail((110,110))
        back=Image.new('RGBA',(120,120),(14,28,37,255));back.alpha_composite(p,((120-p.width)//2,(120-p.height)//2))
        preview.paste(back.convert('RGB'),((j%8)*120,55))
    preview.save(contact_dir/f'{image_path.stem}.jpg',quality=88)
    warnings=[s['index'] for s in stats if s.get('clipped_by_canvas')]
    out={'id':image_path.stem,'frameCount':len(frames),'columns':N_COLS,'rows':N_ROWS,'cellSize':[FRAME,FRAME],
         'atlasSize':list(atlas.size),'runtimeFile':image_path.stem+'.webp','masterFile':image_path.stem+'.png',
         'thumb':image_path.stem+'.thumb.webp','sourceSize':[w,h],'sourceMode':mode,
         'sourceHash':hashlib.sha256(image_path.read_bytes()).hexdigest(),
         'detectedRowCorePositions':[round(v,2) for v in core_rows],
         'reconstructedHoldCount':reconstructed,'borderWarnings':warnings,'sourceCenters':centers_rows,
         'frameQA':stats}
    (contact_dir/f'{image_path.stem}.json').write_text(json.dumps(out,indent=2))
    print(f'{image_path.stem}: 60 frames, {reconstructed} missing-source holds; {len(warnings)} edge warnings; WEBP {(outdir/(image_path.stem+".webp")).stat().st_size//1024}KiB',flush=True)
    return out


def main():
    p=argparse.ArgumentParser();p.add_argument('--source',type=Path,default=Path('source'));p.add_argument('--output',type=Path,default=Path('assets/approved/aligned'));p.add_argument('--qa',type=Path,default=Path('qa'))
    args=p.parse_args();args.output.mkdir(parents=True,exist_ok=True);args.qa.mkdir(parents=True,exist_ok=True)
    manifests=[]
    for id in ID_ORDER:
        source=args.source/(id+'.png')
        if not source.is_file():raise FileNotFoundError(source)
        manifests.append(process(source,args.output,args.qa))
    m={'version':2,'method':'adaptive cyan-core anchor alignment + variable source pitch + 10x6 padded RGBA atlas',
       'fps':30,'frameSize':[FRAME,FRAME],'frameCount':60,'actions':manifests,
       'total':len(manifests),'heldSourceFrames':sum(a['reconstructedHoldCount'] for a in manifests),
       'framesWithBorderWarnings':sum(len(a['borderWarnings']) for a in manifests)}
    (args.output/'manifest-aligned.json').write_text(json.dumps(m,indent=2))
    print('DONE:',len(manifests),'actions; missing holds:',m['heldSourceFrames'],'border warnings:',m['framesWithBorderWarnings'])

if __name__=='__main__':main()
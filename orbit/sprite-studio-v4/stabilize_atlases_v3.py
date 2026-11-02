#!/usr/bin/env python3
"""Orbit V3: register existing approved sprite frames by the *character itself*.

Input: V2 10x6 transparent 320 px cells. No re-generation or interpolation.
Output: same frames translated inside 416px cells, using a detected helmet anchor;
        ensure zero frame-edge clipping and measured temporal alignment.

Exact source cells preserved on a larger transparent canvas. Source-hold frames
from missing image-generator poses remain flagged and unchanged.
"""
from pathlib import Path
import json, argparse, statistics
import numpy as np
from PIL import Image

COLS=10; ROWS=6; COUNT=COLS*ROWS
INPUT_CELL=320; OUTPUT_CELL=416; PAD=(OUTPUT_CELL-INPUT_CELL)//2


def anchor(fr):
    a=np.asarray(fr.getchannel('A'))
    mask=(a>150)
    # The upper helmet is the broadest, mostly continuous opaque object at this
    # level; arm and chest gestures fall below it. Evaluate several scan rows.
    xhist=mask[100:159,:].sum(axis=0)
    xpos=np.where(xhist>=16)[0]
    if len(xpos)<45:
        raise ValueError(f'Could not identify full helmet (columns={len(xpos)})')
    center=float(np.median(xpos))
    lo=max(0,int(center-42));hi=min(INPUT_CELL,int(center+42))
    widths=mask[50:156,lo:hi].sum(axis=1)
    tops=np.where(widths>=34)[0]
    if not len(tops):raise ValueError('Cannot locate helmet vertical outline')
    # Head top at a stable contour-width threshold rather than first noisy edge pixel.
    top=float(tops[0]+50)
    return center,top


def process(id,source,destination):
    im=Image.open(source).convert('RGBA');assert im.size==(INPUT_CELL*COLS,INPUT_CELL*ROWS)
    raw=[im.crop((c*INPUT_CELL,r*INPUT_CELL,(c+1)*INPUT_CELL,(r+1)*INPUT_CELL))
         for r in range(ROWS) for c in range(COLS)]
    before=[anchor(f) for f in raw]
    ref_top=statistics.median([p[1] for p in before])
    atlas=Image.new('RGBA',(OUTPUT_CELL*COLS,OUTPUT_CELL*ROWS))
    after=[]; shifts=[]; guards=[]; opacity=[]
    for index,f in enumerate(raw):
        x,y=before[index]
        # X is locked to the exact screen anchor; Y uses the same reference for
        # all frames in the action. No artificial per-frame bob (viewer can add
        # continuous hover as a separate optional animation, if desired).
        dx=round(OUTPUT_CELL/2-x)
        dy=round(PAD+ref_top-y)
        cell=Image.new('RGBA',(OUTPUT_CELL,OUTPUT_CELL))
        cell.alpha_composite(f,(dx,dy))
        xx,yy=anchor_large(cell,dx,dy)
        after.append((xx,yy))
        shifts.append((dx,dy))
        a=np.asarray(cell.getchannel('A'))
        border=np.concatenate((a[:12].ravel(),a[-12:].ravel(),a[:,:12].ravel(),a[:,-12:].ravel()))
        guards.append(int(np.count_nonzero(border>0)))
        opacity.append(int(np.count_nonzero(a>30)))
        atlas.alpha_composite(cell,((index%COLS)*OUTPUT_CELL,(index//COLS)*OUTPUT_CELL))
    xs=[a[0] for a in after];ys=[a[1] for a in after]
    devx=max(xs)-min(xs);devy=max(ys)-min(ys)
    if devx>3 or devy>3 or any(guards):
        raise RuntimeError(f'{id} failed true temporal/edge QA: x={devx} y={devy} edge={max(guards)}')
    assert min(opacity)>80, (id,'empty frame',min(opacity))
    destination.mkdir(parents=True,exist_ok=True)
    atlas.save(destination/f'{id}.png',compress_level=1)
    atlas.save(destination/f'{id}.webp',format='WEBP',quality=93,method=1,exact=True)
    t=atlas.crop((0,0,OUTPUT_CELL,OUTPUT_CELL));t.thumbnail((140,140),Image.Resampling.LANCZOS)
    t.save(destination/f'{id}.thumb.webp',quality=87,method=1)
    return {'id':id,'frames':COUNT,'columns':COLS,'rows':ROWS,
            'frameWidth':OUTPUT_CELL,'frameHeight':OUTPUT_CELL,
            'width':OUTPUT_CELL*COLS,'height':OUTPUT_CELL*ROWS,
            'url':f'assets/approved/stabilized/{id}.webp',
            'original':f'assets/approved/stabilized/{id}.png',
            'thumb':f'assets/approved/stabilized/{id}.thumb.webp',
            'sourceUrl':f'assets/approved/aligned/{id}.png',
            'headCenterTargetX':OUTPUT_CELL/2,'headTopTargetY':PAD+ref_top,
            'beforeXRange':round(max(x for x,y in before)-min(x for x,y in before),2),
            'beforeYRange':round(max(y for x,y in before)-min(y for x,y in before),2),
            'afterXRange':round(devx,2),'afterYRange':round(devy,2),
            'borderPixels':max(guards),'frameShifts':shifts,
            'sourceMethod':'pixel-preserving translation of approved aligned v2 frames',
            'atlasBytes':(destination/f'{id}.webp').stat().st_size}


def anchor_large(cell,dx,dy):
    """Read head outline on the output canvas in shifted original coordinates."""
    a=np.asarray(cell.getchannel('A'))
    y0=max(0,dy+100);y1=min(OUTPUT_CELL,dy+159)
    xhist=(a[y0:y1]>150).sum(axis=0)
    xok=np.where(xhist>=16)[0]
    if len(xok)<45:raise ValueError('Missing helmet on output cell')
    x=float(np.median(xok))
    lo=max(0,int(x-42));hi=min(OUTPUT_CELL,int(x+42))
    cy0=max(0,dy+50);cy1=min(OUTPUT_CELL,dy+156)
    ys=(a[cy0:cy1,lo:hi]>150).sum(axis=1)
    first=np.where(ys>=34)[0]
    if not len(first):raise ValueError('Missing helmet top on output')
    return x,float(first[0]+cy0)


def main():
    p=argparse.ArgumentParser();p.add_argument('--input',type=Path,required=True)
    p.add_argument('--output',type=Path,required=True)
    p.add_argument('--source-manifest',type=Path,required=True)
    p.add_argument('--manifest-output',type=Path,required=True)
    args=p.parse_args()
    source=json.loads(args.source_manifest.read_text())
    actions=[]
    for old in source['actions']:
        id=old['id'];print('Stabilizing',id,flush=True)
        v=process(id,(args.input/f'{id}.png' if (args.input/f'{id}.png').exists() else args.input/f'{id}.webp'),args.output)
        for name in ('name','description','loop','sourceHeldFrames'):
            v[name]=old.get(name)
        actions.append(v)
        print(f"{id:14s} core offset span {v['beforeXRange']:5.1f}px -> {v['afterXRange']:3.1f}px; vertical {v['beforeYRange']:4.1f}px -> {v['afterYRange']:3.1f}px; edge {v['borderPixels']}",flush=True)
    manifest={'version':'3.0.0','count':len(actions),'fps':30,
              'frameSize':[OUTPUT_CELL,OUTPUT_CELL],
              'testDescription':'Head X and helmet top Y registered, 3px max frame drift, 12px fully transparent guard',
              'originalApprovedSourcesPreserved':True,'actions':actions}
    args.manifest_output.parent.mkdir(parents=True,exist_ok=True)
    args.manifest_output.write_text(json.dumps(manifest,indent=2)+'\n')
    assert len(actions)==14
    print('STABILIZED',len(actions),'clips and',14*60,'frames, with temporal-position QA passed',flush=True)
if __name__=='__main__':main()
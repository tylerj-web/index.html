#!/usr/bin/env python3
"""Fail-closed Orbit atlas QA for all *future* sprite sheets.

Production rule: do not export a pre-arranged grid by estimating equal
width from a collage. Generate/publish independent, registered RGBA frames,
then assemble into uniform padded cells. Transitions with disappearance,
portals, jet streaks have independent effect layers/explicit anchors.

Usage:
 python validate_future_atlas.py FILE --cols 10 --rows 6 --cell 320 --frames 60
"""
import argparse, json, sys
from pathlib import Path
import numpy as np
from PIL import Image

def main():
 p=argparse.ArgumentParser();p.add_argument('file',type=Path);p.add_argument('--cols',type=int,required=True);p.add_argument('--rows',type=int,required=True);p.add_argument('--cell',type=int,required=True);p.add_argument('--frames',type=int,required=True);p.add_argument('--edge',type=int,default=8);p.add_argument('--min-pad',type=int,default=9)
 a=p.parse_args();im=Image.open(a.file).convert('RGBA');expected=(a.cols*a.cell,a.rows*a.cell)
 issues=[]
 if im.size!=expected:issues.append(f'wrong dimensions {im.size} vs {expected}')
 if a.frames!=a.cols*a.rows:issues.append(f'frame count {a.frames} does not fill exact atlas cells {a.cols*a.rows}; pack explicit empty cells if needed')
 if a.edge>=a.cell//4:issues.append('edge guard too large for cell')
 if im.size==expected:
  alpha=np.asarray(im.getchannel('A'))
  for i in range(a.frames):
   x=(i%a.cols)*a.cell;y=(i//a.cols)*a.cell
   fr=alpha[y:y+a.cell,x:x+a.cell]
   if np.count_nonzero(fr[:a.edge,:]) or np.count_nonzero(fr[-a.edge:,:]) or np.count_nonzero(fr[:,:a.edge]) or np.count_nonzero(fr[:,-a.edge:]):
    issues.append(f'frame {i+1}: nontransparent pixels in edge guard — neighbour bleed/clipping')
   # Transparent frames are legitimate for teleport and hiding. Motion must
   # explicitly opt into empty frames in the action manifest instead of
   # inventing a placeholder robot pose.
 report={'file':a.file.name,'size':im.size,'frameCount':a.frames,'frameSize':a.cell,'edgeGuard':a.edge,'failures':issues,'passed':len(issues)==0}
 print(json.dumps(report,indent=2));return 0 if not issues else 1
if __name__=='__main__':sys.exit(main())
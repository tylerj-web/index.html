#!/usr/bin/env python3
"""Import the fourteen *user-approved* Orbit animation strips without inventing frames.
Keeps original source PNG, exports smaller full-resolution RGBA WebP for GitHub Pages.
Fails atomically on hash/dimension/source mismatches.
"""
from pathlib import Path
import hashlib, json, shutil, subprocess
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import binary_propagation

HERE = Path(__file__).resolve().parent
source = json.loads((HERE / "approved_sources.json").read_text())
target = HERE / "assets" / "approved"
tmp = HERE / "_approved_import_tmp"
tmp.mkdir(exist_ok=True, parents=True)
(target / "source").mkdir(parents=True, exist_ok=True)
source_list = source["actions"]
assert len(source_list)==14
manifest={"version":"2026-11-02","fps":30,"columns":10,"rows":6,"count":len(source_list),"status":"approved_reference_sheets","actions":[]}

for index, spec in enumerate(source_list, 1):
    id=spec["id"]
    original = tmp / f"{id}.png"
    print(f"[{index:02d}/14] Fetching {id}", flush=True)
    subprocess.run(["curl","--fail","--location","--retry","3","--max-time","180","-sS","-o",str(original),spec["sourceUrl"]], check=True)
    digest=hashlib.sha256(original.read_bytes()).hexdigest()
    if digest!=spec["sha256"]:
        raise RuntimeError(f"Hash mismatch for {id}: {digest}")
    with Image.open(original) as incoming:
        incoming.load()
        iw,ih=incoming.size
        if (iw,ih) not in {(1448,1086),(1619,971)}:
            raise RuntimeError(f"Unexpected image geometry {id}: {iw}x{ih}")
        if incoming.mode not in ("RGB","RGBA"):raise RuntimeError(f"Unexpected mode {id}: {incoming.mode}")
        rgba=incoming.convert("RGBA")
        if incoming.mode=="RGB":
            rgb=np.array(incoming,dtype=np.uint8)
            candidate=np.max(rgb,axis=2)<39
            # Dark exterior is connected to the outer image edges. The robot's
            # dark face is enclosed by its reflective helmet and stays opaque.
            seeds=np.zeros(candidate.shape,dtype=bool)
            seeds[0,:]=candidate[0,:];seeds[-1,:]=candidate[-1,:]
            seeds[:,0]=candidate[:,0];seeds[:,-1]=candidate[:,-1]
            outside=binary_propagation(seeds,mask=candidate)
            alpha=np.full(candidate.shape,255,dtype=np.uint8)
            alpha[outside]=0
            # Mild feather only along the cutout; do not blur character colours.
            rgba.putalpha(Image.fromarray(alpha,"L").filter(ImageFilter.GaussianBlur(.55)))
        # For the five older sheets, retain the approved original RGBA exactly:
        # their alphas include intentional tiny glow and partial-opacity pixels.
        webp=target/f"{id}.webp"
        rgba.save(webp,"WEBP",quality=92,method=6,exact=True)
        shutil.copy2(original,target/"source"/f"{id}.png")
        with Image.open(webp) as check:
            assert check.size==(iw,ih) and check.mode=="RGBA", (id,check.size,check.mode)
        entry={k:spec[k] for k in ("id","name","description","loop","columns","rows","frames")}
        entry.update({"fps":30,"width":iw,"height":ih,
                      "url":f"assets/approved/{id}.webp",
                      "original":f"assets/approved/source/{id}.png",
                      "source_sha256":digest,"render_method":"approved_generated_strip; not independent 3D render",
                      "cell_width":iw/10,"cell_height":ih/6,
                      "asset_bytes":webp.stat().st_size})
        manifest["actions"].append(entry)
        print(f"    sha256 verified; {iw}×{ih} → {webp.stat().st_size:,} bytes; 60 visible cells", flush=True)
(HERE/"manifest-approved.json").write_text(json.dumps(manifest,indent=2)+"\n")
shutil.rmtree(tmp)
print("IMPORTED 14 APPROVED SHEETS",flush=True)

#!/usr/bin/env python3
"""Download 600 unique images from Picsum Photos for 100 designs (6 each)."""
import os
import hashlib
import urllib.request
import time

GALLERY_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'media', 'designs', 'gallery')
os.makedirs(GALLERY_DIR, exist_ok=True)

TARGET = 600
DOWNLOADED = set()
HASHES = set()

def file_hash(data):
    return hashlib.md5(data).hexdigest()

def download_one(url, dest):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            h = file_hash(data)
            if h in HASHES:
                return False, "duplicate hash"
            with open(dest, 'wb') as f:
                f.write(data)
            HASHES.add(h)
            return True, "ok"
    except Exception as e:
        return False, str(e)

# Picsum gives unique images by ID. IDs 1-1000+ are valid.
# We'll use sequential IDs to guarantee uniqueness.
picsum_id = 1
count = 0
design_idx = 0

for design_num in range(1, 101):
    for img_num in range(1, 7):
        if count >= TARGET:
            break
        
        fname = f"design-{design_num:03d}-{img_num:02d}.jpg"
        dest = os.path.join(GALLERY_DIR, fname)
        
        # Skip if already exists
        if os.path.exists(dest) and os.path.getsize(dest) > 1000:
            count += 1
            continue
        
        # Try Picsum with sequential IDs for guaranteed uniqueness
        ok = False
        for attempt in range(3):
            url = f"https://picsum.photos/id/{picsum_id}/1200/800"
            ok, msg = download_one(url, dest)
            if ok:
                break
            picsum_id += 1
        
        if ok:
            count += 1
            if count % 20 == 0:
                print(f"  [{count}/{TARGET}] Downloaded {count} images...")
        else:
            print(f"  FAILED: {fname} (picsum_id={picsum_id})")
        
        picsum_id += 1
        time.sleep(0.05)  # Be polite
    
    if count >= TARGET:
        break

print(f"\nDone: {count} images downloaded to {GALLERY_DIR}")

# Verify
actual = len([f for f in os.listdir(GALLERY_DIR) if f.endswith('.jpg')])
print(f"Verification: {actual} jpg files in gallery directory")

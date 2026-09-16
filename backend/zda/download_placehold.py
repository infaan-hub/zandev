#!/usr/bin/env python3
"""Generate 600 unique images using placehold.co (fast, reliable)."""
import os
import urllib.request
import time

GALLERY_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'media', 'designs', 'gallery')
os.makedirs(GALLERY_DIR, exist_ok=True)

# Color palette for variety
COLORS = [
    "2563EB", "7C3AED", "DB2777", "DC2626", "EA580C",
    "D97706", "65A30D", "059669", "0891B2", "2563EB",
    "4F46E5", "7C3AED", "9333EA", "C026D3", "E11D48",
    "F43F5E", "F97316", "EAB308", "84CC16", "22C55E",
    "14B8A6", "06B6D4", "3B82F6", "6366F1", "8B5CF6",
    "A855F7", "D946EF", "EC4899", "F43F5E", "FB923C",
    "FBBF24", "A3E635", "4ADE80", "2DD4BF", "38BDF8",
    "818CF8", "A78BFA", "C084FC", "F472B6", "FB7185",
]

TARGET = 600
count = 0
skipped = 0

for design_num in range(1, 101):
    for img_num in range(1, 7):
        fname = f"design-{design_num:03d}-{img_num:02d}.jpg"
        dest = os.path.join(GALLERY_DIR, fname)
        
        if os.path.exists(dest) and os.path.getsize(dest) > 500:
            skipped += 1
            continue
        
        color = COLORS[(design_num + img_num) % len(COLORS)]
        label = f"Design {design_num}-{img_num}"
        url = f"https://placehold.co/1200x800/{color}/ffffff?text={label.replace(' ', '+')}"
        
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = resp.read()
                with open(dest, 'wb') as f:
                    f.write(data)
                count += 1
                if count % 50 == 0:
                    print(f"  [{count}/{TARGET}] Downloaded...")
        except Exception as e:
            print(f"  FAILED: {fname}: {e}")
        
        time.sleep(0.02)

print(f"\nDone: {count} new images, {skipped} skipped existing")
actual = len([f for f in os.listdir(GALLERY_DIR) if f.endswith('.jpg')])
print(f"Total: {actual} jpg files in gallery")

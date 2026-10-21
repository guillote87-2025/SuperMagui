#!/usr/bin/env python3
import os
import sys
import zipfile

src_dir = os.path.abspath('dist-electron/win-unpacked')
out_zip = os.path.abspath('dist-electron/SuperLista-Windows-x64.zip')

if not os.path.exists(src_dir):
    print(f"Error: {src_dir} does not exist", file=sys.stderr)
    sys.exit(1)

print(f"Creating clean Windows zip from {src_dir} -> {out_zip}...")
if os.path.exists(out_zip):
    os.remove(out_zip)

file_count = 0
with zipfile.ZipFile(out_zip, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as z:
    for root, dirs, files in os.walk(src_dir):
        for f in sorted(files):
            abs_path = os.path.join(root, f)
            rel_path = os.path.relpath(abs_path, src_dir)
            arcname = os.path.join('SuperLista-Windows', rel_path)
            z.write(abs_path, arcname)
            file_count += 1

size_mb = os.path.getsize(out_zip) / (1024 * 1024)
print(f"Successfully packaged {file_count} files into {out_zip} ({size_mb:.1f} MB)")

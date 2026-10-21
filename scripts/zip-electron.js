import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const sourceDir = path.resolve('dist-electron/win-unpacked');
const outputZip = path.resolve('dist-electron/SuperLista-Windows-x64.zip');

if (!fs.existsSync(sourceDir)) {
  console.error('Source directory does not exist:', sourceDir);
  process.exit(1);
}

console.log('Generando paquete ZIP para Windows con Python zipfile...');
const pythonCode = `
import os, zipfile
src = r"${sourceDir}"
out = r"${outputZip}"
if os.path.exists(out):
    os.remove(out)
with zipfile.ZipFile(out, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as z:
    for root, dirs, files in os.walk(src):
        for f in files:
            p = os.path.join(root, f)
            arcname = os.path.join('SuperLista-Windows', os.path.relpath(p, src))
            z.write(p, arcname)
`;

try {
  execSync(`python3 -c '${pythonCode}'`, { stdio: 'inherit' });
  const stats = fs.statSync(outputZip);
  console.log(`¡Archivo zip creado con éxito en ${outputZip}! (${(stats.size / 1024 / 1024).toFixed(1)} MB)`);
} catch (err) {
  console.error('Error generando zip:', err);
  process.exit(1);
}

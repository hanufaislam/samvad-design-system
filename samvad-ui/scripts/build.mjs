import { readFile, rm, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(resolve(root, 'published-baseline.json'), 'utf8'));
for (const file of manifest.files) {
  const data = await readFile(resolve(root, file.path));
  if (createHash('sha256').update(data).digest('hex') !== file.sha256) throw new Error(`Published baseline changed: ${file.path}`);
}
await rm(resolve(root, 'dist'), { recursive: true, force: true });
for (const file of manifest.files) {
  const destination = resolve(root, 'dist', file.path);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(resolve(root, file.path), destination);
}
console.log(`Built ${manifest.files.length} verified published files into samvad-ui/dist`);

// NusaData — penyiap paket kirim (Node 22, stdlib only).
//
// Cara pakai:  node main.ts
// Hasilnya:   MAKEFUN_OUTPUT_DIR (default /output) berisi salinan app/ dan
//             screenshots/ plus dossier.json yang ditulis lewat
//             buildDossier dari ./vendor/makefun-frontend.ts.
//
// Kalau screenshots/ masih kosong (belum ada tangkapan layar), skrip tetap
// jalan sampai selesai: folder output dibuat, app/ disalin, dan dossier
// dilewati dengan peringatan — jalankan lagi setelah screenshot terisi.

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoDir = resolve(dirname(fileURLToPath(import.meta.url)));
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

mkdirSync(outDir, { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });

// Salin app/ dan screenshots/ apa adanya ke folder output.
cpSync(join(repoDir, 'app'), join(outDir, 'app'), { recursive: true });
const shotsDir = join(repoDir, 'screenshots');
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });
}

const shots = readdirSync(join(outDir, 'screenshots'), { withFileTypes: true })
  .filter((e) => e.isFile() && !e.name.startsWith('.'))
  .map((e) => e.name);

if (shots.length === 0) {
  console.log('screenshots/ masih kosong — dossier.json dilewati.');
  console.log(`app/ sudah disalin ke ${outDir}. Ambil screenshot dulu, lalu jalankan lagi.`);
  process.exit(0);
}

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
console.log(`dossier.json ditulis (${dossier.length} byte) dari ${shots.length} screenshot ke ${outDir}.`);

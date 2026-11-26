[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/tukangcaribug/nusadata/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/tukangcaribug/nusadata/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

# NusaData — Portal Statistik Indonesia

Situs statis berbahasa Indonesia yang merangkum angka resmi Badan Pusat
Statistik (BPS): penduduk, ekonomi, kesehatan, pendidikan, dan 38 provinsi.
Tanpa build step, tanpa request jaringan saat dibuka — semua angka dan grafik
(SVG buatan sendiri) tersimpan di dalam situs.

## Menjalankan

```sh
node serve.ts            # http://localhost:8080
node serve.ts --port 8091
```

Buka `http://localhost:8091/` di browser. Navigasi memakai hash:
`#/`, `#/ekonomi`, `#/penduduk`, `#/kesehatan`, `#/pendidikan`,
`#/wilayah`, `#/wilayah/<kode-provinsi>`, `#/sumber`.

## Menyiapkan paket kirim

```sh
node main.ts   # salin app/ + screenshots/ ke MAKEFUN_OUTPUT_DIR (default /output), tulis dossier.json
```

Bila `screenshots/` masih kosong, `main.ts` tetap jalan dan melewati
dossier dengan peringatan; jalankan lagi setelah screenshot terisi
(lihat `shots.json` untuk daftar 4 screenshot).

## Struktur file

| File | Isi |
|---|---|
| `app/index.html` | Shell: header + nav + `<main id="app">` + footer |
| `app/style.css` | Semua CSS, responsif (breakpoint ~720px) |
| `app/data.js` | Semua angka (export `DATA`), dari BPS |
| `app/charts.js` | Grafik SVG murni: `lineChart`, `barChart`, `hbarChart`, `pyramid` |
| `app/views.js` | Render tiap halaman (beranda, ekonomi, penduduk, kesehatan, pendidikan, wilayah, detail provinsi, sumber) |
| `app/main.js` | Router hash + wiring kontrol (pemilih tahun, cari, urutkan) |
| `serve.ts` | Server statis dev (Node 22, stdlib only) |
| `main.ts` | Penyiap paket kirim + dossier |
| `shots.json` | Daftar 4 screenshot yang diambil koordinator |
| `vendor/makefun-frontend.ts` | Library dossier make.fun (jangan diubah) |

## Sumber data (BPS)

- Populasi 2020–2024 (270,20–281,60 juta), laju tumbuh 1,01% (2024),
  kepadatan 147 jiwa/km² (2024), penduduk kota 58,6% (2024):
  Sensus Penduduk 2020 & Proyeksi Penduduk.
- Piramida penduduk 2024 (0–14 / 15–64 / 65+, laki-laki/perempuan): BPS.
- PDB harga berlaku 2019–2024 (Rp15.833–22.139 triliun), pertumbuhan
  2019–2024 (5,02% s.d. 5,03%), PDB per kapita Rp78,6 juta / US$4.960
  (2024): Neraca PDB, BPS.
- Inflasi yoy Desember 2019–2024 (2,72%–1,57%): BPS.
- Ekspor US$264,70 miliar, impor US$233,66 miliar, surplus US$31,04
  miliar (2024): BPS.
- Pengangguran TPT Agustus 2020–2024 (7,07%–4,91%): Sakernas, BPS.
- Kemiskinan 2020–2024 (9,78%–8,57%), Maret 2025: 8,47% (24,06 juta
  jiwa); gini 0,379 (Sep 2024): BPS.
- IPM 2020–2024 (71,94–75,02); harapan hidup 2020–2024 (71,47–74,15
  tahun): BPS.
- Kematian bayi sekitar 17 per 1.000 kelahiran hidup (2023); stunting
  balita 19,8% (2024); cakupan JKN 98,7% penduduk (2024): SKI/SSGI & BPS.
- Rata-rata lama sekolah 2020–2024 (8,48–9,25 tahun); harapan lama
  sekolah 13,21 tahun (2024); melek huruf usia 15+ 96,6% (2024):
  Susenas, BPS.
- Populasi & luas 38 provinsi (2024): BPS. Kepadatan dihitung dari
  populasi ÷ luas. Aceh: 5,55 juta jiwa, 57,96 ribu km² (BPS, Aceh
  Dalam Angka 2025).

Angka dibulatkan; lihat publikasi asli BPS di bps.go.id.

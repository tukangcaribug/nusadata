// NusaData — semua angka situs. Sumber: BPS (lihat halaman #/sumber).
// Angka ditulis persis seperti rilis BPS; format tampilan Indonesia
// (koma desimal, titik ribuan) dibuat fungsi fmtId di bawah.

export const DATA = {
  // Populasi (juta jiwa)
  population: { 2020: 270.2, 2021: 272.68, 2022: 275.77, 2023: 278.69, 2024: 281.6 },
  growthRate2024: 1.01, // % per tahun
  density2024: 147, // jiwa/km2
  urban2024: 58.6, // % penduduk kota

  // Piramida penduduk 2024 (% penduduk)
  pyramid2024: [
    { group: '0–14', male: 12.1, female: 11.6 },
    { group: '15–64', male: 34.9, female: 34.1 },
    { group: '65+', male: 3.4, female: 3.9 },
  ],

  // PDB harga berlaku (Rp triliun)
  gdpNominal: { 2019: 15833, 2020: 15444, 2021: 16977, 2022: 19588, 2023: 20892, 2024: 22139 },
  // Pertumbuhan PDB (%)
  gdpGrowth: { 2019: 5.02, 2020: -2.07, 2021: 3.7, 2022: 5.31, 2023: 5.05, 2024: 5.03 },
  gdpPerCapita2024: 'Rp78,6 juta',
  gdpPerCapitaUsd2024: 'US$4.960',

  // Inflasi (% yoy Desember)
  inflation: { 2019: 2.72, 2020: 1.68, 2021: 1.87, 2022: 5.51, 2023: 2.61, 2024: 1.57 },

  // Perdagangan 2024 (US$ miliar)
  exports2024: 264.7,
  imports2024: 233.66,
  surplus2024: 31.04,

  // Pengangguran TPT, Agustus (%)
  unemployment: { 2020: 7.07, 2021: 6.49, 2022: 5.86, 2023: 5.45, 2024: 4.91 },
  // Kemiskinan (%)
  poverty: { 2020: 9.78, 2021: 9.71, 2022: 9.57, 2023: 9.36, 2024: 8.57 },
  povertyMar2025: 8.47, // Maret 2025
  povertyMar2025People: 24.06, // juta jiwa, Maret 2025
  giniSep2024: 0.379,

  // IPM
  hdi: { 2020: 71.94, 2021: 72.29, 2022: 72.91, 2023: 74.39, 2024: 75.02 },

  // Kesehatan
  lifeExpectancy: { 2020: 71.47, 2021: 71.85, 2022: 72.54, 2023: 73.93, 2024: 74.15 },
  infantMortality2023: 17, // per 1.000 kelahiran hidup, sekitar
  stunting2024: 19.8, // % balita
  jkn2024: 98.7, // % penduduk terdaftar JKN

  // Pendidikan
  avgSchooling: { 2020: 8.48, 2021: 8.58, 2022: 8.69, 2023: 8.77, 2024: 9.25 },
  expectedSchooling2024: 13.21, // tahun
  literacy2024: 96.6, // % usia 15+

  // Provinsi 2024: populasi (juta jiwa), luas (ribu km2).
  // Kepadatan dihitung di JS: populasi x 1.000 / luas.
  // Aceh: 5,55 juta (pertengahan 2024, BPS, Provinsi Aceh Dalam Angka 2025),
  // luas 57,96 ribu km2 (BPS).
  provinces: [
    { code: 'aceh', name: 'Aceh', pop: 5.55, area: 57.96 },
    { code: 'sumut', name: 'Sumatera Utara', pop: 15.59, area: 72.98 },
    { code: 'sumbar', name: 'Sumatera Barat', pop: 5.85, area: 42.01 },
    { code: 'riau', name: 'Riau', pop: 6.73, area: 87.02 },
    { code: 'jambi', name: 'Jambi', pop: 3.64, area: 50.06 },
    { code: 'sumsel', name: 'Sumatera Selatan', pop: 8.84, area: 91.59 },
    { code: 'bengkulu', name: 'Bengkulu', pop: 2.09, area: 19.92 },
    { code: 'lampung', name: 'Lampung', pop: 9.12, area: 34.62 },
    { code: 'babel', name: 'Kep. Bangka Belitung', pop: 1.49, area: 16.42 },
    { code: 'kepri', name: 'Kep. Riau', pop: 2.13, area: 8.2 },
    { code: 'dki', name: 'DKI Jakarta', pop: 10.68, area: 0.66 },
    { code: 'jabar', name: 'Jawa Barat', pop: 49.94, area: 35.38 },
    { code: 'jateng', name: 'Jawa Tengah', pop: 37.89, area: 32.8 },
    { code: 'diy', name: 'DI Yogyakarta', pop: 3.76, area: 3.13 },
    { code: 'jatim', name: 'Jawa Timur', pop: 41.81, area: 47.8 },
    { code: 'banten', name: 'Banten', pop: 12.43, area: 9.66 },
    { code: 'bali', name: 'Bali', pop: 4.34, area: 5.78 },
    { code: 'ntb', name: 'Nusa Tenggara Barat', pop: 5.66, area: 18.57 },
    { code: 'ntt', name: 'Nusa Tenggara Timur', pop: 5.66, area: 47.93 },
    { code: 'kalbar', name: 'Kalimantan Barat', pop: 5.8, area: 147.31 },
    { code: 'kalteng', name: 'Kalimantan Tengah', pop: 2.81, area: 153.56 },
    { code: 'kalsel', name: 'Kalimantan Selatan', pop: 4.24, area: 38.74 },
    { code: 'kaltim', name: 'Kalimantan Timur', pop: 4.03, area: 127.35 },
    { code: 'kaltara', name: 'Kalimantan Utara', pop: 0.73, area: 75.47 },
    { code: 'sulut', name: 'Sulawesi Utara', pop: 2.73, area: 13.85 },
    { code: 'sulteng', name: 'Sulawesi Tengah', pop: 3.08, area: 61.84 },
    { code: 'sulsel', name: 'Sulawesi Selatan', pop: 9.36, area: 46.72 },
    { code: 'sultra', name: 'Sulawesi Tenggara', pop: 2.79, area: 38.07 },
    { code: 'gorontalo', name: 'Gorontalo', pop: 1.25, area: 11.26 },
    { code: 'sulbar', name: 'Sulawesi Barat', pop: 1.57, area: 16.79 },
    { code: 'maluku', name: 'Maluku', pop: 1.98, area: 46.91 },
    { code: 'malut', name: 'Maluku Utara', pop: 1.45, area: 31.98 },
    { code: 'papua', name: 'Papua', pop: 1.08, area: 319.04 },
    { code: 'papuabarat', name: 'Papua Barat', pop: 0.6, area: 64.52 },
    { code: 'papuaselatan', name: 'Papua Selatan', pop: 0.55, area: 127.29 },
    { code: 'papuatengah', name: 'Papua Tengah', pop: 1.35, area: 61.07 },
    { code: 'papuapegunungan', name: 'Papua Pegunungan', pop: 1.47, area: 51.21 },
    { code: 'papuabaratdaya', name: 'Papua Barat Daya', pop: 0.62, area: 38.93 },
  ],

  releases: [
    { title: 'Pertumbuhan Ekonomi 2024: 5,03%', date: '5 Feb 2025', source: 'BPS' },
    { title: 'Kemiskinan Maret 2025: 8,47%', date: '25 Jul 2025', source: 'BPS' },
    { title: 'IPM 2024: 75,02', date: '15 Nov 2024', source: 'BPS' },
  ],
};

/** Kepadatan provinsi (jiwa/km2), turunan aritmetika dari populasi/luas. */
export function densityOf(p) {
  if (p.pop == null || p.area == null) return null;
  return Math.round((p.pop * 1000) / p.area);
}

/** Tahun-tahun yang tersedia untuk pemilih tahun. */
export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

/** Format angka gaya Indonesia: 15833 -> "15.833"; 5.02 d=2 -> "5,02". */
export function fmtId(n, decimals = 0) {
  if (n == null || Number.isNaN(n)) return '—';
  const fixed = Number(n).toFixed(decimals);
  const [int, dec] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return dec === undefined ? grouped : grouped + ',' + dec;
}

/** Format dengan tanda minus Indonesia (−) untuk nilai negatif. */
export function fmtSigned(n, decimals = 2) {
  if (n == null) return '—';
  const s = fmtId(Math.abs(n), decimals);
  return n < 0 ? '−' + s : s;
}

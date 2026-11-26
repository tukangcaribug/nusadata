// NusaData — render tiap halaman. Semua nilai di-escape sebelum masuk HTML.
import { DATA, YEARS, densityOf, fmtId, fmtSigned } from './data.js';
import { lineChart, barChart, hbarChart, pyramid } from './charts.js';

export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function statCard(label, value, sub, cls = '') {
  return `<div class="stat-card ${cls}"><div class="label">${esc(label)}</div><div class="value">${value}</div><div class="sub">${esc(sub)}</div></div>`;
}

function yearSelect(selected, minYear = 2019) {
  const opts = YEARS.filter((y) => y >= minYear)
    .map((y) => `<option value="${y}"${y === selected ? ' selected' : ''}>${y}</option>`)
    .join('');
  return `<label for="year-select">Tahun</label><select id="year-select" aria-label="Pilih tahun">${opts}</select>`;
}

function topProvinces(n = 5) {
  return [...DATA.provinces]
    .filter((p) => p.pop != null)
    .sort((a, b) => b.pop - a.pop)
    .slice(0, n);
}

function provinceRowsTable(rows) {
  return `<div class="table-wrap"><table>
    <thead><tr><th>#</th><th>Provinsi</th><th class="num">Populasi 2024 (juta)</th><th class="num">Luas (km²)</th><th class="num">Kepadatan (jiwa/km²)</th></tr></thead>
    <tbody>${rows.map((p, i) => `<tr><td>${i + 1}</td><td><a href="#/wilayah/${esc(p.code)}">${esc(p.name)}</a></td><td class="num">${fmtId(p.pop, 2)}</td><td class="num">${fmtId(p.area * 1000)}</td><td class="num">${fmtId(densityOf(p))}</td></tr>`).join('')}</tbody>
  </table></div>`;
}

// ---------------------------------------------------------------- beranda

export function homeView() {
  const d = DATA;
  const growth = Object.entries(d.gdpGrowth).map(([y, v]) => ({ label: y, value: v }));
  const infl = Object.entries(d.inflation).map(([y, v]) => ({ label: y, value: v }));
  return `
  <span class="kicker">Portal Statistik Indonesia</span>
  <h1>Indonesia dalam angka — 2024</h1>
  <p class="lede">NusaData merangkum angka resmi Badan Pusat Statistik (BPS) tentang penduduk, ekonomi, kesehatan, dan pendidikan Indonesia — dalam satu tempat, dengan grafik yang mudah dibaca.</p>
  <div class="stat-grid">
    ${statCard('Populasi 2024', fmtId(d.population[2024], 2) + ' <span class="unit">juta</span>', 'Laju tumbuh ' + fmtId(d.growthRate2024, 2) + '% per tahun', 'accent')}
    ${statCard('PDB 2024', 'Rp' + fmtId(d.gdpNominal[2024]) + ' <span class="unit">triliun</span>', 'Harga berlaku', 'teal')}
    ${statCard('Pertumbuhan PDB 2024', fmtId(d.gdpGrowth[2024], 2) + '<span class="unit">%</span>', '2019: ' + fmtId(d.gdpGrowth[2019], 2) + '% · 2020: ' + fmtSigned(d.gdpGrowth[2020]) + '%', 'accent')}
    ${statCard('Inflasi Des 2024', fmtId(d.inflation[2024], 2) + '<span class="unit">%</span>', 'yoy, Desember', 'teal')}
    ${statCard('Pengangguran Agt 2024', fmtId(d.unemployment[2024], 2) + '<span class="unit">%</span>', 'Tingkat Pengangguran Terbuka', 'accent')}
    ${statCard('Kemiskinan Sep 2024', fmtId(d.poverty[2024], 2) + '<span class="unit">%</span>', 'Maret 2025: ' + fmtId(d.povertyMar2025, 2) + '% (' + fmtId(d.povertyMar2025People, 2) + ' juta jiwa)', 'teal')}
    ${statCard('IPM 2024', fmtId(d.hdi[2024], 2), '2020: ' + fmtId(d.hdi[2020], 2), 'accent')}
    ${statCard('Harapan hidup 2024', fmtId(d.lifeExpectancy[2024], 2) + ' <span class="unit">tahun</span>', '2020: ' + fmtId(d.lifeExpectancy[2020], 2) + ' tahun', 'teal')}
  </div>
  <div class="chart-grid">
    <div class="panel"><h3>Pertumbuhan PDB, 2019–2024</h3>${lineChart(growth, { title: '', decimals: 2, unit: '%', color: '#1f7a6d', signed: true })}<p class="src">Persen per tahun. Sumber: BPS.</p></div>
    <div class="panel"><h3>Inflasi, 2019–2024</h3>${barChart(infl, { title: '', decimals: 2, unit: '%', color: '#e8a13a' })}<p class="src">Persen yoy Desember. Sumber: BPS.</p></div>
  </div>
  <h2>Provinsi terpadat, 2024</h2>
  ${provinceRowsTable(topProvinces(5))}
  <p class="note">Luas dalam km²; kepadatan = populasi ÷ luas. <a href="#/wilayah">Lihat 38 provinsi →</a></p>
  <h2>Jelajahi data</h2>
  <div class="link-grid">
    <a class="link-card" href="#/ekonomi"><div class="t">Ekonomi</div><div class="d">PDB, pertumbuhan, inflasi, dan perdagangan 2019–2024.</div><div class="go">Buka ekonomi →</div></a>
    <a class="link-card teal" href="#/penduduk"><div class="t">Penduduk</div><div class="d">Populasi, piramida penduduk, dan kepadatan per provinsi.</div><div class="go">Buka penduduk →</div></a>
    <a class="link-card" href="#/kesehatan"><div class="t">Kesehatan</div><div class="d">Harapan hidup, kematian bayi, stunting, dan JKN.</div><div class="go">Buka kesehatan →</div></a>
    <a class="link-card teal" href="#/pendidikan"><div class="t">Pendidikan</div><div class="d">Lama sekolah, harapan lama sekolah, dan melek huruf.</div><div class="go">Buka pendidikan →</div></a>
    <a class="link-card" href="#/wilayah"><div class="t">Wilayah</div><div class="d">38 provinsi: cari, urutkan, dan bandingkan.</div><div class="go">Buka wilayah →</div></a>
    <a class="link-card teal" href="#/sumber"><div class="t">Sumber Data</div><div class="d">Dari mana setiap angka berasal — publikasi BPS.</div><div class="go">Buka sumber →</div></a>
  </div>
  <h2>Rilis terbaru</h2>
  <div class="panel"><ul class="release-list">
    ${d.releases.map((r) => `<li><span class="date">${esc(r.date)}</span><span class="rt">${esc(r.title)}</span><span class="rs">${esc(r.source)}</span></li>`).join('')}
  </ul></div>`;
}

// ---------------------------------------------------------------- ekonomi

export function economyView(year = 2024) {
  const d = DATA;
  const y = d.gdpNominal[year] !== undefined ? year : 2024;
  const gdp = Object.entries(d.gdpNominal).map(([yy, v]) => ({ label: yy, value: v }));
  const growth = Object.entries(d.gdpGrowth).map(([yy, v]) => ({ label: yy, value: v }));
  const rows = YEARS.map((yy) => `<tr${yy === y ? ' class="hl"' : ''}><td>${yy}</td><td class="num">${fmtId(d.gdpNominal[yy])}</td><td class="num">${fmtSigned(d.gdpGrowth[yy])}</td><td class="num">${fmtId(d.inflation[yy], 2)}</td></tr>`).join('');
  return `
  <span class="kicker">Ekonomi</span>
  <h1>Ekonomi Indonesia</h1>
  <p class="lede">PDB harga berlaku, pertumbuhan, inflasi, dan perdagangan luar negeri. Pilih tahun untuk melihat angka tahun itu.</p>
  <div class="controls">${yearSelect(y)}</div>
  <div class="stat-grid">
    ${statCard('PDB ' + y, 'Rp' + fmtId(d.gdpNominal[y]) + ' <span class="unit">triliun</span>', 'Harga berlaku', 'accent')}
    ${statCard('Pertumbuhan ' + y, fmtSigned(d.gdpGrowth[y]) + '<span class="unit">%</span>', 'Terhadap tahun sebelumnya', 'teal')}
    ${statCard('PDB per kapita 2024', esc(d.gdpPerCapita2024), '≈' + esc(d.gdpPerCapitaUsd2024), 'accent')}
    ${statCard('Inflasi Des ' + y, fmtId(d.inflation[y], 2) + '<span class="unit">%</span>', 'yoy, Desember', 'teal')}
    ${statCard('Ekspor 2024', 'US$' + fmtId(d.exports2024, 2) + ' <span class="unit">miliar</span>', 'Nilai ekspor barang', 'accent')}
    ${statCard('Impor 2024', 'US$' + fmtId(d.imports2024, 2) + ' <span class="unit">miliar</span>', 'Nilai impor barang', 'teal')}
    ${statCard('Surplus dagang 2024', 'US$' + fmtId(d.surplus2024, 2) + ' <span class="unit">miliar</span>', 'Ekspor dikurangi impor', 'accent')}
    ${statCard('Gini Sep 2024', fmtId(d.giniSep2024, 3), 'Rasio gini, September 2024', 'teal')}
  </div>
  <div class="chart-grid">
    <div class="panel"><h3>PDB harga berlaku, 2019–2024</h3>${lineChart(gdp, { title: '', decimals: 0, unit: 'Rp T', color: '#1f7a6d' })}<p class="src">Rp triliun. Sumber: BPS.</p></div>
    <div class="panel"><h3>Pertumbuhan PDB, 2019–2024</h3>${barChart(growth, { title: '', decimals: 2, unit: '%', color: '#e8a13a', signed: true })}<p class="src">Persen per tahun. 2020 terkontraksi −2,07% saat pandemi. Sumber: BPS.</p></div>
  </div>
  <h2>Ringkasan tahunan, 2019–2024</h2>
  <div class="table-wrap"><table>
    <thead><tr><th>Tahun</th><th class="num">PDB (Rp triliun)</th><th class="num">Pertumbuhan (%)</th><th class="num">Inflasi Des (%)</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>
  <p class="note">Angka harga berlaku, BPS. Baris yang disorot adalah tahun yang dipilih di atas. PDB per kapita, ekspor, impor, dan surplus tersedia untuk 2024.</p>`;
}

// ---------------------------------------------------------------- penduduk

export function populationView(year = 2024) {
  const d = DATA;
  const y = d.population[year] !== undefined ? year : 2024;
  const pop = Object.entries(d.population).map(([yy, v]) => ({ label: yy, value: v }));
  return `
  <span class="kicker">Penduduk</span>
  <h1>Penduduk Indonesia</h1>
  <p class="lede">Jumlah, laju tumbuh, kepadatan, dan struktur umur penduduk. Pilih tahun untuk melihat populasi tahun itu.</p>
  <div class="controls">${yearSelect(y, 2020)}</div>
  <div class="stat-grid cols-3">
    ${statCard('Populasi ' + y, fmtId(d.population[y], 2) + ' <span class="unit">juta</span>', '2020: ' + fmtId(d.population[2020], 2) + ' juta', 'accent')}
    ${statCard('Laju tumbuh 2024', fmtId(d.growthRate2024, 2) + '<span class="unit">%</span>', 'Per tahun', 'teal')}
    ${statCard('Kepadatan 2024', fmtId(d.density2024) + ' <span class="unit">jiwa/km²</span>', 'Rata-rata nasional', 'accent')}
    ${statCard('Penduduk kota 2024', fmtId(d.urban2024, 1) + '<span class="unit">%</span>', 'Tinggal di daerah perkotaan', 'teal')}
    ${statCard('Penduduk 0–14 thn 2024', fmtId(12.1 + 11.6, 1) + '<span class="unit">%</span>', 'Laki-laki 12,1% + perempuan 11,6%', 'accent')}
    ${statCard('Penduduk 65+ thn 2024', fmtId(3.4 + 3.9, 1) + '<span class="unit">%</span>', 'Laki-laki 3,4% + perempuan 3,9%', 'teal')}
  </div>
  <div class="panel"><h3>Piramida penduduk, 2024</h3>${pyramid(d.pyramid2024, { title: 'Piramida Penduduk 2024' })}<p class="src">Kelompok umur 15–64 tahun adalah yang terbesar: 69,0% penduduk. Sumber: BPS.</p></div>
  <div class="panel"><h3>Populasi, 2020–2024</h3>${lineChart(pop, { title: '', decimals: 2, unit: 'juta', color: '#1f7a6d' })}<p class="src">Juta jiwa. Sumber: BPS, Sensus Penduduk 2020 dan Proyeksi Penduduk.</p></div>
  <h2>Provinsi terpadat, 2024</h2>
  ${provinceRowsTable(topProvinces(10))}
  <p class="note">Luas dalam km²; kepadatan = populasi ÷ luas. <a href="#/wilayah">Lihat semua provinsi →</a></p>`;
}

// ---------------------------------------------------------------- kesehatan

export function healthView() {
  const d = DATA;
  const le = Object.entries(d.lifeExpectancy).map(([yy, v]) => ({ label: yy, value: v }));
  return `
  <span class="kicker">Kesehatan</span>
  <h1>Kesehatan Indonesia</h1>
  <p class="lede">Harapan hidup terus naik; stunting balita masih jadi pekerjaan rumah besar.</p>
  <div class="stat-grid cols-3">
    ${statCard('Harapan hidup 2024', fmtId(d.lifeExpectancy[2024], 2) + ' <span class="unit">tahun</span>', '2020: ' + fmtId(d.lifeExpectancy[2020], 2) + ' tahun', 'accent')}
    ${statCard('Kematian bayi 2023', '≈' + fmtId(d.infantMortality2023) + ' <span class="unit">per 1.000</span>', 'Per 1.000 kelahiran hidup', 'teal')}
    ${statCard('Stunting balita 2024', fmtId(d.stunting2024, 1) + '<span class="unit">%</span>', 'Balita pendek (SSGI/SKI)', 'accent')}
    ${statCard('Cakupan JKN 2024', fmtId(d.jkn2024, 1) + '<span class="unit">%</span>', 'Penduduk terdaftar JKN', 'teal')}
  </div>
  <div class="panel"><h3>Harapan hidup, 2020–2024</h3>${barChart(le, { title: '', decimals: 2, unit: 'tahun', color: '#1f7a6d' })}<p class="src">Tahun. Sumber: BPS.</p></div>
  <h2>Apa arti tiap indikator?</h2>
  <div class="panel">
    <h3>Harapan hidup saat lahir — 74,15 tahun (2024)</h3>
    <p>Rata-rata tahun yang diperkirakan dijalani bayi yang lahir pada 2024. Naik dari 71,47 tahun pada 2020. Sumber: BPS.</p>
    <h3>Angka kematian bayi — sekitar 17 per 1.000 kelahiran hidup (2023)</h3>
    <p>Jumlah bayi meninggal sebelum usia satu tahun per 1.000 kelahiran hidup. Angka dibulatkan. Sumber: BPS.</p>
    <h3>Stunting balita — 19,8% (2024)</h3>
    <p>Balita dengan tinggi badan di bawah standar usianya. Sumber: Survei Kesehatan Indonesia / SSGI, BPS.</p>
    <h3>Cakupan JKN — 98,7% penduduk (2024)</h3>
    <p>Penduduk yang terdaftar sebagai peserta Jaminan Kesehatan Nasional. Sumber: BPS.</p>
  </div>`;
}

// ---------------------------------------------------------------- pendidikan

export function educationView() {
  const d = DATA;
  const sc = Object.entries(d.avgSchooling).map(([yy, v]) => ({ label: yy, value: v }));
  return `
  <span class="kicker">Pendidikan</span>
  <h1>Pendidikan Indonesia</h1>
  <p class="lede">Rata-rata lama sekolah naik perlahan; hampir semua penduduk usia 15 tahun ke atas sudah melek huruf.</p>
  <div class="stat-grid cols-3">
    ${statCard('Rata-rata lama sekolah 2024', fmtId(d.avgSchooling[2024], 2) + ' <span class="unit">tahun</span>', '2020: ' + fmtId(d.avgSchooling[2020], 2) + ' tahun', 'accent')}
    ${statCard('Harapan lama sekolah 2024', fmtId(d.expectedSchooling2024, 2) + ' <span class="unit">tahun</span>', 'Lama sekolah yang diharapkan dijalani', 'teal')}
    ${statCard('Melek huruf 15+ 2024', fmtId(d.literacy2024, 1) + '<span class="unit">%</span>', 'Penduduk usia 15 tahun ke atas', 'accent')}
  </div>
  <div class="panel"><h3>Rata-rata lama sekolah, 2020–2024</h3>${barChart(sc, { title: '', decimals: 2, unit: 'tahun', color: '#e8a13a' })}<p class="src">Tahun. Sumber: BPS.</p></div>
  <div class="panel">
    <h3>Membaca angka-angka ini</h3>
    <p><strong>Rata-rata lama sekolah</strong> 9,25 tahun (2024) berarti penduduk usia 25 tahun ke atas rata-rata bersekolah sekitar 9 tahun — setara tamat SMP. Angka ini naik dari 8,48 tahun pada 2020.</p>
    <p><strong>Harapan lama sekolah</strong> 13,21 tahun (2024) berarti anak usia 7 tahun diperkirakan akan bersekolah selama 13 tahun ke depan — setara tamat SMA dan setahun kuliah.</p>
    <p><strong>Melek huruf</strong> 96,6% (2024) berarti hampir 97 dari 100 penduduk usia 15 tahun ke atas dapat membaca dan menulis.</p>
    <p class="src">Sumber: BPS, Survei Sosial Ekonomi Nasional.</p>
  </div>`;
}

// ---------------------------------------------------------------- wilayah

export function regionsView() {
  return `
  <span class="kicker">Wilayah</span>
  <h1>38 Provinsi</h1>
  <p class="lede">Populasi, luas, dan kepadatan tiap provinsi, 2024. Cari nama provinsi atau urutkan tabelnya. Klik nama provinsi untuk detail.</p>
  <div class="controls">
    <input type="search" id="prov-search" class="search-box" placeholder="Cari provinsi… (mis. Jawa, Papua)" aria-label="Cari provinsi">
    <span class="note">Urutkan:</span>
    <button class="btn sort-btn active" data-sort="pop" type="button">Populasi</button>
    <button class="btn sort-btn" data-sort="density" type="button">Kepadatan</button>
    <button class="btn sort-btn" data-sort="name" type="button">Nama</button>
  </div>
  <div class="table-wrap"><table>
    <thead><tr><th>#</th><th>Provinsi</th><th class="num">Populasi 2024 (juta)</th><th class="num">Luas (km²)</th><th class="num">Kepadatan (jiwa/km²)</th></tr></thead>
    <tbody id="prov-body"></tbody>
  </table></div>
  <p class="note" id="prov-count"></p>
  <p class="note">Kepadatan = populasi ÷ luas. 38 provinsi dengan angka 2024. Sumber: BPS.</p>`;
}

export function provinceRows(rows) {
  if (rows.length === 0) return '<tr><td colspan="5">Tidak ada provinsi yang cocok. Coba kata kunci lain.</td></tr>';
  return rows.map((p, i) => {
    const pop = p.pop == null ? '—' : fmtId(p.pop, 2);
    const area = p.area == null ? '—' : fmtId(p.area * 1000);
    const dens = densityOf(p);
    return `<tr><td>${i + 1}</td><td><a href="#/wilayah/${esc(p.code)}">${esc(p.name)}</a></td><td class="num">${pop}</td><td class="num">${area}</td><td class="num">${dens == null ? '—' : fmtId(dens)}</td></tr>`;
  }).join('');
}

export function regionDetail(code) {
  const p = DATA.provinces.find((x) => x.code === code);
  if (!p) return `<h1>Provinsi tidak ditemukan</h1><p class="lede">Kode provinsi “${esc(code)}” tidak ada dalam daftar. <a href="#/wilayah">Kembali ke daftar provinsi →</a></p>`;
  const ranked = [...DATA.provinces].filter((x) => x.pop != null).sort((a, b) => b.pop - a.pop);
  const rank = p.pop == null ? null : ranked.findIndex((x) => x.code === p.code) + 1;
  const share = p.pop == null ? null : (p.pop / DATA.population[2024]) * 100;
  const dens = densityOf(p);
  const densNote = dens == null ? '—' : dens > DATA.density2024
    ? fmtId(dens) + ' jiwa/km² — di atas rata-rata nasional ' + fmtId(DATA.density2024) + ' jiwa/km²'
    : fmtId(dens) + ' jiwa/km² — di bawah rata-rata nasional ' + fmtId(DATA.density2024) + ' jiwa/km²';
  return `
  <span class="kicker">Wilayah · 2024</span>
  <h1>${esc(p.name)}</h1>
  <p class="lede"><a href="#/wilayah">← Kembali ke daftar 38 provinsi</a></p>
  ${p.pop == null
    ? '<div class="panel"><p>Angka provinsi ini belum tercantum dalam rilis BPS yang dipakai situs ini, jadi belum bisa ditampilkan. Lihat <a href="#/sumber">halaman sumber</a> untuk daftar publikasi yang dipakai.</p></div>'
    : `<div class="stat-grid cols-3">
      ${statCard('Populasi 2024', fmtId(p.pop, 2) + ' <span class="unit">juta</span>', 'Peringkat ' + rank + ' dari 38 provinsi', 'accent')}
      ${statCard('Luas', fmtId(p.area * 1000) + ' <span class="unit">km²</span>', fmtId(p.area, 2) + ' ribu km²', 'teal')}
      ${statCard('Kepadatan 2024', fmtId(dens) + ' <span class="unit">jiwa/km²</span>', 'Nasional: ' + fmtId(DATA.density2024) + ' jiwa/km²', 'accent')}
    </div>
    <div class="panel">
      <h3>Perbandingan dengan nasional</h3>
      <p><strong>${esc(p.name)}</strong> dihuni ${fmtId(p.pop, 2)} juta jiwa — ${fmtId(share, 1)}% dari total penduduk Indonesia ${fmtId(DATA.population[2024], 2)} juta jiwa (2024).</p>
      <p>Kepadatan ${esc(p.name)} ${esc(densNote)}.</p>
      <p>Peringkat populasi: <strong>${rank}</strong> dari 38 provinsi.</p>
      <p class="src">Sumber: BPS, 2024. Kepadatan dihitung dari populasi ÷ luas.</p>
    </div>`}
  <p><a href="#/wilayah">← Semua provinsi</a> · <a href="#/">Beranda</a></p>`;
}

// ---------------------------------------------------------------- sumber

export function sourcesView() {
  const items = [
    ['Penduduk & proyeksi', 'Sensus Penduduk 2020 dan Proyeksi Penduduk — BPS. Populasi 2020–2024, laju tumbuh 1,01% (2024), kepadatan 147 jiwa/km² (2024), penduduk kota 58,6% (2024), piramida penduduk 2024.'],
    ['PDB & pertumbuhan', 'Neraca PDB — BPS. PDB harga berlaku 2019–2024 (Rp15.833–22.139 triliun), pertumbuhan 2019–2024, PDB per kapita Rp78,6 juta / US$4.960 (2024).'],
    ['Inflasi', 'BPS. Inflasi yoy Desember 2019–2024 (2,72%–1,57%).'],
    ['Perdagangan luar negeri', 'BPS. Ekspor US$264,70 miliar, impor US$233,66 miliar, surplus US$31,04 miliar (2024).'],
    ['Ketenagakerjaan', 'Survei Angkatan Kerja Nasional (Sakernas) — BPS. Tingkat Pengangguran Terbuka Agustus 2020–2024 (7,07%–4,91%).'],
    ['Kemiskinan & ketimpangan', 'BPS. Kemiskinan 2020–2024 (9,78%–8,57%), Maret 2025: 8,47% (24,06 juta jiwa); rasio gini 0,379 (September 2024).'],
    ['Pembangunan manusia', 'BPS. IPM 2020–2024 (71,94–75,02); harapan hidup 2020–2024 (71,47–74,15 tahun).'],
    ['Kesehatan', 'Survei Kesehatan Indonesia / SSGI dan BPS. Angka kematian bayi sekitar 17 per 1.000 kelahiran hidup (2023); stunting balita 19,8% (2024); cakupan JKN 98,7% penduduk (2024).'],
    ['Pendidikan', 'Survei Sosial Ekonomi Nasional — BPS. Rata-rata lama sekolah 2020–2024 (8,48–9,25 tahun); harapan lama sekolah 13,21 tahun (2024); melek huruf usia 15+ 96,6% (2024).'],
    ['Provinsi', 'BPS. Populasi dan luas 38 provinsi, 2024. Kepadatan dihitung situs ini dari populasi ÷ luas.'],
  ];
  return `
  <span class="kicker">Sumber Data</span>
  <h1>Dari mana angka-angka ini berasal?</h1>
  <p class="lede">Semua angka di NusaData berasal dari publikasi Badan Pusat Statistik (BPS). Angka dibulatkan; lihat publikasi asli BPS di bps.go.id untuk angka lengkap dan metodologi.</p>
  <ul class="source-list">
    ${items.map(([t, d]) => `<li><div class="st">${esc(t)}</div><div class="sd">${esc(d)}</div></li>`).join('')}
  </ul>
  <div class="panel">
    <h3>Catatan</h3>
    <p>Angka dibulatkan untuk keterbacaan; tahun selalu dicantumkan di samping tiap angka. Angka kematian bayi 2023 ditulis “sekitar 17” karena rilis BPS membulatkannya. Situs ini tidak mengambil data dari internet saat dibuka — semua angka tersimpan di dalam situs.</p>
    <p class="src">Terakhir diperbarui: November 2026. Rilis terbaru yang dipakai: Kemiskinan Maret 2025 (BPS, 25 Jul 2025).</p>
  </div>`;
}

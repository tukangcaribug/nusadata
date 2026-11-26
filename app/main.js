// NusaData — router hash + wiring kontrol halaman.
// Rute: #/ #/ekonomi #/penduduk #/kesehatan #/pendidikan #/wilayah
//        #/wilayah/<kode> #/sumber
import { DATA, densityOf } from './data.js';
import {
  homeView, economyView, populationView, healthView,
  educationView, regionsView, sourcesView, regionDetail, provinceRows, esc,
} from './views.js';

const app = document.getElementById('app');
let currentYear = 2024;

function setActiveNav(route) {
  const key = route === '' ? 'home' : route.split('/')[0];
  document.querySelectorAll('[data-nav]').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === key);
  });
}

function render() {
  window.__shotReady = false;
  const hash = window.location.hash || '#/';
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const route = parts[0] || '';
  let html;
  if (route === '') html = homeView();
  else if (route === 'ekonomi') html = economyView(currentYear);
  else if (route === 'penduduk') html = populationView(currentYear);
  else if (route === 'kesehatan') html = healthView();
  else if (route === 'pendidikan') html = educationView();
  else if (route === 'wilayah' && parts[1]) html = regionDetail(parts[1]);
  else if (route === 'wilayah') html = regionsView();
  else if (route === 'sumber') html = sourcesView();
  else html = `<h1>Halaman tidak ditemukan</h1><p class="lede">Rute “${esc(route)}” tidak ada. <a href="#/">Kembali ke beranda →</a></p>`;
  app.innerHTML = html;
  setActiveNav(route);
  wireControls(route);
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function wireControls(route) {
  // Pemilih tahun (ekonomi + penduduk): render ulang dengan tahun baru.
  const yearSelect = document.getElementById('year-select');
  if (yearSelect) {
    yearSelect.addEventListener('change', () => {
      currentYear = Number(yearSelect.value);
      render();
    });
  }
  // Halaman wilayah: cari live + urutkan.
  if (route === 'wilayah' && document.getElementById('prov-body')) {
    const state = { q: '', sort: 'pop' };
    const body = document.getElementById('prov-body');
    const count = document.getElementById('prov-count');
    const search = document.getElementById('prov-search');
    const apply = () => {
      let rows = [...DATA.provinces];
      if (state.q) {
        const q = state.q.toLowerCase();
        rows = rows.filter((p) => p.name.toLowerCase().includes(q));
      }
      if (state.sort === 'pop') rows.sort((a, b) => (b.pop ?? -1) - (a.pop ?? -1));
      else if (state.sort === 'density') rows.sort((a, b) => (densityOf(b) ?? -1) - (densityOf(a) ?? -1));
      else rows.sort((a, b) => a.name.localeCompare(b.name, 'id'));
      body.innerHTML = provinceRows(rows);
      count.textContent = `Menampilkan ${rows.length} dari 38 provinsi.`;
    };
    search.addEventListener('input', () => { state.q = search.value.trim(); apply(); });
    document.querySelectorAll('.sort-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.sort = btn.dataset.sort;
        document.querySelectorAll('.sort-btn').forEach((b) => b.classList.toggle('active', b === btn));
        apply();
      });
    });
    apply();
  }
}

window.addEventListener('hashchange', render);
render();

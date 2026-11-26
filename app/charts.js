// NusaData — grafik SVG murni dari data. Tanpa library, tanpa network.
// Semua fungsi mengembalikan string SVG inline dengan label sumbu + nilai.

import { fmtId, fmtSigned } from './data.js';

const INK = '#12263a';
const AMBER = '#e8a13a';
const TEAL = '#1f7a6d';
const GRID = '#e3dccb';
const MUTED = '#6b7280';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function niceTicks(min, max, count = 4) {
  if (max === min) max = min + 1;
  const step = (max - min) / count;
  const ticks = [];
  for (let i = 0; i <= count; i++) ticks.push(min + step * i);
  return ticks;
}

/**
 * Grafik garis. points: [{label, value}]. opts: {width, height, color,
 * decimals, unit, title, ymin, ymax, valuePrefix}.
 */
export function lineChart(points, opts = {}) {
  const w = opts.width || 640;
  const h = opts.height || 260;
  const padL = 58;
  const padR = 14;
  const padT = 30;
  const padB = 34;
  const iw = w - padL - padR;
  const ih = h - padT - padB;
  const values = points.map((p) => p.value);
  let min = opts.ymin !== undefined ? opts.ymin : Math.min(...values);
  let max = opts.ymax !== undefined ? opts.ymax : Math.max(...values);
  if (min > 0 && opts.ymin === undefined) min = Math.min(min * 0.9, min - (max - min) * 0.15);
  if (min === max) max = min + 1;
  // Padding rentang supaya titik terendah/tertinggi tidak menempel di tepi plot.
  const pad = (max - min) * 0.12;
  min -= pad;
  max += pad;
  const x = (i) => padL + (points.length === 1 ? iw / 2 : (i / (points.length - 1)) * iw);
  const y = (v) => padT + ih - ((v - min) / (max - min)) * ih;
  const ticks = niceTicks(min, max);
  const dec = opts.decimals !== undefined ? opts.decimals : 2;
  const color = opts.color || TEAL;
  const fmt = opts.signed ? (v) => fmtSigned(v, dec) : (v) => fmtId(v, dec);
  const unit = opts.unit ? ' ' + esc(opts.unit) : '';
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const area = `${line} L${x(points.length - 1).toFixed(1)},${(padT + ih).toFixed(1)} L${x(0).toFixed(1)},${(padT + ih).toFixed(1)} Z`;
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.title || 'Grafik garis')}">`;
  if (opts.title) s += `<text x="${w / 2}" y="16" text-anchor="middle" font-size="13" font-weight="700" fill="${INK}">${esc(opts.title)}</text>`;
  for (const t of ticks) {
    s += `<line x1="${padL}" y1="${y(t)}" x2="${w - padR}" y2="${y(t)}" stroke="${GRID}" stroke-width="1"/>`;
    s += `<text x="${padL - 6}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${fmt(t)}</text>`;
  }
  s += `<path d="${area}" fill="${color}" opacity="0.12"/>`;
  s += `<path d="${line}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  points.forEach((p, i) => {
    s += `<circle cx="${x(i)}" cy="${y(p.value)}" r="4" fill="#faf6ef" stroke="${color}" stroke-width="2.5"/>`;
    // Label ujung dijangkar ke dalam supaya tidak terpotong tepi SVG.
    const anchor = i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle';
    const lx = i === 0 ? x(i) + 6 : i === points.length - 1 ? x(i) - 6 : x(i);
    s += `<text x="${lx}" y="${y(p.value) - 10}" text-anchor="${anchor}" font-size="11" font-weight="700" fill="${INK}">${fmt(p.value)}${unit}</text>`;
    s += `<text x="${x(i)}" y="${h - 10}" text-anchor="middle" font-size="11" fill="${MUTED}">${esc(p.label)}</text>`;
  });
  s += '</svg>';
  return s;
}

/**
 * Grafik batang vertikal. points: [{label, value}].
 * opts: {width, height, color, decimals, unit, title, signed}.
 */
export function barChart(points, opts = {}) {
  const w = opts.width || 640;
  const h = opts.height || 260;
  const padL = 58;
  const padR = 14;
  const padT = 30;
  const padB = 34;
  const iw = w - padL - padR;
  const ih = h - padT - padB;
  const values = points.map((p) => p.value);
  const signed = opts.signed || values.some((v) => v < 0);
  const min = signed ? Math.min(0, ...values) * 1.15 : 0;
  const max = Math.max(...values) * 1.12;
  const y = (v) => padT + ih - ((v - min) / (max - min)) * ih;
  const zeroY = y(0);
  const ticks = niceTicks(min, max);
  const dec = opts.decimals !== undefined ? opts.decimals : 2;
  const color = opts.color || AMBER;
  const fmt = signed ? (v) => fmtSigned(v, dec) : (v) => fmtId(v, dec);
  const unit = opts.unit ? ' ' + esc(opts.unit) : '';
  const slot = iw / points.length;
  const bw = Math.min(46, slot * 0.62);
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.title || 'Grafik batang')}">`;
  if (opts.title) s += `<text x="${w / 2}" y="16" text-anchor="middle" font-size="13" font-weight="700" fill="${INK}">${esc(opts.title)}</text>`;
  for (const t of ticks) {
    s += `<line x1="${padL}" y1="${y(t)}" x2="${w - padR}" y2="${y(t)}" stroke="${GRID}" stroke-width="1"/>`;
    s += `<text x="${padL - 6}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${fmt(t)}</text>`;
  }
  s += `<line x1="${padL}" y1="${zeroY}" x2="${w - padR}" y2="${zeroY}" stroke="${INK}" stroke-width="1"/>`;
  points.forEach((p, i) => {
    const cx = padL + slot * i + slot / 2;
    const top = Math.min(y(p.value), zeroY);
    const height = Math.abs(y(p.value) - zeroY);
    const fill = p.value < 0 ? '#b3402e' : color;
    s += `<rect x="${(cx - bw / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(height, 2).toFixed(1)}" rx="3" fill="${fill}"/>`;
    const ly = p.value < 0 ? y(p.value) + 16 : y(p.value) - 6;
    s += `<text x="${cx}" y="${ly.toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="${INK}">${fmt(p.value)}${unit}</text>`;
    s += `<text x="${cx}" y="${h - 10}" text-anchor="middle" font-size="11" fill="${MUTED}">${esc(p.label)}</text>`;
  });
  s += '</svg>';
  return s;
}

/**
 * Grafik batang horizontal. points: [{label, value}].
 * opts: {width, rowH, color, decimals, unit, title}.
 */
export function hbarChart(points, opts = {}) {
  const w = opts.width || 640;
  const rowH = opts.rowH || 44;
  const padL = 150;
  const padR = 70;
  const padT = opts.title ? 30 : 8;
  const h = padT + points.length * rowH + 12;
  const max = Math.max(...points.map((p) => p.value)) * 1.08;
  const dec = opts.decimals !== undefined ? opts.decimals : 1;
  const color = opts.color || TEAL;
  const unit = opts.unit ? ' ' + esc(opts.unit) : '';
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.title || 'Grafik batang horizontal')}">`;
  if (opts.title) s += `<text x="${w / 2}" y="16" text-anchor="middle" font-size="13" font-weight="700" fill="${INK}">${esc(opts.title)}</text>`;
  points.forEach((p, i) => {
    const y = padT + i * rowH;
    const bw = ((p.value / max) * (w - padL - padR)).toFixed(1);
    s += `<text x="${padL - 8}" y="${y + 22}" text-anchor="end" font-size="12" fill="${INK}">${esc(p.label)}</text>`;
    s += `<rect x="${padL}" y="${y + 8}" width="${bw}" height="20" rx="4" fill="${color}"/>`;
    s += `<text x="${padL + Number(bw) + 8}" y="${y + 23}" font-size="12" font-weight="700" fill="${INK}">${fmtId(p.value, dec)}${unit}</text>`;
  });
  s += '</svg>';
  return s;
}

/**
 * Piramida penduduk. groups: [{group, male, female}] dalam persen.
 * Laki-laki ke kiri, perempuan ke kanan, skala persen yang sama.
 */
export function pyramid(groups, opts = {}) {
  const w = opts.width || 640;
  const rowH = 64;
  const padT = opts.title ? 34 : 10;
  const padB = 30;
  const h = padT + groups.length * rowH + padB;
  const mid = w / 2;
  const max = Math.max(...groups.flatMap((g) => [g.male, g.female])) * 1.12;
  const half = mid - 70;
  const xMale = (v) => mid - (v / max) * half;
  const xFemale = (v) => mid + (v / max) * half;
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.title || 'Piramida penduduk')}">`;
  if (opts.title) s += `<text x="${w / 2}" y="16" text-anchor="middle" font-size="13" font-weight="700" fill="${INK}">${esc(opts.title)}</text>`;
  s += `<text x="${mid - half / 2}" y="${padT - 8}" text-anchor="middle" font-size="12" font-weight="700" fill="${TEAL}">Laki-laki</text>`;
  s += `<text x="${mid + half / 2}" y="${padT - 8}" text-anchor="middle" font-size="12" font-weight="700" fill="${AMBER}">Perempuan</text>`;
  groups.forEach((g, i) => {
    const y = padT + i * rowH;
    const cy = y + rowH / 2;
    s += `<text x="${mid}" y="${cy - 14}" text-anchor="middle" font-size="12" font-weight="700" fill="${INK}">${esc(g.group)} thn</text>`;
    s += `<rect x="${xMale(g.male).toFixed(1)}" y="${cy - 4}" width="${(mid - xMale(g.male)).toFixed(1)}" height="18" rx="3" fill="${TEAL}"/>`;
    s += `<rect x="${mid}" y="${cy - 4}" width="${(xFemale(g.female) - mid).toFixed(1)}" height="18" rx="3" fill="${AMBER}"/>`;
    s += `<text x="${(xMale(g.male) - 6).toFixed(1)}" y="${cy + 10}" text-anchor="end" font-size="12" font-weight="700" fill="${INK}">${fmtId(g.male, 1)}%</text>`;
    s += `<text x="${(xFemale(g.female) + 6).toFixed(1)}" y="${cy + 10}" font-size="12" font-weight="700" fill="${INK}">${fmtId(g.female, 1)}%</text>`;
  });
  s += `<text x="${w / 2}" y="${h - 8}" text-anchor="middle" font-size="11" fill="${MUTED}">Persen penduduk, 2024 — Sumber: BPS</text>`;
  s += '</svg>';
  return s;
}

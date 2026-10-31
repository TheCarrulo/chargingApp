#!/usr/bin/env node
// Exercises the charge-time math in index.html (power conversion, AC time,
// DC curve integration, and minute rounding). Exits 0 on success.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const match = html.match(/<script>\s*const sectionNames[\s\S]*?<\/script>/);
if (!match) {
  console.error('Could not find the calculator script in index.html');
  process.exit(1);
}
const code = match[0].replace(/^<script>/, '').replace(/<\/script>$/, '') +
  '\nglobalThis.__api = { kwDeAmperes, amperesDeKw, horasAc, horasDc, formatDuracao, potenciaCurva, curvaData };\n';

const sandbox = { Math, Date, Number, String, parseFloat, isNaN, isFinite, console };
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: 'index.html' });
const api = sandbox.__api;

const CURVA_LABELS = [0,2,4,6,8,10,12,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,92,95,98,99,100];
const CURVA_VALUES = [60,193,196,200,200,202,206,190,178,165,155,148,140,130,115,110,105,93,88,78,70,63,57,55,57,53,35,5];

let failed = 0;
function check(name, cond, detail) {
  if (cond) {
    console.log(`PASS  ${name}${detail ? '  ' + detail : ''}`);
  } else {
    failed++;
    console.error(`FAIL  ${name}${detail ? '  ' + detail : ''}`);
  }
}
function near(actual, expected, tol) {
  return Math.abs(actual - expected) <= tol;
}

check('curve data is unchanged',
  JSON.stringify(api.curvaData.labels) === JSON.stringify(CURVA_LABELS) &&
  JSON.stringify(api.curvaData.values) === JSON.stringify(CURVA_VALUES));

const kw16 = api.kwDeAmperes(16, 'tri');
check('16 A × 400 V three-phase ≈ 11.08 kW',
  near(kw16, Math.sqrt(3) * 400 * 16 / 1000, 1e-9) && near(kw16, 11.08, 0.01),
  `got ${kw16.toFixed(5)} kW`);

const kw32 = api.kwDeAmperes(32, 'mono');
check('32 A × 230 V single-phase ≈ 7.36 kW',
  kw32 === 7.36,
  `got ${kw32} kW`);

const amp11 = api.amperesDeKw(11, 'tri');
check('11 kW three-phase ≈ 15.88 A per phase (~16 A)',
  near(amp11, 11 * 1000 / (Math.sqrt(3) * 400), 1e-9) && near(amp11, 16, 0.2),
  `got ${amp11.toFixed(3)} A`);

const horas11 = api.horasAc(20, 80, 82, 11, 87.5);
const esperado11 = 49.2 / (11 * 0.875);
check('20→80% @ 11 kW AC, 82 kWh, 87.5% → 5h 7min',
  near(horas11, esperado11, 1e-12) && api.formatDuracao(horas11) === '5h 7min',
  `got ${horas11.toFixed(6)} h = ${api.formatDuracao(horas11)}`);

const horas16 = api.horasAc(20, 80, 82, kw16, 87.5);
check('20→80% @ 16 A three-phase is about 5h, not ~8h47',
  horas16 > 5 && horas16 < 5.2 && api.formatDuracao(horas16) !== '8h 47min',
  `got ${horas16.toFixed(4)} h = ${api.formatDuracao(horas16)}`);

check('1.9999 h does not render as Xh 60min',
  api.formatDuracao(1.9999) === '2h 0min' && !/60min/.test(api.formatDuracao(1.9999)),
  `got "${api.formatDuracao(1.9999)}"`);

check('0.9999 h rolls into 1h 0min',
  api.formatDuracao(0.9999) === '1h 0min',
  `got "${api.formatDuracao(0.9999)}"`);

function interp(soc, labels, values) {
  if (soc <= labels[0]) return values[0];
  if (soc >= labels[labels.length - 1]) return values[values.length - 1];
  let i = 1;
  while (labels[i] < soc) i++;
  const t = (soc - labels[i - 1]) / (labels[i] - labels[i - 1]);
  return values[i - 1] + (values[i] - values[i - 1]) * t;
}

function oracleDc(soc0, soc1, bateria, charger, labels, values) {
  const steps = 40000;
  const ds = (soc1 - soc0) / steps;
  let horas = 0;
  for (let i = 0; i < steps; i++) {
    const soc = soc0 + (i + 0.5) * ds;
    const p = Math.min(charger, interp(soc, labels, values));
    horas += (bateria / 100) * ds / p;
  }
  return horas;
}

const labels = api.curvaData.labels;
const values = api.curvaData.values;
const curvaMax2080 = Math.max(...labels.map((s, i) => (s >= 20 && s <= 80 ? values[i] : -Infinity)));
check('charger above the 20–80% curve (300 kW > curve)',
  300 > curvaMax2080,
  `curve max in window ${curvaMax2080} kW`);

const dcAlto = api.horasDc(20, 80, 82, 300);
const oracleAlto = oracleDc(20, 80, 82, 300, labels, values);
const constante300 = 49.2 / 300;
check('DC 20→80% @ 300 kW follows the curve, not constant 300 kW',
  near(dcAlto, oracleAlto, 1e-4) && dcAlto > constante300 * 1.5,
  `got ${dcAlto.toFixed(5)} h (${api.formatDuracao(dcAlto)}); constant 300 kW would be ${constante300.toFixed(5)} h; oracle ${oracleAlto.toFixed(5)} h`);

const dcBaixo = api.horasDc(20, 80, 82, 50);
check('DC 20→80% @ 50 kW stays on the charger (curve is above 50 kW)',
  near(dcBaixo, 49.2 / 50, 1e-9),
  `got ${dcBaixo.toFixed(6)} h`);

const dcCruz = api.horasDc(10, 100, 82, 150);
const oracleCruz = oracleDc(10, 100, 82, 150, labels, values);
check('DC 10→100% @ 150 kW matches the integral where the curve crosses 150 kW',
  near(dcCruz, oracleCruz, 1e-4),
  `got ${dcCruz.toFixed(5)} h; oracle ${oracleCruz.toFixed(5)} h`);

check('AC still applies efficiency; DC at the same kW does not',
  api.horasDc(20, 80, 82, 11) < api.horasAc(20, 80, 82, 11, 87.5) &&
  near(api.horasDc(20, 80, 82, 11), 49.2 / 11, 1e-9));

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log('\nAll charge-math checks passed.');

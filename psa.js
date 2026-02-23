// PSA Doubling Time Calculator
// Weighted least-squares exponential fitting: y = A * exp(B * x)
// Reference: https://mathworld.wolfram.com/LeastSquaresFittingExponential.html

'use strict';

// -------------------------------------------------------------------------
// Date parsing
// -------------------------------------------------------------------------

/**
 * Try to parse a single string token as a date.
 * Handles: YYYY-MM-DD, MM/DD/YYYY, MM.DD.YYYY, DD/MM/YYYY, MM/DD/YY, etc.
 * When month/day are ambiguous (both ≤12), assumes MM-first (US convention).
 * If first part > 12, assumes DD-first.
 * Returns a Date object or null.
 */
function tryParseDate(token) {
  token = token.trim();

  // ISO: YYYY-MM-DD
  let m = token.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return makeDate(+m[1], +m[2], +m[3]);

  // General: p1 [/ - .] p2 [/ - .] p3  (separators may differ)
  m = token.match(/^(\d{1,4})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
  if (!m) return null;

  const p1 = +m[1], p2 = +m[2], p3 = +m[3];
  const len3 = m[3].length;

  let year, month, day;

  if (p1 > 31) {
    // YYYY / MM / DD
    year = p1; month = p2; day = p3;
  } else {
    year = len3 === 2 ? 2000 + p3 : p3;
    if (p1 > 12) {
      // DD / MM / YYYY  (first part can't be a month)
      day = p1; month = p2;
    } else {
      // MM / DD / YYYY  (US default when ambiguous)
      month = p1; day = p2;
    }
  }

  return makeDate(year, month, day);
}

function makeDate(year, month, day) {
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31)     return null;
  if (year < 1900 || year > 2100) return null;
  const d = new Date(year, month - 1, day);
  // JS rolls over invalid dates (Feb 31 → Mar 3); catch that.
  if (d.getMonth() !== month - 1 || d.getDate() !== day) return null;
  return d;
}

/**
 * Parse one line of input into { date, psaValue } or null.
 * Tokenises by whitespace, commas, semicolons, and pipes.
 * Skips any token that is exactly "PSA" (case-insensitive).
 */
function parseLine(line) {
  line = line.trim();
  if (!line || line.startsWith('#')) return null;

  const tokens = line.split(/[\s,;|]+/).filter(Boolean);

  let date = null;
  let psaValue = null;

  for (const token of tokens) {
    if (/^psa$/i.test(token)) continue;

    if (date === null) {
      const d = tryParseDate(token);
      if (d !== null) { date = d; continue; }
    }

    if (psaValue === null) {
      const n = parseFloat(token);
      if (!isNaN(n) && n >= 0) { psaValue = n; }
    }
  }

  if (date === null || psaValue === null) return null;
  return { date, psaValue };
}

/**
 * Parse the full textarea input, returning an array of { date, psaValue }
 * sorted chronologically.
 */
function parseInput(text) {
  const data = text.split('\n').map(parseLine).filter(Boolean);
  data.sort((a, b) => a.date - b.date);
  return data;
}

// -------------------------------------------------------------------------
// Least-squares exponential fit
// -------------------------------------------------------------------------

const MS_PER_DAY = 86400000;

/**
 * Fit y = A * exp(B * x) to the data using weighted least squares,
 * with weights w_i = y_i^2 (MathWorld formula).
 *
 * x is measured in days from the first data point.
 *
 * Returns { A, B, doublingTimeDays, firstDate, pts } or null on failure.
 */
function fitExponential(data) {
  const valid = data.filter(d => d.psaValue > 0);
  if (valid.length < 2) return null;

  const firstDate = valid[0].date;

  const pts = valid.map(d => ({
    x: (d.date.getTime() - firstDate.getTime()) / MS_PER_DAY,
    y: d.psaValue,
    date: d.date
  }));

  // Weighted sums (weights w_i = y_i^2)
  let S1 = 0, S2 = 0, S3 = 0, S4 = 0, S5 = 0;
  for (const { x, y } of pts) {
    const w   = y * y;
    const lny = Math.log(y);
    S1 += w;
    S2 += w * x;
    S3 += w * x * x;
    S4 += w * lny;
    S5 += w * x * lny;
  }

  const denom = S1 * S3 - S2 * S2;
  if (Math.abs(denom) < 1e-15) return null;

  const B = (S1 * S5 - S2 * S4) / denom;
  const A = Math.exp((S4 - B * S2) / S1);
  const doublingTimeDays = Math.log(2) / B;

  return { A, B, doublingTimeDays, firstDate, pts };
}

// -------------------------------------------------------------------------
// Chart
// -------------------------------------------------------------------------

let psaChart = null;

function fmtDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

function fmtDoublingTime(days) {
  if (days < 0)   return `PSA is decreasing (rate constant implies halving, not doubling)`;
  if (days < 60)  return `${days.toFixed(1)} days`;
  if (days < 730) return `${(days / 30.44).toFixed(1)} months`;
  return `${(days / 365.25).toFixed(2)} years  (${(days / 30.44).toFixed(1)} months)`;
}

/** Generate weekly points along the fitted curve from startDate to endDate. */
function buildCurve(fit, startDate, endDate) {
  const STEP = 7 * MS_PER_DAY;
  const pts = [];
  let t = startDate.getTime();
  const end = endDate.getTime();
  while (t <= end) {
    const dx  = (t - fit.firstDate.getTime()) / MS_PER_DAY;
    const psa = fit.A * Math.exp(fit.B * dx);
    pts.push({ x: new Date(t), y: psa });
    t += STEP;
  }
  return pts;
}

function renderChart(data, fit) {
  const MS_PER_YEAR = 365.25 * MS_PER_DAY;
  const chartStart  = new Date(data[0].date);
  const chartEnd    = new Date(data[data.length - 1].date.getTime() + 5 * MS_PER_YEAR);

  const curve    = buildCurve(fit, chartStart, chartEnd);
  const measured = data.map(d => ({ x: new Date(d.date), y: d.psaValue }));

  if (psaChart) { psaChart.destroy(); psaChart = null; }

  const ctx = document.getElementById('psaChart').getContext('2d');

  psaChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Measured PSA',
          data: measured,
          backgroundColor: '#4fc3f7',
          borderColor: '#4fc3f7',
          pointRadius: 6,
          pointHoverRadius: 9,
          order: 1
        },
        {
          label: 'Exponential Fit',
          data: curve,
          type: 'line',
          borderColor: '#ef5350',
          backgroundColor: 'rgba(239,83,80,0.08)',
          fill: true,
          pointRadius: 0,
          borderWidth: 2.5,
          tension: 0,
          order: 2
        }
      ]
    },
    options: {
      responsive: true,
      animation: { duration: 400 },
      plugins: {
        tooltip: {
          mode: 'nearest',
          intersect: false,
          callbacks: {
            title: items => fmtDate(new Date(items[0].parsed.x)),
            label: item  => `${item.dataset.label}: ${item.parsed.y.toFixed(3)} ng/mL`
          }
        },
        legend: {
          labels: { color: '#bbb', padding: 16 }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'month',
            displayFormats: { month: 'MMM yyyy' }
          },
          ticks: { color: '#777', maxTicksLimit: 10 },
          grid:  { color: '#2e2e2e' },
          title: { display: true, text: 'Date', color: '#777' }
        },
        y: {
          ticks: { color: '#777' },
          grid:  { color: '#2e2e2e' },
          title: { display: true, text: 'PSA (ng/mL)', color: '#777' }
        }
      },
      onClick: (evt) => handleChartClick(evt, fit)
    }
  });
}

/**
 * When the user clicks the chart, compute the expected PSA from the fit
 * at the clicked date and display it.
 */
function handleChartClick(evt, fit) {
  if (!psaChart) return;

  const pos  = Chart.helpers.getRelativePosition(evt, psaChart);
  const xMs  = psaChart.scales.x.getValueForPixel(pos.x);
  if (xMs == null) return;

  const clickedDate = new Date(xMs);
  const dx  = (clickedDate.getTime() - fit.firstDate.getTime()) / MS_PER_DAY;
  const psa = fit.A * Math.exp(fit.B * dx);

  const el = document.getElementById('clickInfo');
  el.innerHTML =
    `<strong>${fmtDate(clickedDate)}</strong> &nbsp;&rarr;&nbsp; ` +
    `Expected PSA: <strong>${psa.toFixed(3)} ng/mL</strong>`;
  el.style.display = 'block';
}

// -------------------------------------------------------------------------
// Parsed data table
// -------------------------------------------------------------------------

function updateParsedTable(data) {
  const table = document.getElementById('parsedTable');
  while (table.rows.length > 1) table.deleteRow(-1);
  for (const { date, psaValue } of data) {
    const row = table.insertRow(-1);
    row.insertCell(0).textContent = fmtDate(date);
    row.insertCell(1).textContent = psaValue.toFixed(3);
  }
}

// -------------------------------------------------------------------------
// Main entry point
// -------------------------------------------------------------------------

function calculate() {
  const text = document.getElementById('psaInput').value;
  const data = parseInput(text);

  const errEl = document.getElementById('psaError');
  const resEl = document.getElementById('psaResults');

  if (data.length < 2) {
    errEl.textContent = data.length === 0
      ? 'No valid measurements found. Check that each line has a recognisable date and a numeric PSA value.'
      : 'At least 2 measurements are required to calculate a doubling time.';
    errEl.style.display = 'block';
    resEl.style.display = 'none';
    return;
  }

  errEl.style.display = 'none';

  const fit = fitExponential(data);
  if (!fit) {
    errEl.textContent = 'Could not fit the data. Ensure all PSA values are positive numbers.';
    errEl.style.display = 'block';
    resEl.style.display = 'none';
    return;
  }

  document.getElementById('doublingTime').textContent = fmtDoublingTime(fit.doublingTimeDays);
  document.getElementById('clickInfo').style.display = 'none';

  updateParsedTable(data);
  resEl.style.display = 'block';
  renderChart(data, fit);
}

// Allow Enter key in textarea to not submit, but Shift+Enter or Ctrl+Enter
// to trigger calculation (optional convenience)
document.getElementById('psaInput').addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    calculate();
  }
});

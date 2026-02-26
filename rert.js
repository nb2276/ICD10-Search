// ============================================================
// OAR data from UMich ReRT guidelines
// trf arrays correspond to the document time columns:
//   Serial:   [< 3 mo, 3–6 mo, 6 mo–1 yr, 1–3 yr]  +  > 3 yr → always 0.5
//   Parallel: [< 3 mo, 3–6 mo, 6 mo–2 yr, > 2 yr]
// ============================================================

const SERIAL_LABELS   = ['< 3 mo', '3–6 mo', '6 mo–1 yr', '1–3 yr', '> 3 yr'];
const PARALLEL_LABELS = ['< 3 mo', '3–6 mo', '6 mo–2 yr', '> 2 yr'];

const OAR_DATA = [
  // ---- Serial ----
  { id: 'body',        name: 'Body',                        group: 'serial',   constraint: null, constraintText: 'Report only',           trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'ptv',         name: 'PTV',                         group: 'serial',   constraint: null, constraintText: 'Report only',           trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'bladder',     name: 'Bladder',                     group: 'serial',   constraint: 85,                                            trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'bowel_small', name: 'Bowel_Small',                 group: 'serial',   constraint: 54,                                            trf: [0, 0,   0.25, 0.4]  },
  { id: 'brachial',    name: 'BrachialPlex',                group: 'serial',   constraint: 70,                                            trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'brain',       name: 'Brain',                       group: 'serial',   constraint: null, constraintText: 'Report only',           trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'brainstem',   name: 'Brainstem',                   group: 'serial',   constraint: 64,                                            trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'bronchus',    name: 'Bronchus',                    group: 'serial',   constraint: 70,                                            trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'cauda',       name: 'CaudaEquina',                 group: 'serial',   constraint: 60,                                            trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'cochlea',     name: 'Cochlea',                     group: 'serial',   constraint: 45,                                            trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'colon',       name: 'Colon / Sigmoid / Bowel_Large', group: 'serial', constraint: 70,                                            trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'duodenum',    name: 'Duodenum',                    group: 'serial',   constraint: 54,                                            trf: [0, 0,   0.25, 0.25] },
  { id: 'esophagus',   name: 'Esophagus',                   group: 'serial',   constraint: 70,                                            trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'greatves',    name: 'GreatVes / Aorta',            group: 'serial',   constraint: 100,                                           trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'heart',       name: 'Heart',                       group: 'serial',   constraint: 70,                                            trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'kidneys',     name: 'Kidneys',                     group: 'serial',   constraint: null, constraintText: 'CV23 EQD2 ≥ 200 cc',   trf: [0, 0,   0,    0]    },
  { id: 'larynx',      name: 'Larynx',                      group: 'serial',   constraint: null, constraintText: 'Report only',           trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'musc_s',      name: 'Musc_Constrict_S',            group: 'serial',   constraint: null, constraintText: 'Report only',           trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'musc_i',      name: 'Musc_Constrict_I',            group: 'serial',   constraint: null, constraintText: 'Report only',           trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'opticchiasm', name: 'OpticChiasm',                 group: 'serial',   constraint: 54,                                            trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'opticnrv',    name: 'OpticNrv',                    group: 'serial',   constraint: 54,                                            trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'rectum',      name: 'Rectum',                      group: 'serial',   constraint: 80,                                            trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'retina',      name: 'Retina',                      group: 'serial',   constraint: 50,                                            trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'sacralplex',  name: 'SacralPlex',                  group: 'serial',   constraint: 70,                                            trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'spinalcord',  name: 'SpinalCord',                  group: 'serial',   constraint: 50,                                            trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'spinalcord2', name: 'SpinalCord (< 2mm from target)', group: 'serial', constraint: 55,                                           trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'stomach',     name: 'Stomach',                     group: 'serial',   constraint: 54,                                            trf: [0, 0,   0.25, 0.4]  },
  { id: 'trachea',     name: 'Trachea',                     group: 'serial',   constraint: 70,                                            trf: [0, 0.1, 0.25, 0.5]  },
  // ---- Parallel ----
  { id: 'lungs',       name: 'Lungs-GTV / Lungs-ITV',       group: 'parallel', constraint: null, constraintText: 'CV16 EQD2 ≥ 1000 cc',  trf: [0, 0, 0.25, 0.5]   },
  { id: 'liver',       name: 'Liver',                        group: 'parallel', constraint: null, constraintText: 'CV32 EQD2 ≥ 700 cc',   trf: [0, 0, 0.5,  1]     },
  { id: 'livergtv',    name: 'Liver-GTV',                   group: 'parallel', constraint: null, constraintText: 'Report only',           trf: [0, 0, 0.5,  1]     },
];

const oarById = Object.fromEntries(OAR_DATA.map(o => [o.id, o]));
const addedOarIds = [];

// ============================================================
// TRF helpers
// ============================================================

function getActiveTrfIdx(oar, months) {
  if (oar.group === 'serial') {
    if (months < 3)  return 0;
    if (months < 6)  return 1;
    if (months < 12) return 2;
    if (months < 36) return 3;
    return 4; // > 3 yr — always 0.5 per document
  } else {
    if (months < 3)  return 0;
    if (months < 6)  return 1;
    if (months < 24) return 2;
    return 3;
  }
}

function getActiveTrf(oar, months) {
  const idx = getActiveTrfIdx(oar, months);
  if (oar.group === 'serial' && idx === 4) return 0.5;
  return oar.trf[idx];
}

function getTimeBucketLabel(months) {
  if (months < 3)  return '< 3 months';
  if (months < 6)  return '3 – 6 months';
  if (months < 12) return '6 months – 1 year';
  if (months < 24) return '1 – 2 years';
  if (months < 36) return '2 – 3 years';
  return '> 3 years';
}

// ============================================================
// Math
// ============================================================

// Physical dose → EQD2 using plan fractionation
function physicalToEqd2(D, n, ab) {
  const d = D / n;
  return D * (d + ab) / (2 + ab);
}

// Remaining EQD2 → isoeffective total dose in n fractions (same α/β)
function eqd2ToPhysical(eqd2, n, ab) {
  if (eqd2 <= 0 || n < 1 || ab <= 0) return null;
  const bed  = eqd2 * (2 + ab) / ab;
  const disc = ab * ab + 4 * bed * ab / n;
  if (disc < 0) return null;
  const d = 0.5 * (-ab + Math.sqrt(disc));
  if (d < 0) return null;
  return d * n;
}

// ============================================================
// DOM helpers
// ============================================================

const $ = id => document.getElementById(id);

function fmt(v) {
  if (v === null || v === undefined || isNaN(v) || !isFinite(v)) return '—';
  return v.toFixed(2);
}

// ============================================================
// Populate OAR dropdown
// ============================================================

function buildSelector() {
  const sel = $('oar-select');
  const serialGrp   = document.createElement('optgroup');
  serialGrp.label   = 'Serial OARs';
  const parallelGrp = document.createElement('optgroup');
  parallelGrp.label = 'Parallel OARs';

  OAR_DATA.forEach(oar => {
    const opt = document.createElement('option');
    opt.value = oar.id;
    opt.textContent = oar.constraint !== null
      ? oar.name + ' (\u2264\u2009' + oar.constraint + ' Gy)'
      : oar.name;
    (oar.group === 'serial' ? serialGrp : parallelGrp).appendChild(opt);
  });

  sel.appendChild(serialGrp);
  sel.appendChild(parallelGrp);
}

// ============================================================
// Add / remove OAR
// ============================================================

function addOar() {
  const id = $('oar-select').value;
  if (!id || addedOarIds.includes(id)) return;

  addedOarIds.push(id);
  const oar = oarById[id];

  // Disable option so it can't be double-added
  const opt = $('oar-select').querySelector(`option[value="${id}"]`);
  if (opt) opt.disabled = true;

  // Left panel card
  $('oar-list').appendChild(buildOarCard(oar));

  // Right panel row
  const tr = document.createElement('tr');
  tr.id = 'rert-row-' + id;
  $('rert-tbody').appendChild(tr);

  // Dose input listener
  $('dose-' + id).addEventListener('input', updateAll);

  toggleEmptyRow();
  updateAll();
}

function removeOar(id) {
  const idx = addedOarIds.indexOf(id);
  if (idx === -1) return;
  addedOarIds.splice(idx, 1);

  const card = $('oar-card-' + id);
  if (card) card.remove();
  const row = $('rert-row-' + id);
  if (row) row.remove();

  // Re-enable the dropdown option
  const opt = $('oar-select').querySelector(`option[value="${id}"]`);
  if (opt) opt.disabled = false;

  toggleEmptyRow();
}

// ============================================================
// Build an OAR card for the left panel
// ============================================================

function buildOarCard(oar) {
  const labels   = oar.group === 'serial' ? SERIAL_LABELS : PARALLEL_LABELS;
  const trfVals  = oar.group === 'serial' ? [...oar.trf, 0.5] : [...oar.trf];

  const constraintLabel = oar.constraint !== null
    ? oar.constraint + ' Gy EQD2'
    : oar.constraintText;

  const chips = labels.map((lbl, i) =>
    `<div class="rert-trf-chip" id="trf-chip-${oar.id}-${i}">
       <span class="rert-trf-val">${trfVals[i]}</span>
       <span class="rert-trf-lbl">${lbl}</span>
     </div>`
  ).join('');

  const card = document.createElement('div');
  card.className = 'bed-card rert-oar-card';
  card.id = 'oar-card-' + oar.id;
  card.innerHTML = `
    <div class="rert-oar-header">
      <span class="rert-oar-name">${oar.name}</span>
      <span class="rert-constraint-badge">${constraintLabel}</span>
      <button class="rert-remove-btn" onclick="removeOar('${oar.id}')" title="Remove">&times;</button>
    </div>
    <div class="rert-oar-dose-row">
      <label>Prior Dose (Gy)</label>
      <input type="number" class="bed-num-input rert-dose-input"
             id="dose-${oar.id}" placeholder="0.0" min="0" step="0.1">
      <span class="rert-eqd2-display" id="eqd2disp-${oar.id}"></span>
    </div>
    <div class="rert-trf-row">${chips}</div>`;
  return card;
}

// ============================================================
// Toggle the "add OARs" placeholder row
// ============================================================

function toggleEmptyRow() {
  const row = $('rert-empty-row');
  if (row) row.style.display = addedOarIds.length === 0 ? '' : 'none';
}

// ============================================================
// Main update — recomputes everything
// ============================================================

function updateAll() {
  const prFx   = parseFloat($('pr-fx').value);
  const prAb   = parseFloat($('pr-ab').value);
  const prMo   = parseFloat($('pr-mo').value);
  const custFx = parseFloat($('custom-fx').value);

  // Update time bucket label
  const timeLabelEl = $('time-label');
  if (timeLabelEl) {
    const span = timeLabelEl.querySelector('span');
    if (span) span.textContent = (!isNaN(prMo) && prMo >= 0) ? getTimeBucketLabel(prMo) : '—';
  }

  const planValid = !isNaN(prFx) && prFx >= 1 && !isNaN(prAb) && prAb > 0;
  const timeValid = !isNaN(prMo) && prMo >= 0;
  const custOk    = !isNaN(custFx) && custFx >= 1;

  addedOarIds.forEach(id => {
    const oar  = oarById[id];
    const dose = parseFloat($('dose-' + id).value);
    const hasDose = !isNaN(dose) && dose > 0;

    // --- TRF chip highlights ---
    const numChips  = oar.group === 'serial' ? 5 : 4;
    const activeIdx = timeValid ? getActiveTrfIdx(oar, prMo) : -1;
    for (let i = 0; i < numChips; i++) {
      const chip = $('trf-chip-' + id + '-' + i);
      if (chip) chip.classList.toggle('active', i === activeIdx);
    }

    // --- EQD2 of prior dose ---
    let eqd2Prior = null;
    if (planValid && hasDose) {
      eqd2Prior = physicalToEqd2(dose, prFx, prAb);
      $('eqd2disp-' + id).textContent = '\u2192 EQD2: ' + fmt(eqd2Prior) + ' Gy';
    } else {
      $('eqd2disp-' + id).textContent = '';
    }

    // --- Active TRF & remaining EQD2 ---
    const trf     = timeValid ? getActiveTrf(oar, prMo) : 0;
    let remEqd2   = null;
    if (eqd2Prior !== null && oar.constraint !== null) {
      remEqd2 = oar.constraint - eqd2Prior * (1 - trf);
    }

    // --- Build result row ---
    const row = $('rert-row-' + id);
    if (!row) return;

    const exceeded    = remEqd2 !== null && remEqd2 <= 0;
    const noConstraint = oar.constraint === null;

    let nameHtml, dataCells;

    if (noConstraint) {
      // Show time-discounted effective prior EQD2 instead of remaining dose
      const effPrior = eqd2Prior !== null ? eqd2Prior * (1 - trf) : null;
      nameHtml = `<td class="bed-row-label">${oar.name}<span class="rert-report-only-note">no numeric constraint</span></td>`;
      dataCells = [
        `<td class="rert-report" title="Time-discounted effective prior EQD2">${fmt(effPrior)}<span class="rert-report-only-note">eff. prior EQD2</span></td>`,
        `<td class="rert-report">—</td>`,
        `<td class="rert-report">—</td>`,
        `<td class="rert-report">—</td>`,
        `<td class="rert-report">—</td>`,
      ];
    } else if (exceeded) {
      nameHtml = `<td class="bed-row-label">${oar.name}<span class="rert-oar-subtext">\u2264 ${oar.constraint} Gy EQD2</span></td>`;
      dataCells = [
        `<td class="rert-exceeded" title="Prior dose exceeds or meets constraint">${fmt(remEqd2)} \u26a0</td>`,
        `<td class="rert-exceeded">—</td>`,
        `<td class="rert-exceeded">—</td>`,
        `<td class="rert-exceeded">—</td>`,
        `<td class="rert-exceeded">—</td>`,
      ];
    } else {
      const d1 = remEqd2 !== null ? eqd2ToPhysical(remEqd2, 1,      prAb) : null;
      const d3 = remEqd2 !== null ? eqd2ToPhysical(remEqd2, 3,      prAb) : null;
      const d5 = remEqd2 !== null ? eqd2ToPhysical(remEqd2, 5,      prAb) : null;
      const dN = (remEqd2 !== null && custOk) ? eqd2ToPhysical(remEqd2, custFx, prAb) : null;

      nameHtml = `<td class="bed-row-label">${oar.name}<span class="rert-oar-subtext">\u2264 ${oar.constraint} Gy EQD2</span></td>`;
      dataCells = [
        `<td class="bed-result-cell">${fmt(remEqd2)}</td>`,
        `<td class="bed-result-cell">${fmt(d1)}</td>`,
        `<td class="bed-result-cell">${fmt(d3)}</td>`,
        `<td class="bed-result-cell">${fmt(d5)}</td>`,
        `<td class="bed-result-cell">${fmt(dN)}</td>`,
      ];
    }

    row.innerHTML = nameHtml + dataCells.join('');
  });
}

// ============================================================
// Init
// ============================================================

buildSelector();

['pr-fx', 'pr-ab', 'pr-mo', 'custom-fx'].forEach(id => {
  $(id).addEventListener('input', updateAll);
});

toggleEmptyRow();
updateAll();

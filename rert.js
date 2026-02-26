// ============================================================
// OAR data from UMich ReRT guidelines
// Report-only OARs (Body, PTV, Brain, Larynx, Musc_Constrict)
// are excluded per clinical preference.
// trf arrays correspond to the document time columns:
//   Serial:   [< 3 mo, 3–6 mo, 6 mo–1 yr, 1–3 yr]  +  > 3 yr → always 0.5
//   Parallel: [< 3 mo, 3–6 mo, 6 mo–2 yr, > 2 yr]
// ============================================================

const SERIAL_LABELS   = ['< 3 mo', '3–6 mo', '6 mo–1 yr', '1–3 yr', '> 3 yr'];
const PARALLEL_LABELS = ['< 3 mo', '3–6 mo', '6 mo–2 yr', '> 2 yr'];

const OAR_DATA = [
  // ---- Serial ----
  { id: 'bladder',     name: 'Bladder',                        group: 'serial',   constraint: 85,   trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'bowel_small', name: 'Bowel_Small',                    group: 'serial',   constraint: 54,   trf: [0, 0,   0.25, 0.4]  },
  { id: 'brachial',    name: 'BrachialPlex',                   group: 'serial',   constraint: 70,   trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'brainstem',   name: 'Brainstem',                      group: 'serial',   constraint: 64,   trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'bronchus',    name: 'Bronchus',                       group: 'serial',   constraint: 70,   trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'cauda',       name: 'CaudaEquina',                    group: 'serial',   constraint: 60,   trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'cochlea',     name: 'Cochlea',                        group: 'serial',   constraint: 45,   trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'colon',       name: 'Colon / Sigmoid / Bowel_Large',  group: 'serial',   constraint: 70,   trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'duodenum',    name: 'Duodenum',                       group: 'serial',   constraint: 54,   trf: [0, 0,   0.25, 0.25] },
  { id: 'esophagus',   name: 'Esophagus',                      group: 'serial',   constraint: 70,   trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'greatves',    name: 'GreatVes / Aorta',               group: 'serial',   constraint: 100,  trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'heart',       name: 'Heart',                          group: 'serial',   constraint: 70,   trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'kidneys',     name: 'Kidneys',                        group: 'serial',   constraint: null, constraintText: 'CV23 EQD2 ≥ 200 cc', trf: [0, 0, 0, 0] },
  { id: 'opticchiasm', name: 'OpticChiasm',                    group: 'serial',   constraint: 54,   trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'opticnrv',    name: 'OpticNrv',                       group: 'serial',   constraint: 54,   trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'rectum',      name: 'Rectum',                         group: 'serial',   constraint: 80,   trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'retina',      name: 'Retina',                         group: 'serial',   constraint: 50,   trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'sacralplex',  name: 'SacralPlex',                     group: 'serial',   constraint: 70,   trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'spinalcord',  name: 'SpinalCord',                     group: 'serial',   constraint: 50,   trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'spinalcord2', name: 'SpinalCord (< 2mm from target)', group: 'serial',   constraint: 55,   trf: [0, 0.1, 0.25, 0.5]  },
  { id: 'stomach',     name: 'Stomach',                        group: 'serial',   constraint: 54,   trf: [0, 0,   0.25, 0.4]  },
  { id: 'trachea',     name: 'Trachea',                        group: 'serial',   constraint: 70,   trf: [0, 0.1, 0.25, 0.5]  },
  // ---- Parallel ----
  { id: 'lungs',  name: 'Lungs-GTV / Lungs-ITV', group: 'parallel', constraint: null, unit: 'cc', constraintCc: 1000, constraintText: 'V16 EQD2 (cc) ≥ 1000', doseLabel: 'Prior V16 volume (cc)', trf: [0, 0, 0.25, 0.5] },
  { id: 'liver',  name: 'Liver',                group: 'parallel', constraint: null, unit: 'cc', constraintCc: 700,  constraintText: 'V32 EQD2 (cc) ≥ 700',  doseLabel: 'Prior V32 volume (cc)', trf: [0, 0, 0.5,  1]   },
];

const oarById    = Object.fromEntries(OAR_DATA.map(o => [o.id, o]));
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

function physicalToEqd2(D, n, ab) {
  const d = D / n;
  return D * (d + ab) / (2 + ab);
}

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
// Build checkbox list
// ============================================================

function buildCheckboxList() {
  const container = $('oar-check-list');

  function renderGroup(label, oars) {
    const hdr = document.createElement('span');
    hdr.className = 'rert-check-group-label';
    hdr.textContent = label;
    container.appendChild(hdr);

    oars.forEach(oar => {
      const item = document.createElement('label');
      item.className = 'rert-check-item';
      item.htmlFor = 'check-' + oar.id;
      item.innerHTML =
        '<input type="checkbox" id="check-' + oar.id + '" value="' + oar.id + '">' +
        oar.name;
      item.querySelector('input').addEventListener('change', function () {
        onCheckboxChange(oar.id, this.checked);
      });
      container.appendChild(item);
    });
  }

  renderGroup('Serial OARs',   OAR_DATA.filter(o => o.group === 'serial'));
  renderGroup('Parallel OARs', OAR_DATA.filter(o => o.group === 'parallel'));
}

// ============================================================
// Add / remove OAR (driven by checkbox state)
// ============================================================

function updateOarCount() {
  const el = $('oar-count');
  if (!el) return;
  const n = addedOarIds.length;
  el.textContent = n === 0 ? 'none selected' : n + ' selected';
  el.classList.toggle('has-selection', n > 0);
}

function onCheckboxChange(id, checked) {
  if (checked && !addedOarIds.includes(id)) {
    addedOarIds.push(id);
    const oar = oarById[id];
    $('oar-list').appendChild(buildOarCard(oar));
    const tr = document.createElement('tr');
    tr.id = 'rert-row-' + id;
    $('rert-tbody').appendChild(tr);
    $('dose-' + id).addEventListener('input', updateAll);
    toggleEmptyRow();
    updateOarCount();
    updateAll();
  } else if (!checked && addedOarIds.includes(id)) {
    addedOarIds.splice(addedOarIds.indexOf(id), 1);
    const card = $('oar-card-' + id);
    if (card) card.remove();
    const row = $('rert-row-' + id);
    if (row) row.remove();
    toggleEmptyRow();
    updateOarCount();
  }
}

function removeOar(id) {
  // Uncheck the checkbox, which triggers onCheckboxChange
  const cb = $('check-' + id);
  if (cb && cb.checked) {
    cb.checked = false;
    onCheckboxChange(id, false);
  }
}

// ============================================================
// Build an OAR card for the left panel
// ============================================================

function buildOarCard(oar) {
  const labels  = oar.group === 'serial' ? SERIAL_LABELS : PARALLEL_LABELS;
  const trfVals = oar.group === 'serial' ? [...oar.trf, 0.5] : [...oar.trf];

  const constraintLabel = oar.constraintText || (oar.constraint + ' Gy EQD2');

  const chips = labels.map((lbl, i) =>
    '<div class="rert-trf-chip" id="trf-chip-' + oar.id + '-' + i + '">' +
      '<span class="rert-trf-val">' + trfVals[i] + '</span>' +
      '<span class="rert-trf-lbl">' + lbl + '</span>' +
    '</div>'
  ).join('');

  const card = document.createElement('div');
  card.className = 'bed-card rert-oar-card';
  card.id = 'oar-card-' + oar.id;
  card.innerHTML =
    '<div class="rert-oar-header">' +
      '<span class="rert-oar-name">' + oar.name + '</span>' +
      '<span class="rert-constraint-badge">' + constraintLabel + '</span>' +
      '<button class="rert-remove-btn" onclick="removeOar(\'' + oar.id + '\')" title="Remove">&times;</button>' +
    '</div>' +
    '<div class="rert-oar-dose-row">' +
      '<label>' + (oar.doseLabel || 'Prior Dose (Gy)') + '</label>' +
      '<input type="number" class="bed-num-input rert-dose-input"' +
             ' id="dose-' + oar.id + '" placeholder="0.0" min="0" step="0.1">' +
      '<span class="rert-eqd2-display" id="eqd2disp-' + oar.id + '"></span>' +
    '</div>' +
    '<div class="rert-trf-row">' + chips + '</div>';
  return card;
}

// ============================================================
// Toggle "add OARs" placeholder row
// ============================================================

function toggleEmptyRow() {
  const row = $('rert-empty-row');
  if (row) row.style.display = addedOarIds.length === 0 ? '' : 'none';
}

// ============================================================
// Main update
// ============================================================

function updateAll() {
  const prFx   = parseFloat($('pr-fx').value);
  const prAb   = parseFloat($('pr-ab').value);
  const prMo   = parseFloat($('pr-mo').value);
  const custFx = parseFloat($('custom-fx').value);

  // Time bucket label
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

    // TRF chip highlights
    const numChips  = oar.group === 'serial' ? 5 : 4;
    const activeIdx = timeValid ? getActiveTrfIdx(oar, prMo) : -1;
    for (let i = 0; i < numChips; i++) {
      const chip = $('trf-chip-' + id + '-' + i);
      if (chip) chip.classList.toggle('active', i === activeIdx);
    }

    // CC-based volumetric OARs (Lungs, Liver)
    if (oar.unit === 'cc') {
      const trfCc = timeValid ? getActiveTrf(oar, prMo) : 0;
      let effVol = null;
      let remCc  = null;
      if (hasDose) {
        effVol = dose * (1 - trfCc);
        $('eqd2disp-' + id).textContent = '\u2192 effective: ' + effVol.toFixed(1) + ' cc';
        remCc = oar.constraintCc - effVol;
      } else {
        $('eqd2disp-' + id).textContent = '';
      }
      const row = $('rert-row-' + id);
      if (!row) return;
      const sub = oar.constraintText;
      const exceeded = remCc !== null && remCc <= 0;
      let nameHtml, dataCells;
      if (exceeded) {
        nameHtml  = '<td class="bed-row-label">' + oar.name +
                    '<span class="rert-oar-subtext">' + sub + '</span></td>';
        dataCells = [
          '<td class="rert-exceeded" title="Volume constraint exceeded">' +
            remCc.toFixed(1) + ' cc \u26a0</td>',
          '<td class="rert-exceeded">—</td>',
          '<td class="rert-exceeded">—</td>',
          '<td class="rert-exceeded">—</td>',
          '<td class="rert-exceeded">—</td>',
        ];
      } else {
        nameHtml  = '<td class="bed-row-label">' + oar.name +
                    '<span class="rert-oar-subtext">' + sub + '</span></td>';
        dataCells = [
          '<td class="bed-result-cell">' + (remCc !== null ? remCc.toFixed(1) + ' cc' : '—') + '</td>',
          '<td class="rert-report">—</td>',
          '<td class="rert-report">—</td>',
          '<td class="rert-report">—</td>',
          '<td class="rert-report">—</td>',
        ];
      }
      row.innerHTML = nameHtml + dataCells.join('');
      return;
    }

    // EQD2 of prior dose
    let eqd2Prior = null;
    if (planValid && hasDose) {
      eqd2Prior = physicalToEqd2(dose, prFx, prAb);
      $('eqd2disp-' + id).textContent = '\u2192 EQD2: ' + fmt(eqd2Prior) + ' Gy';
    } else {
      $('eqd2disp-' + id).textContent = '';
    }

    // Remaining EQD2
    const trf   = timeValid ? getActiveTrf(oar, prMo) : 0;
    let remEqd2 = null;
    if (eqd2Prior !== null && oar.constraint !== null) {
      remEqd2 = oar.constraint - eqd2Prior * (1 - trf);
    }

    // Build result row
    const row = $('rert-row-' + id);
    if (!row) return;

    const exceeded     = remEqd2 !== null && remEqd2 <= 0;
    const noConstraint = oar.constraint === null;

    let nameHtml, dataCells;

    if (noConstraint) {
      const effPrior = eqd2Prior !== null ? eqd2Prior * (1 - trf) : null;
      nameHtml  = '<td class="bed-row-label">' + oar.name +
                  '<span class="rert-report-only-note">no numeric constraint</span></td>';
      dataCells = [
        '<td class="rert-report" title="Time-discounted effective prior EQD2">' +
          fmt(effPrior) + '<span class="rert-report-only-note">eff. prior EQD2</span></td>',
        '<td class="rert-report">—</td>',
        '<td class="rert-report">—</td>',
        '<td class="rert-report">—</td>',
        '<td class="rert-report">—</td>',
      ];
    } else if (exceeded) {
      const sub = oar.constraintText || ('\u2264 ' + oar.constraint + ' Gy EQD2');
      nameHtml  = '<td class="bed-row-label">' + oar.name +
                  '<span class="rert-oar-subtext">' + sub + '</span></td>';
      dataCells = [
        '<td class="rert-exceeded" title="Prior dose exceeds or meets constraint">' +
          fmt(remEqd2) + ' \u26a0</td>',
        '<td class="rert-exceeded">—</td>',
        '<td class="rert-exceeded">—</td>',
        '<td class="rert-exceeded">—</td>',
        '<td class="rert-exceeded">—</td>',
      ];
    } else {
      const d1 = remEqd2 !== null ? eqd2ToPhysical(remEqd2, 1,      prAb) : null;
      const d3 = remEqd2 !== null ? eqd2ToPhysical(remEqd2, 3,      prAb) : null;
      const d5 = remEqd2 !== null ? eqd2ToPhysical(remEqd2, 5,      prAb) : null;
      const dN = (remEqd2 !== null && custOk) ? eqd2ToPhysical(remEqd2, custFx, prAb) : null;
      const sub = oar.constraintText || ('\u2264 ' + oar.constraint + ' Gy EQD2');
      nameHtml  = '<td class="bed-row-label">' + oar.name +
                  '<span class="rert-oar-subtext">' + sub + '</span></td>';
      dataCells = [
        '<td class="bed-result-cell">' + fmt(remEqd2) + '</td>',
        '<td class="bed-result-cell">' + fmt(d1) + '</td>',
        '<td class="bed-result-cell">' + fmt(d3) + '</td>',
        '<td class="bed-result-cell">' + fmt(d5) + '</td>',
        '<td class="bed-result-cell">' + fmt(dN) + '</td>',
      ];
    }

    row.innerHTML = nameHtml + dataCells.join('');
  });
}

// ============================================================
// Init
// ============================================================

buildCheckboxList();

['pr-fx', 'pr-ab', 'pr-mo', 'custom-fx'].forEach(id => {
  $(id).addEventListener('input', updateAll);
});

toggleEmptyRow();
updateAll();

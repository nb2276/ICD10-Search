# Oncology Toolkit

A collection of clinical calculation and reference tools for radiation oncology, built as a static web app and hosted on GitHub Pages.

**Live site:** https://nb2276.github.io/ICD10-Search/

---

## Tools

### ICD-10 Code Search
Fast full-text search of ICD-10 diagnostic codes with oncology-focused filters.
- Filter by All, Malignancy, In Situ, Benign Neoplasm, or Z Code
- Click any **code** to copy it to the clipboard
- Click the **⧉ button** on any diagnosis to copy the full text
- ICD-10 data stored locally — no API calls, instant results

### PSA Doubling Time Calculator
Calculates PSA doubling time from serial PSA measurements using weighted least-squares exponential fitting (weights w = y²).
- Flexible date parsing — accepts most common date formats (MM/DD/YYYY, YYYY-MM-DD, DD.MM.YYYY, etc.)
- Interactive Chart.js plot projected forward with configurable years
- Click anywhere on the chart to query the expected PSA at that date
- White background toggle for pasting into documents
- Copy Results button — composites the doubling time, chart, and measurement table as a PNG to the clipboard

### BED / EQD2 Calculator
Computes Biologically Effective Dose (BED) and Equivalent Dose in 2 Gy fractions (EQD2) for a given prescription.
- Configurable α/β values for Tumor (10), Late tissue (3), and Prostate/Spine (1.5)
- Alternative fractionation section: converts the same BED to isoeffective total doses for 1, 3, 5, and an arbitrary number of fractions
- Based on a spreadsheet by Dr. Mike Wahl

### Composite Dose Calculator
Estimates the remaining tolerable dose to a previously irradiated structure.
- Inputs: structure tolerance dose/fractions/α/β, prior dose, time discount factor, planned fractions
- Outputs: remaining BED and safe physical dose per fraction
- Based on a spreadsheet by Dr. Mike Wahl

### Reirradiation Dose Calculator
Estimates remaining organ-at-risk dose tolerance for reirradiation using University of Michigan ReRT guidelines.
- 22 serial OARs and 2 parallel OARs (Lungs, Liver)
- Tissue Recovery Factor (TRF) columns for all documented time intervals; active time bucket highlighted automatically
- Results table shows remaining EQD2 and isoeffective physical doses for 1, 3, 5, and a custom number of fractions
- Parallel OARs (Lungs V16, Liver V32) use volumetric cc inputs with remaining cc output
- All values update in real time as inputs change

---

## Tech Stack

- **Vanilla HTML / CSS / JavaScript** — no frameworks, no build step
- **Chart.js 4.4.0** + **chartjs-adapter-date-fns 3.0.0** (PSA page only, loaded via CDN)
- **ICD-10 data** stored locally as XML (`icd10.xml`, `imrt_codes.xml`) — all search is client-side
- Hosted on **GitHub Pages** (static, no server)

---

## Running Locally

No build tools required. Clone the repo and open any `.html` file directly in a browser, or serve with any static file server:

```bash
git clone https://github.com/nb2276/ICD10-Search.git
cd ICD10-Search
npx serve .   # or: python3 -m http.server 8080
```

---

## Disclaimer

These tools are for educational purposes only and are not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.

---

## Author

Created by **Nick Boehling, MD** — Radiation Oncologist, Bend, OR

Feedback: [feedback@oncologytoolkit.com](mailto:feedback@oncologytoolkit.com)

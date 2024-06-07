const xhr_ICD = new XMLHttpRequest();
const xhr_IMRT = new XMLHttpRequest();
const icd_url = "icd10.xml";
const imrt_url = "imrt_codes.xml";
const maxSearch = 100;

const ICD_10_CODES = new Array();
const ICD_10_CODES_IMRT = new Array();

// Define a callback function to handle the response loading ICD 10 codes
xhr_ICD.onreadystatechange = function() {
  if (xhr_ICD.readyState === XMLHttpRequest.DONE && xhr_ICD.status === 200) {
    
    // Parse the XML response
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xhr_ICD.responseText, "text/xml");
    const diag = xmlDoc.getElementsByTagName("diag");
    
    // Loop over the codes and add them to the array
    for (let i = 0; i < diag.length; i++) {
      const code = diag[i];
      const id = code.getElementsByTagName("name")[0].textContent;
      const desc = code.getElementsByTagName("desc")[0].textContent;
      ICD_10_CODES.push([id, desc]);
    }

  }
};

// Define a callback function to handle the response loading IMRT ICD 10 codes 
xhr_IMRT.onreadystatechange = function() {
  if (xhr_IMRT.readyState === XMLHttpRequest.DONE && xhr_IMRT.status === 200) {
    
    // Parse the XML response
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xhr_IMRT.responseText, "text/xml");
    const diag = xmlDoc.getElementsByTagName("diag");
    
    // Loop over the codes and add them to the array
    for (let i = 0; i < diag.length; i++) {
      const code = diag[i];
      const id = code.getElementsByTagName("name")[0].textContent;
      const desc = code.getElementsByTagName("desc")[0].textContent;
      ICD_10_CODES_IMRT.push([id, desc]);
    }

  }
};


// Open the request and send it
xhr_ICD.open("GET", icd_url, true);
xhr_ICD.send();

xhr_IMRT.open("GET", imrt_url, true);
xhr_IMRT.send();

let SEARCHLIST = ICD_10_CODES;


// Load into DOM
const searchTerm = document.getElementById("searchTerm");
const codesTable = document.getElementById("codesTable");
const results = document.getElementById("results");
const selectIMRTchecked = document.getElementById('selectIMRT');
const selectMalignantchecked = document.getElementById('selectMalignant');
const selectInSituchecked = document.getElementById('selectInSitu');
const selectBenignchecked = document.getElementById('selectBenign');
const selectZchecked = document.getElementById('selectZ');

selectIMRTchecked.addEventListener("change", function(event) {
  if(event.target.checked) {
      SEARCHLIST = ICD_10_CODES_IMRT;
    }
    else {
      SEARCHLIST = ICD_10_CODES;
    }
    performSearch();
});

selectMalignantchecked.addEventListener("change", function() {
  performSearch();
});

selectInSituchecked.addEventListener("change", function() {
  performSearch();
});

selectBenignchecked.addEventListener("change", function() {
  performSearch();
});

selectZchecked.addEventListener("change", function() {
  performSearch();
});

function performSearch(){
  // Get the search term
  let term = searchTerm.value.toLowerCase();

  // If the radio button is checked, append a specific word to the search term
  if (selectMalignantchecked.checked) {
    term += ' malignant';
  }

  if(selectInSituchecked.checked) {
    term += ' in situ';
  }

  if(selectBenignchecked.checked) {
    term += ' benign';
  }

  if(selectZchecked.checked) {
    term += ' personal history neoplasm';
  }

  const words = term.split(" ");

  // Clear the table
  while (codesTable.rows.length > 0) {
      codesTable.deleteRow(-1);
  }
  
  // Search the ICD-10 codes for the term
  for (const [code, diagnosis] of SEARCHLIST) {   
    if(codesTable.rows.length>maxSearch) break;
    let match = true;
    for (const word of words){
      if(!(diagnosis.toLowerCase().includes(word) || code.toLowerCase().includes(word))) {
        match = false;
        break;
      }
    }
    if(match) {
      const row = codesTable.insertRow(-1);
      const codeCell = row.insertCell(0);
      const diagnosisCell = row.insertCell(1);
      codeCell.innerHTML = code;
      diagnosisCell.innerHTML = diagnosis;
    }
  }
  
    //Show or hide the results based on whether there are any codes found
    if (codesTable.rows.length > 0 && term.length>0) {
      results.style.display = "block";
    } else {
      results.style.display = "none";
    }
};

searchTerm.addEventListener("input", performSearch);

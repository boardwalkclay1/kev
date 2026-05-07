/* ============================================================
   ADMIN ENGINE v4 — CLEANER, FASTER, SMARTER
   - Auto-fill paperwork
   - Branded templates
   - Autosave
   - Weather + Clock
   - Tab system
============================================================ */

/* ===============================
   DOCUMENT TEMPLATES (with placeholders)
=============================== */
const DOC_TEMPLATES = {
  contract: `
TREE WORK SERVICE AGREEMENT
Kevin’s Tree Service LLC
Phone: 470‑515‑6134
Email: kevinmosley2000@gmail.com

Client Name: {{clientName}}
Job Address: {{clientAddress}}
Date: {{date}}

SCOPE OF WORK
{{workDescription}}

PROPERTY ACCESS
Client grants Contractor full access to the property.

DEBRIS & CLEANUP
All debris will be removed unless otherwise stated.

PAYMENT TERMS
Payment due upon completion.

SIGNATURES
Client Signature: ___________________________   Date: ____________
Contractor Signature: ________________________   Date: ____________
`,

  estimate: `
TREE WORK ESTIMATE
Kevin’s Tree Service LLC
Phone: 470‑515‑6134
Email: kevinmosley2000@gmail.com

Client Name: {{clientName}}
Job Address: {{clientAddress}}
Date: {{date}}

REQUESTED WORK
{{workDescription}}

ESTIMATED COST
Labor: ${{labor}}
Equipment: ${{equipment}}
Debris Removal: ${{debris}}
Total Estimate: ${{total}}

NOTES
{{notes}}

VALID FOR 14 DAYS.
`,

  invoice: `
INVOICE
Kevin’s Tree Service LLC
Phone: 470‑515‑6134
Email: kevinmosley2000@gmail.com

Invoice #: {{invoiceNumber}}
Date: {{date}}

Bill To:
{{clientName}}
{{clientAddress}}

SERVICES PROVIDED
{{workDescription}}

TOTAL DUE
Labor: ${{labor}}
Equipment: ${{equipment}}
Debris Removal: ${{debris}}
Total Amount Due: ${{total}}

PAYMENT TERMS
Payment due upon completion.
`,

  proposal: `
TREE WORK PROPOSAL
Kevin’s Tree Service LLC
Phone: 470‑515‑6134
Email: kevinmosley2000@gmail.com

Client Name: {{clientName}}
Job Address: {{clientAddress}}
Date: {{date}}

RECOMMENDED WORK
{{workDescription}}

BENEFITS
• Increased safety
• Reduced storm risk
• Healthier canopy
• More sunlight

ESTIMATED TOTAL: ${{total}}

Client Signature: ___________________________
`
};

/* ===============================
   SHORTCUTS
=============================== */
const $ = id => document.getElementById(id);
const val = id => ($(id)?.value || "").trim();

/* ===============================
   DOCUMENT GENERATOR
=============================== */
function generateDocument() {
  const activeTab = document.querySelector(".tab-btn.active")?.dataset.tab;
  let template = DOC_TEMPLATES[activeTab] || "";

  const map = {
    "{{clientName}}": val("clientName"),
    "{{clientAddress}}": val("clientAddress"),
    "{{date}}": new Date().toLocaleDateString(),
    "{{workDescription}}": val("workDescription"),
    "{{labor}}": val("labor"),
    "{{equipment}}": val("equipment"),
    "{{debris}}": val("debris"),
    "{{total}}": val("total"),
    "{{notes}}": val("notes"),
    "{{invoiceNumber}}": val("invoiceNumber")
  };

  Object.entries(map).forEach(([key, value]) => {
    template = template.replaceAll(key, value);
  });

  // Branded footer
  template += `

------------------------------
Kevin’s Tree Service LLC
470‑515‑6134
kevinmosley2000@gmail.com
(Logo Attached)
`;

  $("docBody").value = template;
  saveDraft();
}

/* ===============================
   TAB SYSTEM
=============================== */
function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".tab-btn.active")?.classList.remove("active");
      btn.classList.add("active");

      const type = btn.dataset.tab;
      $("docTitle").textContent = type.charAt(0).toUpperCase() + type.slice(1);
      $("docBody").value = DOC_TEMPLATES[type];

      saveDraft();
    });
  });

  // Default tab
  $("docBody").value = DOC_TEMPLATES.contract;
}

/* ===============================
   EMAIL PREVIEW
=============================== */
function openEmailPreview() {
  const preview = `
Type: ${$("docTitle").textContent}

Client: ${val("clientName")}
Email: ${val("clientEmail")}
Address: ${val("clientAddress")}

--- DOCUMENT ---

${$("docBody").value}
  `.trim();

  $("emailPreview").textContent = preview;
  $("emailModal").classList.add("show");
}

function closeEmailPreview() {
  $("emailModal").classList.remove("show");
}

function sendFinalEmail() {
  const email = val("clientEmail") || "kevinmosley2000@gmail.com";
  const subject = encodeURIComponent($("docTitle").textContent);
  const body = encodeURIComponent($("docBody").value);

  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

/* ===============================
   UTILITIES
=============================== */
function insertTimestamp() {
  $("docBody").value += `\n\nGenerated: ${new Date().toLocaleString()}`;
  saveDraft();
}

function copyDocToClipboard() {
  navigator.clipboard.writeText($("docBody").value);
  alert("Document copied.");
}

/* ===============================
   AUTOSAVE SYSTEM
=============================== */
function saveDraft() {
  const draft = {
    type: $("docTitle").textContent,
    body: $("docBody").value,
    clientName: val("clientName"),
    clientEmail: val("clientEmail"),
    clientAddress: val("clientAddress"),
    workDescription: val("workDescription"),
    labor: val("labor"),
    equipment: val("equipment"),
    debris: val("debris"),
    total: val("total"),
    notes: val("notes"),
    invoiceNumber: val("invoiceNumber")
  };

  localStorage.setItem("adminDraft", JSON.stringify(draft));
}

function loadDraft() {
  const draft = JSON.parse(localStorage.getItem("adminDraft") || "{}");
  if (!draft.body) return;

  $("docTitle").textContent = draft.type || "Contract";
  $("docBody").value = draft.body;

  Object.entries(draft).forEach(([key, value]) => {
    if ($(key)) $(key).value = value;
  });
}

/* ===============================
   ATLANTA WEATHER + CLOCK
=============================== */
async function loadAtlantaWeather() {
  const weatherEl = $("atlWeather");
  const clockEl = $("atlClock");

  // Live clock
  setInterval(() => {
    clockEl.textContent = new Date().toLocaleTimeString("en-US");
  }, 1000);

  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=33.749&longitude=-84.388&current_weather=true&temperature_unit=fahrenheit&timezone=auto"
    );

    const data = await res.json();
    const w = data.current_weather;

    const weatherMap = {
      0: "Clear",
      1: "Mostly Clear",
      2: "Partly Cloudy",
      3: "Cloudy",
      45: "Fog",
      48: "Fog",
      51: "Light Drizzle",
      61: "Rain",
      63: "Rain",
      65: "Heavy Rain",
      71: "Snow",
      95: "Thunderstorm"
    };

    weatherEl.textContent = `${weatherMap[w.weathercode] || "Weather"} • ${Math.round(
      w.temperature
    )}°F`;
  } catch {
    weatherEl.textContent = "Weather unavailable";
  }
}

/* ===============================
   INIT
=============================== */
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  loadDraft();
  loadAtlantaWeather();
});

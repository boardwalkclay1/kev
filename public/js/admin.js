/* ============================================================
   ADMIN ENGINE v3 — AUTO-FILL, BRANDING, PLACEHOLDERS, WEATHER
============================================================ */

/* ===============================
   PAPERWORK TEMPLATES (with placeholders)
=============================== */
const DOC_TEMPLATES = {
  contract: `TREE WORK SERVICE AGREEMENT
Kevin’s Tree Service LLC
Phone: 470‑515‑6134
Email: kevinmosley2000@gmail.com

Client Name: {{clientName}}
Job Address: {{clientAddress}}
Date: {{date}}

SCOPE OF WORK
{{workDescription}}

PROPERTY ACCESS
Client grants Contractor full access to the property, including driveways, yards, gates, and work areas.

DEBRIS & CLEANUP
All debris will be removed unless otherwise stated.

PAYMENT TERMS
Payment due upon completion.

SIGNATURES
Client Signature: ___________________________   Date: ____________
Contractor Signature: ________________________   Date: ____________`,

  estimate: `TREE WORK ESTIMATE
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

VALID FOR 14 DAYS.`,

  invoice: `INVOICE
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
Payment due upon completion.`,

  proposal: `TREE WORK PROPOSAL
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

Client Signature: ___________________________`
};

/* ===============================
   SHORTCUTS
=============================== */
const $ = id => document.getElementById(id);

/* ===============================
   DOCUMENT GENERATOR (AUTO-FILL)
=============================== */
function generateDocument() {
  const type = document.querySelector(".tab-btn.active").dataset.tab;
  let template = DOC_TEMPLATES[type];

  const replacements = {
    "{{clientName}}": v("clientName"),
    "{{clientAddress}}": v("clientAddress"),
    "{{date}}": new Date().toLocaleDateString(),
    "{{workDescription}}": v("workDescription"),
    "{{labor}}": v("labor"),
    "{{equipment}}": v("equipment"),
    "{{debris}}": v("debris"),
    "{{total}}": v("total"),
    "{{notes}}": v("notes"),
    "{{invoiceNumber}}": v("invoiceNumber")
  };

  for (const key in replacements) {
    template = template.replaceAll(key, replacements[key] || "");
  }

  // Add branded footer + logo
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

  $("docBody").value = DOC_TEMPLATES.contract;
}

/* ===============================
   EMAIL PREVIEW
=============================== */
function openEmailPreview() {
  const preview = `
Type: ${$("docTitle").textContent}

Client: ${$("clientName").value}
Email: ${$("clientEmail").value}
Address: ${$("clientAddress").value}

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
  const email = $("clientEmail").value || "kevinmosley2000@gmail.com";
  const subject = encodeURIComponent($("docTitle").textContent);
  const body = encodeURIComponent($("docBody").value);

  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

/* ===============================
   UTILITIES
=============================== */
function v(id) {
  const el = $(id);
  return el ? el.value.trim() : "";
}

function insertTimestamp() {
  $("docBody").value += `\n\nGenerated: ${new Date().toLocaleString()}`;
  saveDraft();
}

function copyDocToClipboard() {
  navigator.clipboard.writeText($("docBody").value);
  alert("Document copied.");
}

/* ===============================
   AUTOSAVE
=============================== */
function saveDraft() {
  const draft = {
    type: $("docTitle").textContent,
    body: $("docBody").value,
    name: $("clientName").value,
    email: $("clientEmail").value,
    address: $("clientAddress").value,
    work: $("workDescription")?.value || "",
    labor: $("labor")?.value || "",
    equipment: $("equipment")?.value || "",
    debris: $("debris")?.value || "",
    total: $("total")?.value || "",
    notes: $("notes")?.value || "",
    invoiceNumber: $("invoiceNumber")?.value || ""
  };

  localStorage.setItem("adminDraft", JSON.stringify(draft));
}

function loadDraft() {
  const draft = JSON.parse(localStorage.getItem("adminDraft") || "{}");
  if (!draft.body) return;

  $("docTitle").textContent = draft.type || "Contract";
  $("docBody").value = draft.body;
  $("clientName").value = draft.name || "";
  $("clientEmail").value = draft.email || "";
  $("clientAddress").value = draft.address || "";
  $("workDescription").value = draft.work || "";
  $("labor").value = draft.labor || "";
  $("equipment").value = draft.equipment || "";
  $("debris").value = draft.debris || "";
  $("total").value = draft.total || "";
  $("notes").value = draft.notes || "";
  $("invoiceNumber").value = draft.invoiceNumber || "";
}

/* ===============================
   ATLANTA WEATHER (ACCURATE °F)
=============================== */
async function loadAtlantaWeather() {
  const weatherEl = $("atlWeather");
  const clockEl = $("atlClock");

  setInterval(() => {
    clockEl.textContent = new Date().toLocaleTimeString("en-US");
  }, 1000);

  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=33.749&longitude=-84.388&current_weather=true&temperature_unit=fahrenheit&timezone=auto"
    );

    const data = await res.json();
    const w = data.current_weather;

    const map = {
      0: "Clear",
      1: "Mainly Clear",
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

    weatherEl.textContent = `${map[w.weathercode] || "Weather"}, ${Math.round(
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

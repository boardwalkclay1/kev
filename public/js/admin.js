/* ============================================================
   ADMIN ENGINE v2 — CLEAN, MODULAR, PRODUCTION READY
   Handles: Templates, Tabs, Email Preview, Weather, Clock,
   Autosave, Clipboard, Signature Pad, Utilities
============================================================ */

/* ===============================
   PAPERWORK TEMPLATES
=============================== */
const DOC_TEMPLATES = {
  contract: `TREE WORK SERVICE AGREEMENT
Kevin’s Tree Service LLC
Phone: 470‑515‑6134
Email: kevinmosley2000@gmail.com

Client Name: _______________________________
Job Address: _______________________________
Date: ___________________

SCOPE OF WORK
Kevin’s Tree Service LLC (“Contractor”) agrees to perform the following services:
• Tree removal, trimming, pruning, or cleanup as described in the attached work order.
• All work will be performed using industry‑standard safety practices.
• Contractor is not responsible for underground utilities unless clearly marked by the client.

PROPERTY ACCESS
Client grants Contractor full access to the property, including driveways, yards, gates, and work areas. Client is responsible for securing pets and clearing personal items from the work zone.

DEBRIS & CLEANUP
Unless otherwise stated:
• All brush, limbs, and logs will be removed.
• Stump grinding is NOT included unless listed separately.
• Raking and surface cleanup will be performed to a reasonable standard.

HAZARDOUS TREE DISCLAIMER
Trees that are dead, rotted, storm‑damaged, leaning, or structurally compromised may behave unpredictably.

DAMAGE WAIVER
Contractor is not responsible for:
• Driveway cracks from equipment
• Lawn ruts
• Damage to unmarked utilities

PAYMENT TERMS
Payment due upon completion.

WEATHER & DELAYS
Work may be rescheduled due to unsafe weather.

CANCELLATION
Cancellations within 24 hours may incur a fee.

LIABILITY & INSURANCE
Contractor is fully insured.

SIGNATURES
Client Signature: ___________________________   Date: ____________
Contractor Signature: ________________________   Date: ____________`,

  estimate: `TREE WORK ESTIMATE
Kevin’s Tree Service LLC
Phone: 470‑515‑6134
Email: kevinmosley2000@gmail.com

Client Name: _______________________________
Job Address: _______________________________
Date: ___________________

REQUESTED WORK
• __________________________________________
• __________________________________________
• __________________________________________

ESTIMATED COST
Labor: $__________
Equipment: $__________
Debris Removal: $__________
Total Estimate: $__________

NOTES
• Estimate based on visible conditions.
• Hidden rot or storm damage may affect pricing.
• Stump grinding not included unless listed.

VALID FOR 14 DAYS.`,

  invoice: `INVOICE
Kevin’s Tree Service LLC
Phone: 470‑515‑6134
Email: kevinmosley2000@gmail.com

Invoice #: ___________________
Date: _______________________

Bill To:
Client Name: _______________________________
Address: ___________________________________

SERVICES PROVIDED
• __________________________________________
• __________________________________________
• __________________________________________

TOTAL DUE
Labor: $__________
Equipment: $__________
Debris Removal: $__________
Total Amount Due: $__________

PAYMENT TERMS
Payment due upon completion.`,

  proposal: `TREE WORK PROPOSAL
Kevin’s Tree Service LLC
Phone: 470‑515‑6134
Email: kevinmosley2000@gmail.com

Client Name: _______________________________
Job Address: _______________________________
Date: ___________________

RECOMMENDED WORK
• __________________________________________
• __________________________________________
• __________________________________________

BENEFITS
• Increased safety
• Reduced storm risk
• Healthier canopy
• More sunlight

ESTIMATED TOTAL: $__________

Client Signature: ___________________________`
};

/* ===============================
   SHORTCUTS
=============================== */
const $ = id => document.getElementById(id);

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

  // Load default
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
    address: $("clientAddress").value
  };

  localStorage.setItem("adminDraft", JSON.stringify(draft));
}

function loadDraft() {
  const draft = JSON.parse(localStorage.getItem("adminDraft") || "{}");
  if (!draft.body) return;

  $("docTitle").textContent = draft.type || "Contract";
  $("docBody").value = draft.body || DOC_TEMPLATES.contract;
  $("clientName").value = draft.name || "";
  $("clientEmail").value = draft.email || "";
  $("clientAddress").value = draft.address || "";
}

/* ===============================
   ATLANTA WEATHER (ACCURATE °F)
=============================== */
async function loadAtlantaWeather() {
  const weatherEl = $("atlWeather");
  const clockEl = $("atlClock");

  // Clock
  setInterval(() => {
    clockEl.textContent = new Date().toLocaleTimeString("en-US");
  }, 1000);

  // Weather
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

// ===============================
// PAPERWORK TEMPLATES
// ===============================
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
• All brush, limbs, and logs will be removed from the property.
• Stump grinding is NOT included unless listed as a separate line item.
• Raking and surface cleanup will be performed to a reasonable standard.

HAZARDOUS TREE DISCLAIMER
Trees that are dead, rotted, storm‑damaged, leaning, or structurally compromised may behave unpredictably. Contractor is not responsible for cracking, splitting, or unexpected movement caused by pre‑existing conditions.

DAMAGE WAIVER
Contractor is not responsible for:
• Cracks or damage to driveways caused by heavy equipment.
• Lawn ruts or turf damage caused by necessary equipment access.
• Damage to unmarked underground utilities, irrigation, or septic systems.

PAYMENT TERMS
• Payment is due in full upon completion of work.
• Accepted forms: Cash, card, Zelle, or approved payment link.
• Late payments may incur additional fees.

WEATHER & DELAYS
Work may be rescheduled due to unsafe weather conditions. Contractor will notify the client as soon as possible.

CANCELLATION
Client may cancel up to 24 hours before the scheduled start time. Cancellations within 24 hours may incur a fee.

LIABILITY & INSURANCE
Contractor is fully insured. Client agrees to indemnify Contractor against claims arising from unsafe site conditions not disclosed prior to work.

SIGNATURES
By signing below, both parties agree to the terms of this agreement.

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
• This estimate is based on visible conditions at the time of inspection.
• Hidden rot, storm damage, or structural issues may affect final pricing.
• Stump grinding is not included unless listed above.

VALIDITY
This estimate is valid for 14 days.

Client Approval: _____________________________   Date: ____________`,

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
• Payment due upon completion.
• Accepted: Cash, card, Zelle, or payment link.
• Late payments may incur fees.

NOTES
____________________________________________
____________________________________________

Thank you for choosing Kevin’s Tree Service LLC!`,

  proposal: `TREE WORK PROPOSAL
Kevin’s Tree Service LLC
Phone: 470‑515‑6134
Email: kevinmosley2000@gmail.com

Client Name: _______________________________
Job Address: _______________________________
Date: ___________________

RECOMMENDED WORK
Based on our inspection, we recommend the following:
• __________________________________________
• __________________________________________
• __________________________________________

BENEFITS
• Improved safety around home and structures.
• Reduced storm‑related risk.
• Healthier tree structure and canopy.
• Increased yard space and sunlight.

PROJECT COST
Estimated Total: $__________

TIMELINE
Work can be scheduled within ___ days of approval.

ACCEPTANCE
Client Signature: ___________________________   Date: ____________`
};

// ===============================
// HELPERS
// ===============================
function v(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function setV(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

// ===============================
// TABS + TEMPLATE LOADING
// ===============================
function initAdminTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const docBody = document.getElementById("docBody");
  const docTitle = document.getElementById("docTitle");

  if (!buttons.length || !docBody || !docTitle) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".tab-btn.active")?.classList.remove("active");
      btn.classList.add("active");

      const type = btn.dataset.tab;
      docTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      setV("docBody", DOC_TEMPLATES[type] || "");
    });
  });

  // Load default (contract)
  setV("docBody", DOC_TEMPLATES.contract);
}

// ===============================
// EMAIL PREVIEW + SEND
// ===============================
function openEmailPreview() {
  const name = v("clientName");
  const email = v("clientEmail");
  const address = v("clientAddress");
  const body = v("docBody");
  const title = document.getElementById("docTitle")?.textContent || "Document";

  const preview = `
Type: ${title}

Client: ${name}
Email: ${email}
Address: ${address}

--- DOCUMENT ---

${body}
  `.trim();

  const modal = document.getElementById("emailModal");
  const previewEl = document.getElementById("emailPreview");
  if (!modal || !previewEl) return;

  previewEl.textContent = preview;
  modal.classList.add("show");
}

function closeEmailPreview() {
  document.getElementById("emailModal")?.classList.remove("show");
}

function sendFinalEmail() {
  const email = v("clientEmail") || "kevinmosley2000@gmail.com";
  const title = document.getElementById("docTitle")?.textContent || "Tree Work Document";
  const body = v("docBody");

  const subject = encodeURIComponent(`${title} — Kevin’s Tree Service`);
  const encodedBody = encodeURIComponent(body);

  window.location.href = `mailto:${email}?subject=${subject}&body=${encodedBody}`;
}

// ===============================
// QUICK UTILITIES
// ===============================
function insertTimestamp() {
  const el = document.getElementById("docBody");
  if (!el) return;
  const stamp = `\n\nGenerated: ${new Date().toLocaleString()}`;
  el.value += stamp;
}

function copyDocToClipboard() {
  const body = v("docBody");
  if (!body) return;
  navigator.clipboard.writeText(body).then(() => {
    alert("Document copied to clipboard.");
  });
}

// ===============================
// ATLANTA WEATHER (ACCURATE °F)
// ===============================
async function adminLoadAtlantaWeather() {
  const weatherEl = document.getElementById("atlWeather");
  const clockEl = document.getElementById("atlClock");
  if (!weatherEl || !clockEl) return;

  // Clock
  function updateClock() {
    const now = new Date();
    const options = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
    clockEl.textContent = now.toLocaleTimeString("en-US", options);
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Weather in Fahrenheit
  const lat = 33.749;
  const lng = -84.388;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&temperature_unit=fahrenheit&timezone=auto`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const w = data.current_weather;
    const temp = Math.round(w.temperature);
    const cond = adminCodeToText(w.weathercode);
    weatherEl.textContent = `${cond}, ${temp}°F`;
  } catch {
    weatherEl.textContent = "Weather unavailable";
  }
}

function adminCodeToText(code) {
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
  return map[code] || "Weather";
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  initAdminTabs();
  adminLoadAtlantaWeather();
});

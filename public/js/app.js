// CLOCK + WEATHER FOR ATLANTA
async function loadAtlantaWeather() {
  const weatherEl = document.getElementById("atlWeather");
  const clockEl = document.getElementById("atlClock");

  // Clock
  function updateClock() {
    const now = new Date();
    const options = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
    clockEl.textContent = now.toLocaleTimeString("en-US", options);
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Weather (Open-Meteo API)
  const lat = 33.749; // Atlanta latitude
  const lng = -84.388; // Atlanta longitude
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&timezone=auto`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const w = data.current_weather;
    const temp = Math.round(w.temperature);
    const cond = codeToText(w.weathercode);
    weatherEl.textContent = `${cond}, ${temp}°F`;
  } catch {
    weatherEl.textContent = "Weather unavailable";
  }
}

function codeToText(code) {
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

// SIGNATURE PAD
let sigPad, sigCtx, drawing = false, lastX = 0, lastY = 0;

function initSignaturePad() {
  sigPad = document.getElementById("signaturePad");
  if (!sigPad) return;

  sigCtx = sigPad.getContext("2d");
  sigCtx.strokeStyle = "#222";
  sigCtx.lineWidth = 2;
  sigCtx.lineCap = "round";

  const start = (x, y) => {
    drawing = true;
    [lastX, lastY] = [x, y];
  };

  const draw = (x, y) => {
    if (!drawing) return;
    sigCtx.beginPath();
    sigCtx.moveTo(lastX, lastY);
    sigCtx.lineTo(x, y);
    sigCtx.stroke();
    [lastX, lastY] = [x, y];
  };

  const stop = () => (drawing = false);

  // Mouse
  sigPad.addEventListener("mousedown", e => start(e.offsetX, e.offsetY));
  sigPad.addEventListener("mousemove", e => draw(e.offsetX, e.offsetY));
  sigPad.addEventListener("mouseup", stop);
  sigPad.addEventListener("mouseleave", stop);

  // Touch
  sigPad.addEventListener("touchstart", e => {
    e.preventDefault();
    const rect = sigPad.getBoundingClientRect();
    const t = e.touches[0];
    start(t.clientX - rect.left, t.clientY - rect.top);
  }, { passive: false });

  sigPad.addEventListener("touchmove", e => {
    e.preventDefault();
    const rect = sigPad.getBoundingClientRect();
    const t = e.touches[0];
    draw(t.clientX - rect.left, t.clientY - rect.top);
  }, { passive: false });

  sigPad.addEventListener("touchend", e => {
    e.preventDefault();
    stop();
  }, { passive: false });
}

function clearSignature() {
  if (!sigPad || !sigCtx) return;
  sigCtx.clearRect(0, 0, sigPad.width, sigPad.height);
}

function downloadSignature() {
  if (!sigPad) return;
  const link = document.createElement("a");
  link.href = sigPad.toDataURL("image/png");
  link.download = "signed-contract.png";
  link.click();
}

// CONTRACT EMAIL
function openContractEmail() {
  const clientName = document.getElementById("clientName").value.trim();
  const clientEmail = document.getElementById("clientEmail").value.trim();
  const clientAddress = document.getElementById("clientAddress").value.trim();
  const contractText = document.getElementById("contractBody").value;

  const subject = encodeURIComponent(`Tree Work Agreement — ${clientName || "Client"}`);
  const body = encodeURIComponent(
    `Client: ${clientName}\nEmail: ${clientEmail}\nAddress: ${clientAddress}\n\n--- CONTRACT ---\n\n${contractText}\n\n(Attach the signed image file if available.)`
  );

  const to = clientEmail || "kevinmosley2000@gmail.com";
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

// INVOICE EMAIL
function openInvoiceEmail() {
  const clientName = document.getElementById("clientName").value.trim();
  const clientEmail = document.getElementById("clientEmail").value.trim();
  const invoiceNumber = document.getElementById("invoiceNumber").value.trim();
  const amount = document.getElementById("invoiceAmount").value.trim();
  const notes = document.getElementById("invoiceNotes").value.trim();

  const subject = encodeURIComponent(`Invoice ${invoiceNumber || ""} — Kevin’s Tree Service`);
  const body = encodeURIComponent(
    `Client: ${clientName}\nInvoice #: ${invoiceNumber}\nAmount: $${amount}\n\nNotes:\n${notes}\n\nThank you for your business!`
  );

  const to = clientEmail || "kevinmosley2000@gmail.com";
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

// PAYMENT LINK
function copyPaymentLink() {
  const link = document.getElementById("paymentLink").value.trim();
  if (!link) return;
  navigator.clipboard.writeText(link).then(() => {
    alert("Payment link copied.");
  });
}

function openPaymentEmail() {
  const clientName = document.getElementById("clientName").value.trim();
  const clientEmail = document.getElementById("clientEmail").value.trim();
  const link = document.getElementById("paymentLink").value.trim();

  const subject = encodeURIComponent(`Payment Link — Kevin’s Tree Service`);
  const body = encodeURIComponent(
    `Hi ${clientName || ""},\n\nYou can pay securely using this link:\n${link}\n\nThank you!\nKevin’s Tree Service LLC`
  );

  const to = clientEmail || "kevinmosley2000@gmail.com";
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

// INIT EVERYTHING
document.addEventListener("DOMContentLoaded", () => {
  loadAtlantaWeather();
  initSignaturePad();
});

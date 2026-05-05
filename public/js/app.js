// Basic console ping
document.addEventListener("DOMContentLoaded", () => {
  console.log("Kevin’s Tree Service site loaded");
});

/* ESTIMATE EMAIL (mailto) */

function sendEstimateEmail() {
  const name = document.getElementById("estName").value.trim();
  const phone = document.getElementById("estPhone").value.trim();
  const address = document.getElementById("estAddress").value.trim();
  const details = document.getElementById("estDetails").value.trim();

  const subject = encodeURIComponent("Tree Service Estimate Request");
  const body = encodeURIComponent(
    `Name: ${name}\nPhone: ${phone}\nAddress/Area: ${address}\n\nWork details:\n${details}`
  );

  window.location.href = `mailto:kevinmosley2000@gmail.com?subject=${subject}&body=${body}`;
}

/* CONTACT EMAIL (mailto) */

function sendContactEmail() {
  const name = document.getElementById("cName").value.trim();
  const phone = document.getElementById("cPhone").value.trim();
  const msg = document.getElementById("cMsg").value.trim();

  const subject = encodeURIComponent("Tree Service Message from Website");
  const body = encodeURIComponent(
    `Name: ${name}\nPhone: ${phone}\n\nMessage:\n${msg}`
  );

  window.location.href = `mailto:kevinmosley2000@gmail.com?subject=${subject}&body=${body}`;
}

/* SIGNATURE PAD (canvas) */

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

  sigPad.addEventListener("mousedown", e => start(e.offsetX, e.offsetY));
  sigPad.addEventListener("mousemove", e => draw(e.offsetX, e.offsetY));
  sigPad.addEventListener("mouseup", stop);
  sigPad.addEventListener("mouseleave", stop);

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

/* CONTRACT EMAIL */

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

/* INVOICE / RECEIPT EMAIL */

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

/* PAYMENT LINK HELPERS */

function copyPaymentLink() {
  const link = document.getElementById("paymentLink").value.trim();
  if (!link) return;
  navigator.clipboard?.writeText(link).then(() => {
    alert("Payment link copied.");
  }).catch(() => {
    alert("Copy failed. You can select and copy the link manually.");
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

/* INIT */

document.addEventListener("DOMContentLoaded", initSignaturePad);

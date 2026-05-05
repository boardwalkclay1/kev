// TAB SWITCHING
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".tab-btn.active").classList.remove("active");
    btn.classList.add("active");

    const type = btn.dataset.tab;
    document.getElementById("docTitle").textContent =
      type.charAt(0).toUpperCase() + type.slice(1);

    // Load template text
    document.getElementById("docBody").value =
      templates[type] || "";
  });
});

// TEMPLATES
const templates = {
  contract: "Tree Work Contract:\n\nScope of Work:\n- ...\n\nPrice:\n- ...",
  estimate: "Estimate:\n\nRequested Work:\n- ...\n\nEstimated Cost:\n- ...",
  invoice: "Invoice:\n\nServices Provided:\n- ...\n\nTotal Due:\n- ...",
  proposal: "Proposal:\n\nRecommended Work:\n- ...\n\nProjected Cost:\n- ..."
};

// EMAIL PREVIEW
function openEmailPreview() {
  const name = val("clientName");
  const email = val("clientEmail");
  const address = val("clientAddress");
  const body = val("docBody");

  const preview = `
Client: ${name}
Email: ${email}
Address: ${address}

--- DOCUMENT ---

${body}
  `;

  document.getElementById("emailPreview").textContent = preview;
  document.getElementById("emailModal").classList.add("show");
}

function closeEmailPreview() {
  document.getElementById("emailModal").classList.remove("show");
}

function sendFinalEmail() {
  const email = val("clientEmail") || "kevinmosley2000@gmail.com";
  const subject = encodeURIComponent("Tree Work Document");
  const body = encodeURIComponent(val("docBody"));

  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

// Helper
function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

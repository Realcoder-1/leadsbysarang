const bookingConfig = {
  bookingUrl: "https://calendly.com/your-account/strategy-call",
  webhookUrl: ""
};

const tabButtons = document.querySelectorAll(".tab-button");
const panels = {
  calendar: document.getElementById("calendar-panel"),
  form: document.getElementById("lead-form")
};

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const activeTab = button.dataset.tab;

    tabButtons.forEach((tab) => tab.classList.toggle("active", tab === button));
    Object.entries(panels).forEach(([name, panel]) => {
      panel.classList.toggle("active", name === activeTab);
    });
  });
});

const bookingLink = document.getElementById("booking-link");
bookingLink.href = bookingConfig.bookingUrl;
bookingLink.addEventListener("click", (event) => {
  if (!bookingConfig.bookingUrl || bookingConfig.bookingUrl.includes("your-account")) {
    event.preventDefault();
    document.getElementById("form-note").textContent =
      "Add your live booking URL in script.js, or use the form tab for webhook capture.";
    document.querySelector('[data-tab="form"]').click();
  }
});

document.getElementById("lead-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const note = document.getElementById("form-note");
  const payload = Object.fromEntries(new FormData(form).entries());
  payload.source = "leadsbysarang roofing lead generation page";
  payload.requestedAt = new Date().toISOString();

  if (!bookingConfig.webhookUrl) {
    note.textContent = `Webhook not connected yet. Payload ready: ${JSON.stringify(payload)}`;
    return;
  }

  try {
    const response = await fetch(bookingConfig.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}`);
    }

    form.reset();
    note.textContent = "Request sent. Check your CRM, automation tool, or webhook destination.";
  } catch (error) {
    note.textContent = `Could not send request: ${error.message}`;
  }
});

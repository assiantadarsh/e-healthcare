const API_BASE = "http://localhost:5000";

const doctorNameEl = document.getElementById("doctorName");
const patientNameView = document.getElementById("patientNameView");
const dateView = document.getElementById("dateView");
const timeView = document.getElementById("timeView");
const paymentForm = document.getElementById("paymentForm");
const paymentLoader = document.getElementById("paymentLoader");
const toast = document.getElementById("toast");
const methodBtns = document.querySelectorAll(".method-btn");

const upiPanel = document.getElementById("upiPanel");
const cardPanel = document.getElementById("cardPanel");
const bankPanel = document.getElementById("bankPanel");
// const slotsContainer = document.getElementById("slotsContainer");
const time = document.getElementById("appointmentTime").value;

const doctorId = sessionStorage.getItem("selectedDoctorId");

let selectedMethod = "upi";

// ================= TOAST =================
function showToast(message) {
  if (!toast) return;

  toast.innerText = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, 3000);
}

// ================= USER =================
// function getCurrentUser() {
//   return JSON.parse(localStorage.getItem("user"));
// }
function getCurrentUser() {
  const user = localStorage.getItem("user");

  if (!user || user === "undefined") {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

function getSelectedDoctor() {
  return sessionStorage.getItem("selectedDoctor") || "";
}

// ================= SUMMARY =================
function syncSummary() {
  const user = getCurrentUser();
  const doctor = getSelectedDoctor();

  if (!doctor || !doctorId) {
    showToast("Select a doctor first ❌");
    setTimeout(() => window.location.href = "index.html", 1200);
    return;
  }

  doctorNameEl.textContent = doctor;

  if (user) {
    patientNameView.textContent = user.name;
  }
}

// ================= PAYMENT METHOD =================
methodBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    methodBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    selectedMethod = btn.dataset.method;

    upiPanel.classList.add("hidden");
    cardPanel.classList.add("hidden");
    bankPanel.classList.add("hidden");

    if (selectedMethod === "upi") upiPanel.classList.remove("hidden");
    if (selectedMethod === "card") cardPanel.classList.remove("hidden");
    if (selectedMethod === "bank") bankPanel.classList.remove("hidden");
  });
});

// ================= SUBMIT =================
paymentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = getCurrentUser();
  const doctor = getSelectedDoctor();
  const slot = sessionStorage.getItem("selectedSlot");

  if (!user) return showToast("Please login first");
  if (!doctorId) return showToast("Doctor ID missing ❌");
  // if (!slot) return showToast("Please select a time slot ❌");
  if (time) return showToast("Please select time ❌");

  const payload = {
  doctor,
  doctor_id: parseInt(doctorId),

  patientName: document.getElementById("patientName").value,
  patientPhone: document.getElementById("patientPhone").value,
  appointmentDate: document.getElementById("appointmentDate").value,
  appointmentTime: document.getElementById("appointmentTime").value,

  problem: document.getElementById("problem").value,
  email: user.email
};

  // ================= VALIDATION =================
  if (selectedMethod === "upi") {
    if (!document.getElementById("upiId").value.trim()) {
      return showToast("Enter UPI ID");
    }
  }

  if (selectedMethod === "card") {
    if (
      !document.getElementById("cardNumber").value.trim() ||
      !document.getElementById("cardExpiry").value.trim() ||
      !document.getElementById("cardCvv").value.trim() ||
      !document.getElementById("cardName").value.trim()
    ) {
      return showToast("Fill card details");
    }
  }

  if (selectedMethod === "bank") {
    if (!document.getElementById("txnRef").value.trim()) {
      return showToast("Enter transaction/reference ID");
    }
  }

  paymentLoader.classList.add("show");

  setTimeout(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/appointments`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      paymentLoader.classList.remove("show");

      if (!res.ok) throw new Error(data.message);

      // ✅ SAFE CLEANUP (NOT CLEAR ALL)
      sessionStorage.removeItem("selectedDoctor");
      sessionStorage.removeItem("selectedDoctorId");
      sessionStorage.removeItem("selectedSlot");

      showToast("Payment successful & appointment booked ✅");

      setTimeout(() => {
        window.location.href = "appointments.html";
      }, 1200);

    } catch (err) {
      console.error(err);
      paymentLoader.classList.remove("show");
      showToast("Payment failed ❌");
    }
  }, 1200);
});

// ================= INIT =================
window.addEventListener("DOMContentLoaded", () => {
  syncSummary();

  const slot = sessionStorage.getItem("selectedSlot");
  timeView.textContent = slot || "—";
});
const API_BASE = "http://localhost:5000";

const appointmentsList = document.getElementById("appointmentsList");
const totalAppointmentsEl = document.getElementById("totalAppointments");
const upcomingAppointmentsEl = document.getElementById("upcomingAppointments");
const accountNameEl = document.getElementById("accountName");
const userInfoText = document.getElementById("userInfoText");
const logoutBtn = document.getElementById("logoutBtn");
const toast = document.getElementById("toast");

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

function syncUserUI() {
  const user = getCurrentUser();

  if (user) {
    accountNameEl.textContent = user.name;
    userInfoText.textContent = `Logged in as ${user.name} (${user.email})`;
  } else {
    accountNameEl.textContent = "Guest";
    userInfoText.textContent = "Login to view your appointment history.";
  }
}

// ================= STATUS =================
function getStatus(dateStr) {
  if (!dateStr) return "Completed";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const apptDate = new Date(dateStr + "T00:00:00");

  return apptDate >= today ? "Upcoming" : "Completed";
}

// ================= RENDER =================
function renderAppointments(data) {
  if (!appointmentsList) return;

  appointmentsList.innerHTML = "";

  const total = data?.length || 0;

  const upcoming = (data || []).filter(app =>
    getStatus(app.date) === "Upcoming"
  ).length;

  totalAppointmentsEl.textContent = total;
  upcomingAppointmentsEl.textContent = upcoming;

  if (!data || data.length === 0) {
    appointmentsList.innerHTML = `
      <div class="empty-panel">
        No appointments found.
      </div>
    `;
    return;
  }

  data.forEach(app => {
    const status = getStatus(app.date);
    const statusClass = status === "Upcoming"
      ? "status-upcoming"
      : "status-completed";

    const card = document.createElement("div");
    card.className = "appointment-card";

    card.innerHTML = `
      <div class="appointment-head">
        <div>
          <h3>${app.doctor_name || "Doctor"}</h3>
          <span class="status-pill ${statusClass}">${status}</span>
        </div>
      </div>

      <div class="appointment-info">
        <p><strong>Patient:</strong> ${app.patient_name || "—"}</p>
        <p><strong>Date:</strong> ${app.date || "—"}</p>
        <p><strong>Time:</strong> ${app.slot || "—"}</p>
        <p><strong>Phone:</strong> ${app.phone || "—"}</p>
        <p><strong>Problem:</strong> ${app.problem || "—"}</p>
      </div>

      <div class="appointment-actions">
        <button class="cancel-btn" data-id="${app.id}">
          Cancel Appointment
        </button>

        <button class="join-call-btn"
          data-id="${app.id}"
          data-doctor-id="${app.doctor_id || ""}">
          🎥 Join Video Call
        </button>
      </div>
    `;

    appointmentsList.appendChild(card);
  });
}

// ================= LOAD =================
async function loadMyAppointments() {
  const user = getCurrentUser();

  if (!user) {
    renderAppointments([]);
    return;
  }

  try {
    const res = await fetch(
      `${API_BASE}/api/my-appointments?email=${encodeURIComponent(user.email)}`
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to load appointments");
    }

    renderAppointments(data);

  } catch (err) {
    console.error(err);
    showToast("Failed to load appointments");
  }
}

// ================= ACTIONS =================
appointmentsList?.addEventListener("click", async (e) => {

  // CANCEL
  if (e.target.classList.contains("cancel-btn")) {
    const user = getCurrentUser();
    if (!user) return showToast("Login first");

    const id = e.target.dataset.id;

    try {
      const res = await fetch(
        `${API_BASE}/api/appointments/${id}?email=${encodeURIComponent(user.email)}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      showToast("Appointment cancelled");
      loadMyAppointments();

    } catch {
      showToast("Cancel failed");
    }
  }

  // VIDEO CALL
  if (e.target.classList.contains("join-call-btn")) {
    const user = getCurrentUser();
    if (!user) return showToast("Login first");

    const appointmentId = e.target.dataset.id;
    const doctorId = e.target.dataset.doctorId;

    if (!doctorId) {
      showToast("Doctor ID missing ❌");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/video-call/authorize`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          email: user.email,
          appointmentId,
          doctorId
        })
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message);
        return;
      }

      window.open(`video.html?room=${data.roomId}`, "_blank");

    } catch {
      showToast("Unable to join call");
    }
  }
});

// ================= LOGOUT =================
logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("user");

  showToast("Logged out");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 700);
});

// ================= INIT =================
window.addEventListener("DOMContentLoaded", () => {
  syncUserUI();
  loadMyAppointments();
});
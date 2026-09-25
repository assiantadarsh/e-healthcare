const API_BASE = "http://localhost:5000";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const filterBtns = document.querySelectorAll(".filter-btn");
const loginBtn = document.getElementById("loginBtn");
const toast = document.getElementById("toast");
const doctorGrid = document.getElementById("doctorGrid");
const loginModal = document.getElementById("loginModal");
const dropdown = document.getElementById("profileDropdown");
const userName = document.getElementById("userName");
const heroPayBtn = document.querySelector(".hero-card .full-btn");
const regName = document.getElementById("regName");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

let currentFilter = "all";
let selectedSlot = "";

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
    loginBtn.innerText = user.name;
    userName.innerText = "👤 " + user.name;
  } else {
    loginBtn.innerText = "Login";
    userName.innerText = "";
  }
}

// ================= LOGIN =================
function closeLogin() {
  loginModal?.classList.remove("show");
}

// ================= UTILS =================
function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function escapeHtml(str = "") {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// ================= NAVIGATION =================
function goToDoctor(id) {
  window.location.href = `doctor.html?id=${id}`;
}

function openPaymentForDoctor(docId, docName) {
  const user = getCurrentUser();

  if (!user) {
    showToast("Please login first ❌");
    loginModal?.classList.add("show");
    return;
  }

  sessionStorage.setItem("selectedDoctor", docName);
  sessionStorage.setItem("selectedDoctorId", parseInt(docId));

  sessionStorage.removeItem("selectedSlot");

  window.location.href = "payment.html";
}

// ================= RENDER =================
function renderDoctors(doctors) {
  if (!doctorGrid) return;

  doctorGrid.innerHTML = "";

  if (!doctors.length) {
    doctorGrid.innerHTML = `<p>No doctors found</p>`;
    return;
  }

  doctors.forEach(doc => {
    doctorGrid.innerHTML += `
      <div class="doctor-card" data-specialty="${doc.specialty}">
        <div class="doctor-avatar">${getInitials(doc.name)}</div>

        <h3 onclick="goToDoctor(${doc.id})" style="cursor:pointer;">
          ${escapeHtml(doc.name)}
        </h3>

        <p class="specialty">${doc.specialty}</p>
        <p>${doc.area}, ${doc.city}</p>

        <div class="doctor-meta">
          <span>${doc.rating} ★</span>
          <span>${doc.experience} yrs exp</span>
        </div>

        <button 
          class="btn btn-secondary book-btn"
          data-id="${doc.id}"
          data-name="${doc.name}">
          Book Now
        </button>
      </div>
    `;
  });

  applyFilter();
}

// ================= FILTER =================
function applyFilter() {
  document.querySelectorAll(".doctor-card").forEach(card => {
    const spec = card.dataset.specialty;

    if (currentFilter === "all" || spec === currentFilter) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.dataset.filter;
    applyFilter();
  });
});

// ================= LOAD =================
async function loadDoctors() {
  try {
    const res = await fetch(`${API_BASE}/api/doctors`);
    const data = await res.json();
    renderDoctors(data);
  } catch {
    showToast("Failed to load doctors");
  }
}

// ================= LOCATION =================
function getLocationAndLoadNearby() {
  if (!navigator.geolocation) return loadDoctors();

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      try {
        const res = await fetch(`${API_BASE}/api/nearby-doctors?lat=${lat}&lng=${lng}`);
        const data = await res.json();
        renderDoctors(data);
      } catch {
        loadDoctors();
      }
    },
    () => {
      showToast("Location denied ❌");
      loadDoctors();
    }
  );
}

// ================= SEARCH =================
async function searchDoctors() {
  const query = searchInput?.value.trim() || "";

  try {
    const res = await fetch(`${API_BASE}/api/doctors?search=${query}`);
    const data = await res.json();

    if (!data.length) {
      showToast("No results");
      return loadDoctors();
    }

    renderDoctors(data);
  } catch {
    showToast("Search failed");
  }
}

searchBtn?.addEventListener("click", searchDoctors);
searchInput?.addEventListener("input", searchDoctors);

// ================= BOOK =================
doctorGrid?.addEventListener("click", (e) => {
  if (e.target.classList.contains("book-btn")) {
    const doctorId = e.target.dataset.id;
    const doctorName = e.target.dataset.name;

    openPaymentForDoctor(doctorId, doctorName);
  }
});

// ================= LOGIN BTN =================
loginBtn?.addEventListener("click", () => {
  const user = getCurrentUser();

  if (user) {
    dropdown?.classList.toggle("hidden");
  } else {
    loginModal?.classList.add("show");
  }
});

// ================= LOGOUT =================
document.querySelector(".logout-btn")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  showToast("Logged out 👋");
  location.reload();
});

// ================= AUTH =================
function registerUser() {
  fetch(`${API_BASE}/api/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      name: regName.value,
      email: regEmail.value,
      password: regPassword.value
    })
  })
  .then(res => res.json())
  .then(() => showToast("Registered ✅"))
  .catch(() => showToast("Register failed ❌"));
}

function loginUser() {
  fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: loginEmail.value,
      password: loginPassword.value
    })
  })
  .then(res => res.json())
  .then(data => {
    localStorage.setItem("user", JSON.stringify(data.user));
    showToast("Login successful ✅");
    location.reload();
  })
  .catch(() => showToast("Login failed ❌"));
}

// ================= HERO BUTTON =================
heroPayBtn?.addEventListener("click", () => {
  document.getElementById("doctors")?.scrollIntoView({ behavior: "smooth" });
});

// ================= INIT =================
window.onload = () => {
  syncUserUI();
  getLocationAndLoadNearby();
};

// ================= PLAN =================
document.querySelectorAll(".plan-btn").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const user = getCurrentUser();

    if (!user) {
      showToast("Please login first ❌");
      return;
    }

    // ✅ fallback plan mapping
    const plans = ["Basic", "Pro", "Family"];
    const prices = [199, 499, 899];

    const plan = btn.dataset.plan || plans[index];
    const price = btn.dataset.price || prices[index];

    sessionStorage.setItem("selectedPlan", plan);
    sessionStorage.setItem("planPrice", price);

    window.location.href = "plan-payment.html";
  });
});
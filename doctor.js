const profileBox = document.getElementById("doctorProfile");

// ================= GET ID =================
function getId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// ================= BACK =================
function goBack() {
  window.history.back();
}

// ================= INITIALS =================
function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map(n => n[0])
    .join("")
    .toUpperCase();
}

// ================= LOAD DOCTOR =================
async function loadDoctor() {
  const id = getId();

  if (!profileBox) return;

  if (!id) {
    profileBox.innerHTML = "<h2>Invalid doctor ID</h2>";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/doctors");
    const data = await res.json();

    const doc = data.find(d => d.id == id);

    if (!doc) {
      profileBox.innerHTML = "<h2>Doctor not found</h2>";
      return;
    }

    profileBox.innerHTML = `
      <div style="display:flex; gap:30px; flex-wrap:wrap; margin-top:30px;">
        
        <div style="flex:1; min-width:260px; background:#fff; padding:20px; border-radius:20px; box-shadow:var(--shadow); text-align:center;">
          
          <div class="doctor-avatar" style="width:100px;height:100px;font-size:32px;margin:auto;">
            ${getInitials(doc.name)}
          </div>

          <h2 style="margin-top:15px;">${doc.name}</h2>
          <p class="specialty">${doc.specialty}</p>

          <p style="margin-top:10px;">📍 ${doc.area}, ${doc.city}</p>

          <div style="margin-top:15px;">
            ⭐ ${doc.rating} | 💼 ${doc.experience} yrs
          </div>

          <h3 style="margin-top:20px; color:var(--primary);">
            ₹ ${doc.fees || 500} Consultation
          </h3>

        </div>

        <div style="flex:2; min-width:300px; background:#fff; padding:25px; border-radius:20px; box-shadow:var(--shadow);">
          
          <h3>About Doctor</h3>
          <p style="color:var(--muted); margin-top:8px;">
            Highly experienced ${doc.specialty} with excellent patient satisfaction.
            Provides quality consultation and modern treatment methods.
          </p>

          <h3 style="margin-top:20px;">Available Timings</h3>
          <p style="color:var(--muted);">09:00 AM - 05:00 PM</p>

          <h3 style="margin-top:20px;">Reviews</h3>
          <div style="margin-top:10px;">
            <p>⭐ 4.9 - "Very helpful doctor"</p>
            <p>⭐ 4.8 - "Good experience"</p>
            <p>⭐ 5.0 - "Highly recommended"</p>
          </div>

          <button 
            class="btn btn-primary full-btn" 
            style="margin-top:25px;"
            onclick="bookNow(${doc.id}, \`${doc.name}\`)"
          >
            Book Appointment
          </button>

        </div>
      </div>
    `;
  } catch {
    profileBox.innerHTML = "<h2>Error loading doctor</h2>";
  }
}

// ================= BOOK FUNCTION (FIXED) =================
function bookNow(id, name) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please login first");
    window.location.href = "index.html";
    return;
  }

  if (!id) {
    alert("Doctor ID missing ❌");
    return;
  }

  sessionStorage.setItem("selectedDoctor", name);
  sessionStorage.setItem("selectedDoctorId", id);

  window.location.href = "payment.html";
}

// ================= INIT =================
loadDoctor();
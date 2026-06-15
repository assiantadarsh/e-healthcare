const container = document.getElementById("adminAppointments");

// ================= LOAD ALL APPOINTMENTS =================
async function loadAppointments() {
  try {
    const res = await fetch("http://localhost:5000/api/admin/appointments");
    const data = await res.json();

    container.innerHTML = "";

    data.forEach(app => {
      container.innerHTML += `
        <div class="doctor-card">
          <h3>${app.doctor_name}</h3>
          <p>${app.patient_name}</p>
          <p>${app.date} - ${app.time}</p>
          <p>${app.problem}</p>
          <button onclick="deleteAppointment(${app.id})" class="btn btn-secondary">
            Delete
          </button>
        </div>
      `;
    });

  } catch {
    container.innerHTML = "Error loading data";
  }
}

// ================= DELETE =================
async function deleteAppointment(id) {

  if (!confirm("Delete this appointment?")) return;

  await fetch(`http://localhost:5000/api/admin/appointments/${id}`, {
    method: "DELETE"
  });

  loadAppointments();
}
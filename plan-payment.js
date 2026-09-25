const API_BASE = "http://localhost:5000";

// ================= DATA =================
const plan =
  sessionStorage.getItem("selectedPlan") ||
  localStorage.getItem("selectedPlan");

const price =
  sessionStorage.getItem("planPrice") ||
  localStorage.getItem("planPrice");

const payBtn = document.getElementById("payBtn");

// ================= UI =================
const planNameEl = document.getElementById("planName");
const planPriceEl = document.getElementById("planPrice");

if (planNameEl) {
  planNameEl.innerText = plan
    ? `Plan: ${plan.toUpperCase()}`
    : "No Plan Selected";
}

if (planPriceEl) {
  planPriceEl.innerText = price ? `₹${price}` : "";
}

// ================= TOAST =================
function showToast(msg) {
  let toast = document.getElementById("customToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "customToast";
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = "#333";
    toast.style.color = "#fff";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "8px";
    toast.style.zIndex = "999";
    document.body.appendChild(toast);
  }

  toast.innerText = msg;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

// ================= USER =================
function getCurrentUser() {
  const user = localStorage.getItem("user");

  if (!user || user === "undefined") return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

// ================= PAYMENT =================
if (payBtn) {
  payBtn.addEventListener("click", async () => {

    const user = getCurrentUser();

    if (!user) {
      showToast("Please login first ❌");
      return;
    }

    if (!plan) {
      showToast("Plan not selected ❌");
      return;
    }

    // 🔒 prevent double click
    if (payBtn.disabled) return;

    payBtn.innerText = "Processing...";
    payBtn.disabled = true;

    try {
      const res = await fetch(`${API_BASE}/api/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user.email.trim().toLowerCase(),
          planName: plan
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Payment failed");
      }

      // ================= SUCCESS UI =================
      document.body.innerHTML = `
        <div style="text-align:center;margin-top:100px;font-family:Poppins">
          <h1>✅ Payment Successful</h1>
          <p>Your plan <strong>${plan}</strong> is activated</p>

          <a href="index.html"
             style="display:inline-block;margin-top:20px;padding:12px 25px;
             background:#4CAF50;color:white;border-radius:8px;
             text-decoration:none;font-weight:600;">
             Go to Home
          </a>
        </div>
      `;

      // ✅ cleanup (both storages)
      sessionStorage.removeItem("selectedPlan");
      sessionStorage.removeItem("planPrice");

      localStorage.removeItem("selectedPlan");
      localStorage.removeItem("planPrice");

    } catch (err) {
      console.error(err);
      showToast(err.message || "Server error ❌");

      // 🔁 reset button
      payBtn.innerText = "Pay Now";
      payBtn.disabled = false;
    }
  });
}
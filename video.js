const params = new URLSearchParams(window.location.search);
let room = params.get("room");

// ================= VALIDATION =================
if (!room || room === "undefined") {
  alert("Invalid room ❌");
  window.location.href = "index.html";
  throw new Error("Invalid room");
}

// ✅ CLEAN ROOM NAME
room = room.replace(/[^a-zA-Z0-9_-]/g, "");

// ================= WAIT FOR JITSI =================
function waitForJitsi(callback) {
  let tries = 0;

  const interval = setInterval(() => {
    if (typeof JitsiMeetExternalAPI !== "undefined") {
      clearInterval(interval);
      callback();
    }

    tries++;
    if (tries > 15) {
      clearInterval(interval);
      alert("Video service failed ❌");
      window.location.href = "appointments.html";
    }
  }, 300);
}

// ================= START =================
waitForJitsi(startVideo);

let api = null;

function startVideo() {

  const container = document.querySelector("#videoContainer");

  if (!container) {
    alert("Video container missing ❌");
    return;
  }

  const domain = "meet.jit.si";

  api = new JitsiMeetExternalAPI(domain, {
    roomName: room,
    parentNode: container,
    width: "100%",
    height: "100%",

    configOverwrite: {
      startWithAudioMuted: false,
      startWithVideoMuted: false
    },

    interfaceConfigOverwrite: {
      SHOW_JITSI_WATERMARK: false,
      SHOW_POWERED_BY: false
    }
  });

  // ================= EVENTS =================

  // ✅ user joined
  api.addEventListener("videoConferenceJoined", () => {
    console.log("User joined call");
    updateUI("connected");
  });

  // ✅ call end
  api.addEventListener("readyToClose", handleExit);
  api.addEventListener("videoConferenceLeft", handleExit);

  // 👨‍⚕️ doctor join
  api.addEventListener("participantJoined", () => {
    console.log("Doctor joined");
  });

  api.addEventListener("participantLeft", () => {
    console.log("Participant left");
  });

  // ================= INIT UI =================
  updateUI("connecting");
}

// ================= EXIT HANDLER =================
function handleExit() {
  cleanup();
  window.location.href = "appointments.html";
}

// ================= CLEANUP =================
function cleanup() {
  if (api) {
    api.dispose();
    api = null;
  }
}

// ================= UI =================
function updateUI(state) {
  const doctorInfo = document.getElementById("doctorInfo");

  if (!doctorInfo) return;

  if (state === "connecting") {
    doctorInfo.innerHTML = `
      <p><strong>Room ID:</strong> ${room}</p>
      <p style="color:orange;">🟡 Connecting...</p>
    `;
  }

  if (state === "connected") {
    doctorInfo.innerHTML = `
      <p><strong>Room ID:</strong> ${room}</p>
      <p style="color:green;"><strong>🟢 Call Connected</strong></p>
      <p><strong>Features:</strong> 🎤 Mute | 📹 Camera | 💬 Chat</p>
    `;
  }
}

// ================= SAFETY (TAB CLOSE) =================
window.addEventListener("beforeunload", cleanup);
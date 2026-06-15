const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

// ================= ADD MESSAGE =================
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = type === "user" ? "user-msg" : "bot-msg";
  div.innerText = text;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ================= BOT REPLY =================
function getBotReply(message) {
  const text = message.toLowerCase();

  if (text.includes("chest") || text.includes("heart")) {
    return "Chest pain can be serious. Call emergency services immediately. Keep the patient sitting comfortably and avoid physical activity.";
  }

  if (text.includes("breath") || text.includes("breathing") || text.includes("oxygen")) {
    return "Breathing difficulty is urgent. Call emergency services immediately. Help the patient sit upright and keep the area open for fresh air.";
  }

  if (text.includes("accident") || text.includes("injury") || text.includes("bleeding")) {
    return "For accident or heavy bleeding, call ambulance immediately. Keep the patient safe and avoid unnecessary movement.";
  }

  if (text.includes("fever") || text.includes("temperature")) {
    return "For fever, keep the patient hydrated and monitor temperature. If fever is very high or symptoms are severe, contact a doctor quickly.";
  }

  if (text.includes("unconscious") || text.includes("faint")) {
    return "Unconsciousness is an emergency. Call emergency services immediately. Keep the patient safe and do not give food or drink.";
  }

  if (text.includes("pregnancy") || text.includes("pregnant")) {
    return "Pregnancy-related emergency needs quick medical support. Contact a hospital or emergency service immediately.";
  }

  if (text.includes("burn")) {
    return "For burns, cool the affected area with clean running water. Do not apply random creams. Seek medical help if the burn is serious.";
  }

  if (text.includes("poison") || text.includes("tablet") || text.includes("medicine")) {
    return "Possible poisoning or overdose can be dangerous. Call emergency services immediately and keep the medicine container with you for the doctor.";
  }

  return "Please stay calm. If symptoms are severe, worsening, or life-threatening, call emergency services immediately.";
}

// ================= SEND MESSAGE =================
function sendMessage() {
  const message = userInput.value.trim();

  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  setTimeout(() => {
    const reply = getBotReply(message);
    addMessage(reply, "bot");
  }, 600);
}

// ================= QUICK MESSAGE =================
function quickMessage(text) {
  userInput.value = text;
  sendMessage();
}

// ================= ENTER KEY =================
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
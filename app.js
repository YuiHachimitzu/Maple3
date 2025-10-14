const loginScreen = document.getElementById("login-screen");
const mainScreen = document.getElementById("main-screen");
const yuiBtn = document.getElementById("yui-btn");
const koiBtn = document.getElementById("koi-btn");
const userTitle = document.getElementById("user-title");
const logoutBtn = document.getElementById("logout");
const chatBox = document.getElementById("chat-box");
const msgInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

let currentUser = localStorage.getItem("currentUser");

function showMainScreen(name) {
  currentUser = name;
  localStorage.setItem("currentUser", name);
  loginScreen.classList.add("hidden");
  mainScreen.classList.remove("hidden");
  userTitle.textContent = `${name} 💕`;
  document.body.style.background =
    name === "Yui" ? "#fff5f8" : "#f5fffa";
}

if (currentUser) showMainScreen(currentUser);

yuiBtn.onclick = () => showMainScreen("Yui");
koiBtn.onclick = () => showMainScreen("Koi");

logoutBtn.onclick = () => {
  localStorage.removeItem("currentUser");
  mainScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
};

// Temporary local chat
sendBtn.onclick = () => {
  const msg = msgInput.value.trim();
  if (!msg) return;
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", currentUser.toLowerCase());
  msgDiv.textContent = `${currentUser}: ${msg}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  msgInput.value = "";
};
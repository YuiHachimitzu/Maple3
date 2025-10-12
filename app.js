import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCNiTqrSrxHtUOrjj0sJJSSskp1Ly3QS-Y",
  authDomain: "yui-and-koi.firebaseapp.com",
  databaseURL: "https://yui-and-koi-default-rtdb.firebaseio.com",
  projectId: "yui-and-koi",
  storageBucket: "yui-and-koi.firebasestorage.app",
  messagingSenderId: "121295478721",
  appId: "1:121295478721:web:cb3cf45f42b923e31b9940"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const scheduleRef = ref(db, "schedules");
const chatRef = ref(db, "chat");

// Mode switching
const pinkBtn = document.getElementById("pinkMode");
const greenBtn = document.getElementById("greenMode");

pinkBtn.onclick = () => {
  document.body.style.background = "#ffe6f2";
};
greenBtn.onclick = () => {
  document.body.style.background = "#e0ffe5";
};

// Schedule
const addBtn = document.getElementById("addBtn");
const postBtn = document.getElementById("postBtn");
const dateInput = document.getElementById("dateInput");
const noteInput = document.getElementById("noteInput");
const scheduleList = document.getElementById("scheduleList");

addBtn.onclick = () => {
  const date = dateInput.value;
  const note = noteInput.value.trim();
  if (!date || !note) return alert("Please fill both fields 🥺");
  push(scheduleRef, { date, note });
  noteInput.value = "";
};
postBtn.onclick = () => alert("Posted 💞");

onValue(scheduleRef, (snapshot) => {
  scheduleList.innerHTML = "";
  snapshot.forEach((child) => {
    const data = child.val();
    const div = document.createElement("div");
    div.className = "schedule-item";
    div.innerHTML = `<b>${data.date}</b><br>${data.note} <button class='delete-btn' data-id='${child.key}'>×</button>`;
    scheduleList.appendChild(div);
  });
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.onclick = () => remove(ref(db, "schedules/" + btn.dataset.id));
  });
});

// Days Left Counter
const specialDate = document.getElementById("specialDate");
const daysDisplay = document.getElementById("daysDisplay");
specialDate.onchange = () => {
  const now = new Date();
  const target = new Date(specialDate.value);
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  daysDisplay.textContent = diff > 0 ? `${diff} days left 💖` : "🎉 It's today!";
};

// Chat system
const sendMsg = document.getElementById("sendMsg");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

sendMsg.onclick = () => {
  const text = chatInput.value.trim();
  if (!text) return;
  push(chatRef, { text });
  chatInput.value = "";
};

onValue(chatRef, (snapshot) => {
  chatMessages.innerHTML = "";
  snapshot.forEach((msg) => {
    const p = document.createElement("div");
    p.textContent = "💬 " + msg.val().text;
    chatMessages.appendChild(p);
  });
});
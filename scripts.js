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

postBtn.onclick = () => alert("Your cute post has been shared 💌");

onValue(scheduleRef, (snapshot) => {
  scheduleList.innerHTML = "";
  snapshot.forEach((child) => {
    const data = child.val();
    const item = document.createElement("div");
    item.className = "schedule-item";
    item.innerHTML = `
      <b>📅 ${data.date}</b><br>${data.note}
      <button class="delete-btn" data-id="${child.key}">×</button>
    `;
    scheduleList.appendChild(item);
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.onclick = () => remove(ref(db, "schedules/" + btn.dataset.id));
  });
});
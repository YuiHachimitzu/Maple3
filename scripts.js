
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSy....",
  authDomain: "yuiandkoi.firebaseapp.com",
  databaseURL: "https://yuiandkoi-default-rtdb.firebaseio.com",
  projectId: "yuiandkoi",
  storageBucket: "yuiandkoi.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef12345"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const scheduleRef = ref(db, "schedules");

const form = document.getElementById("scheduleForm");
const list = document.getElementById("scheduleList");

form.addEventListener("submit", e => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const datetime = document.getElementById("datetime").value;

  if (title && datetime) {
    push(scheduleRef, {
      title,
      datetime
    });
    form.reset();
  }
});

onValue(scheduleRef, snapshot => {
  list.innerHTML = "";
  const data = snapshot.val();
  if (data) {
    Object.values(data).forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.title} - ${new Date(item.datetime).toLocaleString()}`;
      list.appendChild(li);
    });
  }
});
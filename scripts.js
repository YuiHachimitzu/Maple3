import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "yuiandkoi.firebaseapp.com",
  databaseURL: "https://yuiandkoi-default-rtdb.firebaseio.com",
  projectId: "yuiandkoi",
  storageBucket: "yuiandkoi.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const type = document.getElementById("type");
const title = document.getElementById("title");
const details = document.getElementById("details");
const dateInput = document.getElementById("date");
const nameInput = document.getElementById("name");
const addBtn = document.getElementById("addBtn");
const postBtn = document.getElementById("postBtn");
const posts = document.getElementById("posts");

function renderPlans(snapshot) {
  posts.innerHTML = "";
  snapshot.forEach((child) => {
    const p = child.val();
    const key = child.key;

    const div = document.createElement("div");
    div.className = p.type === "date" ? "date-bubble" : "assignment-note";
    div.innerHTML = `
      <span>${p.type === "date" ? "💗" : "📝"} ${p.title} on ${p.date} — ${p.details}<br><small>Added by ${p.name}</small></span>
      <button class="delete-btn" data-key="${key}">❌</button>
    `;

    posts.appendChild(div);
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.onclick = () => remove(ref(db, "plans/" + btn.dataset.key));
  });
}

addBtn.onclick = () => {
  if (!title.value || !dateInput.value || !nameInput.value) {
    alert("Please fill out all fields 💕");
    return;
  }

  push(ref(db, "plans"), {
    type: type.value,
    title: title.value,
    details: details.value,
    date: dateInput.value,
    name: nameInput.value
  });

  title.value = "";
  details.value = "";
  nameInput.value = "";
};

postBtn.onclick = () => {
  alert("Posted successfully 💞");
};

onValue(ref(db, "plans"), renderPlans);
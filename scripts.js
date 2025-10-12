import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSy....", // your full key
  authDomain: "yuiandkoi.firebaseapp.com",
  databaseURL: "https://yuiandkoi-default-rtdb.firebaseio.com",
  projectId: "yuiandkoi",
  storageBucket: "yuiandkoi.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef12345"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const type = document.getElementById("type");
const dateInput = document.getElementById("date");
const title = document.getElementById("title");
const details = document.getElementById("details");
const addBtn = document.getElementById("addBtn");
const postBtn = document.getElementById("postBtn");
const posts = document.getElementById("posts");

function renderPlans(snapshot) {
  posts.innerHTML = "";
  snapshot.forEach((child) => {
    const p = child.val();
    const key = child.key;
    const div = document.createElement("div");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.border = "none";
    deleteBtn.style.background = "transparent";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.onclick = () => remove(ref(db, "plans/" + key));

    if (p.type === "date") {
      div.className = "date-bubble";
      div.textContent = `💗 ${p.title} on ${p.date} — ${p.details}`;
    } else {
      div.className = "assignment-note";
      div.textContent = `📝 ${p.title} due ${p.date} — ${p.details}`;
    }

    div.appendChild(deleteBtn);
    posts.appendChild(div);
  });
}

addBtn.onclick = () => {
  if (!title.value || !dateInput.value) {
    alert("Please fill out all fields!");
    return;
  }

  push(ref(db, "plans"), {
    type: type.value,
    date: dateInput.value,
    title: title.value,
    details: details.value
  });

  title.value = "";
  details.value = "";
};

postBtn.onclick = () => {
  alert("Posted successfully 💞");
};

onValue(ref(db, "plans"), (snapshot) => {
  renderPlans(snapshot);
});
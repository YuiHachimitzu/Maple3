import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

const type = document.getElementById("type");
const dateInput = document.getElementById("date");
const title = document.getElementById("title");
const details = document.getElementById("details");
const addBtn = document.getElementById("addBtn");
const postBtn = document.getElementById("postBtn");
const posts = document.getElementById("posts");
const nameInput = document.getElementById("name");

function renderPlans(snapshot) {
  posts.innerHTML = "";
  snapshot.forEach((child) => {
    const p = child.val();
    const key = child.key;

    const div = document.createElement("div");
    const del = document.createElement("button");
    del.textContent = "❌";
    del.className = "delete-btn";
    del.onclick = () => remove(ref(db, "plans/" + key));

    if (p.type === "date") {
      div.className = "date-bubble";
      div.textContent = `💗 ${p.title} on ${p.date} — ${p.details} (by ${p.name})`;
    } else {
      div.className = "assignment-note";
      div.textContent = `📝 ${p.title} due ${p.date} — ${p.details} (by ${p.name})`;
    }

    div.appendChild(del);
    posts.appendChild(div);
  });
}

addBtn.onclick = () => {
  if (!title.value || !dateInput.value || !nameInput.value) {
    alert("Please fill out all fields!");
    return;
  }

  push(ref(db, "plans"), {
    name: nameInput.value,
    type: type.value,
    date: dateInput.value,
    title: title.value,
    details: details.value
  });

  title.value = "";
  details.value = "";
  nameInput.value = "";
};

postBtn.onclick = () => {
  alert("Posted successfully 💞");
};

onValue(ref(db, "plans"), (snapshot) => {
  renderPlans(snapshot);
});
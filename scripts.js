const type = document.getElementById("type");
const dateInput = document.getElementById("date");
const title = document.getElementById("title");
const details = document.getElementById("details");
const addBtn = document.getElementById("addBtn");
const postBtn = document.getElementById("postBtn");
const posts = document.getElementById("posts");

let plans = JSON.parse(localStorage.getItem("plans")) || [];

function savePlans() {
  localStorage.setItem("plans", JSON.stringify(plans));
}

function renderPlans() {
  posts.innerHTML = "";
  plans.forEach((p, i) => {
    const div = document.createElement("div");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.border = "none";
    deleteBtn.style.background = "transparent";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.onclick = () => {
      plans.splice(i, 1);
      savePlans();
      renderPlans();
    };

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
  plans.push({
    type: type.value,
    date: dateInput.value,
    title: title.value,
    details: details.value
  });
  savePlans();
  title.value = "";
  details.value = "";
  renderPlans();
};

postBtn.onclick = () => {
  renderPlans();
  alert("Posted successfully 💞");
};

renderPlans();
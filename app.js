// app.js - main logic (Firebase + UI)
// Put this file in root and ensure index.html uses: <script type="module" src="app.js"></script>

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
const schedulesRef = ref(db, "schedules");
const chatRef = ref(db, "chat");

// UI refs
const appRoot = document.getElementById("app");
const tabs = Array.from(document.querySelectorAll(".tab"));
const navBtns = Array.from(document.querySelectorAll(".navbtn"));
const themeBtn = document.getElementById("themeBtn");
const toSchedule = document.getElementById("toSchedule");
const toChat = document.getElementById("toChat");

const modeDate = document.getElementById("modeDate");
const modeTimer = document.getElementById("modeTimer");
const dateInputs = document.getElementById("dateInputs");
const timerInputs = document.getElementById("timerInputs");

const schTitle = document.getElementById("sch-title");
const schDetails = document.getElementById("sch-details");
const schDate = document.getElementById("sch-date");
const schHours = document.getElementById("sch-hours");
const schMins = document.getElementById("sch-mins");
const schName = document.getElementById("sch-name");
const schAdd = document.getElementById("sch-add");
const schPost = document.getElementById("sch-post");
const schedulesList = document.getElementById("schedulesList");

const chatSender = document.getElementById("chatSender");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");
const chatWindow = document.getElementById("chatWindow");

const daysLeftEl = document.getElementById("daysLeft");

// theme
let theme = localStorage.getItem("yk_theme") || "pink";
applyTheme(theme);
themeBtn.onclick = () => { theme = theme === "pink" ? "green" : "pink"; applyTheme(theme); };
function applyTheme(t){
  if(t==="green"){ appRoot.classList.add("green"); document.body.style.background = "linear-gradient(135deg,#e6fff0,#d8fbe4)"; themeBtn.textContent = "🌿"; }
  else { appRoot.classList.remove("green"); document.body.style.background = "linear-gradient(135deg,#ffeaf2,#ffd6e8)"; themeBtn.textContent = "🌸"; }
  localStorage.setItem("yk_theme", t);
}

// tabs nav
navBtns.forEach(b=>{
  b.onclick = ()=>{
    navBtns.forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    const tabName = b.dataset.tab;
    tabs.forEach(t=> t.id === `tab-${tabName}` ? t.classList.add("active") : t.classList.remove("active"));
  };
});
function navigateTo(n){ navBtns.forEach(x=> x.classList.toggle("active", x.dataset.tab===n)); tabs.forEach(t=> t.id===`tab-${n}`? t.classList.add("active"): t.classList.remove("active")); }
toSchedule.onclick = ()=> navigateTo("schedule");
toChat.onclick = ()=> navigateTo("chat");

// moniversary countdown (5th)
function updateDaysLeft(){
  const now = new Date();
  let target = new Date(now.getFullYear(), now.getMonth(), 5);
  if(target <= now) target = new Date(now.getFullYear(), now.getMonth()+1, 5);
  const diff = Math.ceil((target - now) / (1000*60*60*24));
  daysLeftEl.textContent = diff>0 ? `${diff} days left 💖` : "🎉 It's today!";
}
updateDaysLeft();
setInterval(updateDaysLeft, 60*60*1000);

// simple calendar (month view) - marks schedule dates (heart)
const calendarWrap = document.getElementById("calendarWrap");
let currentMonth = new Date();
renderCalendar();

function renderCalendar(){
  calendarWrap.innerHTML = "";
  const monthBox = document.createElement("div");
  monthBox.className = "month";
  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();

  const header = document.createElement("div");
  header.className = "row";
  const title = document.createElement("div");
  title.textContent = currentMonth.toLocaleString(undefined,{month:"long", year:"numeric"});
  title.style.fontWeight="700";
  header.appendChild(title);
  monthBox.appendChild(header);

  const labels = document.createElement("div");
  labels.className="row";
  ["S","M","T","W","T","F","S"].forEach(d=> { const el=document.createElement("div"); el.className="day"; el.style.fontWeight="600"; el.textContent=d; labels.appendChild(el); });
  monthBox.appendChild(labels);

  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();

  // build grid
  let cells = [];
  for(let i=0;i<startDay;i++) cells.push(null);
  for(let d=1; d<=daysInMonth; d++) cells.push(new Date(year,month,d));

  const rows = Math.ceil(cells.length/7);
  for(let r=0;r<rows;r++){
    const row = document.createElement("div"); row.className="row";
    for(let c=0;c<7;c++){
      const idx = r*7 + c;
      const dateCell = document.createElement("div");
      dateCell.className = "day";
      if(!cells[idx]) { dateCell.classList.add("other"); dateCell.innerHTML = "&nbsp;"; }
      else {
        const d = cells[idx];
        const num = document.createElement("span"); num.className="num"; num.textContent = d.getDate();
        dateCell.appendChild(num);
        // if this date has a saved schedule, mark heart (we'll fetch schedules and mark later)
        dateCell.onclick = ()=> {
          // set sch-date input to clicked day
          const y = d.getFullYear();
          const m = String(d.getMonth()+1).padStart(2,"0");
          const dd = String(d.getDate()).padStart(2,"0");
          schDate.value = `${y}-${m}-${dd}`;
          modeDate.click();
        };
      }
      row.appendChild(dateCell);
    }
    monthBox.appendChild(row);
  }

  calendarWrap.appendChild(monthBox);

  // after building calendar, mark hearts by checking schedules in DB
  onValue(schedulesRef, snap=>{
    const savedDates = new Set();
    snap.forEach(child=>{
      const p = child.val();
      if(p.type === "date" && p.date) savedDates.add(p.date);
      if(p.type === "timer" && p.deadline) {
        // also mark calendar day of the deadline date
        const d = new Date(p.deadline);
        const y = d.getFullYear();
        const m = String(d.getMonth()+1).padStart(2,"0");
        const dd = String(d.getDate()).padStart(2,"0");
        savedDates.add(`${y}-${m}-${dd}`);
      }
    });
    // mark hearts
    monthBox.querySelectorAll(".day").forEach(cell=>{
      const num = cell.querySelector(".num");
      if(!num) return;
      const day = Number(num.textContent);
      const y = currentMonth.getFullYear();
      const m = String(currentMonth.getMonth()+1).padStart(2,"0");
      const dd = String(day).padStart(2,"0");
      const key = `${y}-${m}-${dd}`;
      if(savedDates.has(key)) cell.classList.add("heart"); else cell.classList.remove("heart");
    });
  });
}

// toggle calendar months by tapping the month title (advanced: left/right not included to keep UI simple)
// You could add prev/next if you want later

// MODE toggle Date <-> Timer
modeDate.onclick = ()=> { modeDate.classList.add("active"); modeTimer.classList.remove("active"); dateInputs.classList.remove("hidden"); timerInputs.classList.add("hidden"); };
modeTimer.onclick = ()=> { modeTimer.classList.add("active"); modeDate.classList.remove("active"); timerInputs.classList.remove("hidden"); dateInputs.classList.add("hidden"); };

// SCHEDULE: add as date or timer (shared)
schAdd.onclick = ()=>{
  const title = schTitle.value.trim();
  const details = schDetails.value.trim();
  const name = schName.value.trim() || "Yui";
  if(!title || !name) return alert("Please add a title and your name");
  if(modeDate.classList.contains("active")){
    if(!schDate.value) return alert("Pick a date from the calendar or use the date input");
    const obj = { type:"date", title, details, date:schDate.value, name, createdAt: Date.now() };
    push(schedulesRef, obj);
  } else {
    // timer mode
    const hours = Number(schHours.value) || 0;
    const mins = Number(schMins.value) || 0;
    const totalMs = (hours*60 + mins) * 60 * 1000;
    if(totalMs <= 0) return alert("Set hours or minutes for timer");
    const deadline = Date.now() + totalMs;
    const obj = { type:"timer", title, details, deadline, name, createdAt: Date.now() };
    push(schedulesRef, obj);
  }
  // clear inputs
  schTitle.value = ""; schDetails.value=""; schDate.value=""; schHours.value=""; schMins.value=""; schName.value="";
};

// Realtime render schedules with countdowns
onValue(schedulesRef, snap=>{
  schedulesList.innerHTML = "";
  const items = [];
  snap.forEach(child=>{
    const p = child.val();
    p._key = child.key;
    items.push(p);
  });
  // sort by createdAt descending
  items.sort((a,b)=> (b.createdAt||0)-(a.createdAt||0));
  for(const p of items){
    const el = document.createElement("div");
    el.className = "schedule-item";
    const left = document.createElement("div");
    const title = document.createElement("div"); title.style.fontWeight="700"; title.textContent = p.title;
    const details = document.createElement("div"); details.className="meta"; details.textContent = p.details || "";
    const meta = document.createElement("div"); meta.className="meta";
    if(p.type === "date"){
      meta.textContent = `💗 Date • ${p.date} • by ${p.name}`;
    } else {
      meta.textContent = `⏳ Timer • by ${p.name}`;
    }
    left.appendChild(title); left.appendChild(details); left.appendChild(meta);

    const right = document.createElement("div");
    const timeEl = document.createElement("div");
    timeEl.style.fontWeight="700";
    timeEl.style.marginBottom="6px";
    right.appendChild(timeEl);

    const del = document.createElement("button");
    del.className = "delete-btn"; del.textContent = "❌";
    del.onclick = ()=> {
      if(!confirm("Delete this schedule?")) return;
      remove(ref(db, "schedules/"+p._key));
    };
    right.appendChild(del);

    el.appendChild(left);
    el.appendChild(right);
    schedulesList.appendChild(el);

    // countdown updater
    function updateCountdown(){
      let diffMs = 0;
      if(p.type === "date"){
        // set deadline at end of day (23:59)
        const dt = new Date(p.date + "T23:59:59");
        diffMs = dt - Date.now();
      } else {
        diffMs = (p.deadline || 0) - Date.now();
      }
      if(diffMs <= 0){
        timeEl.textContent = "⏰ Time's up!";
        timeEl.style.color = "#c23a5b";
      } else {
        const totalMins = Math.floor(diffMs / 60000);
        const hours = Math.floor(totalMins/60);
        const mins = totalMins % 60;
        timeEl.textContent = `${hours}h ${mins}m left`;
        timeEl.style.color = "";
      }
    }
    updateCountdown();
    // attach interval for each item
    const intervalId = setInterval(updateCountdown, 60*1000);
    // clear interval when removed from DOM (simple approach)
    // note: intervals remain if page not refreshed; this is acceptable for lightweight lists
  }
  // re-render calendar hearts
  renderCalendar();
});

// CHAT: send with pfp + name + timestamp
chatSend.onclick = ()=>{
  const text = chatInput.value.trim();
  const sender = chatSender.value || "Yui";
  if(!text) return;
  const msg = { text, sender, ts: Date.now() };
  push(chatRef, msg);
  chatInput.value = "";
};

onValue(chatRef, snap=>{
  chatWindow.innerHTML = "";
  snap.forEach(child=>{
    const m = child.val();
    const wrapper = document.createElement("div");
    const cls = (m.sender||"Yui").toLowerCase() === "koi" ? "koi" : "yui";
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${cls}`;
    const meta = document.createElement("div"); meta.className="meta";
    const time = new Date(m.ts || Date.now());
    const ts = time.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    meta.innerHTML = `<strong>${escapeHtml(m.sender)}</strong> • <small>${ts}</small>`;
    const txt = document.createElement("div"); txt.textContent = m.text;
    bubble.appendChild(meta);
    bubble.appendChild(txt);

    // avatar left or right
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "flex-end";
    if(cls === "yui"){
      const img = makeAvatar("yui");
      img.style.marginRight = "8px";
      row.appendChild(img);
      row.appendChild(bubble);
    } else {
      row.appendChild(bubble);
      const img = makeAvatar("koi");
      img.style.marginLeft = "8px";
      row.appendChild(img);
      row.style.justifyContent = "flex-end";
    }
    chatWindow.appendChild(row);
  });
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

// small chibi avatar factory (svg data URIs)
function makeAvatar(which){
  const wrapper = document.createElement("div");
  wrapper.style.width = "36px";
  wrapper.style.height = "36px";
  wrapper.style.borderRadius = "8px";
  wrapper.style.overflow = "hidden";
  wrapper.style.flex = "0 0 36px";
  const svg = document.createElement("img");
  svg.style.width = "36px";
  svg.style.height = "36px";
  if(which==="yui"){
    svg.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'><rect rx='6' width='36' height='36' fill='#ffb6c1'/><circle cx='18' cy='12' r='7' fill='#fff3f6'/><rect x='10' y='20' width='16' height='10' rx='3' fill='#ffd6e8'/></svg>`);
  } else {
    svg.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'><rect rx='6' width='36' height='36' fill='#bfeecc'/><circle cx='18' cy='12' r='7' fill='#f6fffb'/><rect x='10' y='20' width='16' height='10' rx='3' fill='#d8fbe4'/></svg>`);
  }
  wrapper.appendChild(svg);
  return wrapper;
}

// helper escape
function escapeHtml(s){ return (s||"").toString().replace(/[&<>"']/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

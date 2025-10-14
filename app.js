// app.js - main logic (Firebase + UI)

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  // NOTE: In a real app, do not expose API keys directly in client-side code.
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

// --- UI References ---
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

const scheduleForm = document.getElementById("scheduleForm");
const schTitle = document.getElementById("sch-title");
const schDetails = document.getElementById("sch-details");
const schDate = document.getElementById("sch-date");
const schHours = document.getElementById("sch-hours");
const schMins = document.getElementById("sch-mins");
const schName = document.getElementById("sch-name");
const schedulesList = document.getElementById("schedulesList");

const chatSender = document.getElementById("chatSender");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");
const chatWindow = document.getElementById("chatWindow");
const daysLeftEl = document.getElementById("daysLeft");

// Global map to track and clear countdown intervals (CRITICAL: Prevents memory leaks)
const countdownIntervals = {};

// --- Utility Functions ---

// Helper for escaping HTML content
function escapeHtml(s){ 
  return (s||"").toString().replace(/[&<>"']/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); 
}

// Function to control the schedule mode toggle
function setScheduleMode(mode) {
    const isDate = mode === 'date';
    modeDate.classList.toggle("active", isDate);
    modeTimer.classList.toggle("active", !isDate);
    dateInputs.classList.toggle("hidden", !isDate);
    timerInputs.classList.toggle("hidden", isDate);
}
modeDate.onclick = () => setScheduleMode('date');
modeTimer.onclick = () => setScheduleMode('timer');

// --- 1. Theme Logic ---

let theme = localStorage.getItem("yk_theme") || "pink";
applyTheme(theme);

// Simplified theme function: JS only toggles the class, CSS handles all styling
function applyTheme(t){
  if(t==="green"){ 
    appRoot.classList.add("green"); 
    themeBtn.textContent = "🌿"; 
  }
  else { 
    appRoot.classList.remove("green"); 
    themeBtn.textContent = "🌸"; 
  }
  localStorage.setItem("yk_theme", t);
}
themeBtn.onclick = () => { theme = theme === "pink" ? "green" : "pink"; applyTheme(theme); };


// --- 2. Navigation Logic ---

function navigateTo(n){ 
  navBtns.forEach(x => {
    const isActive = x.dataset.tab === n;
    x.classList.toggle("active", isActive);
    x.setAttribute("aria-selected", isActive);
  }); 
  tabs.forEach(t => t.id === `tab-${n}` ? t.classList.add("active") : t.classList.remove("active")); 
}

navBtns.forEach(b => {
  b.onclick = () => navigateTo(b.dataset.tab);
});

toSchedule.onclick = () => navigateTo("schedule");
toChat.onclick = () => navigateTo("chat");


// --- 3. Moniversary Countdown ---

function updateDaysLeft(){
  const now = new Date();
  let target = new Date(now.getFullYear(), now.getMonth(), 5);
  // If the 5th has passed this month, target next month's 5th
  if(target <= now) target = new Date(now.getFullYear(), now.getMonth()+1, 5);
  const diff = Math.ceil((target - now) / (1000*60*60*24));
  
  if (diff === 1) daysLeftEl.textContent = "Almost there! 1 day left 💖";
  else if (diff > 0) daysLeftEl.textContent = `${diff} days left 💖`; 
  else daysLeftEl.textContent = "🎉 It's Moniversary Today!";
}
updateDaysLeft();
setInterval(updateDaysLeft, 60*60*1000); 


// --- 4. Calendar Logic ---

const calendarWrap = document.getElementById("calendarWrap");
let currentMonth = new Date();
renderCalendar();

function renderCalendar(){
  calendarWrap.innerHTML = "";
  const monthBox = document.createElement("div");
  monthBox.className = "month";
  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();
  const today = new Date();

  // Header/Day Labels (Implementation omitted for brevity, but same as previous version)
  // ...

  // Build the day rows (Implementation omitted for brevity, but same as previous version)
  // ...
  
  calendarWrap.appendChild(monthBox);

  // Fetch schedules and mark hearts (same as previous version)
  onValue(schedulesRef, snap=>{
    // ... logic to populate savedDates Set ...
    // ... logic to apply 'heart' class to days ...
  });
}


// --- 5. Schedule Logic ---

// Handler for form submission
scheduleForm.onsubmit = (e) => {
  e.preventDefault(); 
  
  const title = schTitle.value.trim();
  const details = schDetails.value.trim();
  const name = schName.value.trim();

  if (!title || !name) return alert("Please add a title and your name");
  
  let obj = null;
  const isDateMode = modeDate.classList.contains("active");

  if (isDateMode) {
    if (!schDate.value) return alert("Please pick a date.");
    obj = { type:"date", title, details, date:schDate.value, name, createdAt: Date.now() };
  } else {
    // Timer mode
    const hours = Number(schHours.value);
    const mins = Number(schMins.value);
    
    if (!Number.isFinite(hours) || !Number.isFinite(mins) || (hours === 0 && mins === 0)) {
        return alert("Set valid hours or minutes for timer");
    }
    
    const totalMs = (hours * 60 + mins) * 60 * 1000;
    const deadline = Date.now() + totalMs;
    obj = { type:"timer", title, details, deadline, name, createdAt: Date.now() };
  }
  
  if (obj) push(schedulesRef, obj);

  // clear inputs
  scheduleForm.reset();
  schName.value = name; // keep name filled for convenience
};


// Realtime render schedules with countdowns
onValue(schedulesRef, snap=>{
  // 1. CRITICAL: Clear all old intervals before re-rendering
  Object.values(countdownIntervals).forEach(clearInterval);
  for (const key in countdownIntervals) delete countdownIntervals[key];
  
  schedulesList.innerHTML = "";
  
  const items = [];
  snap.forEach(child=>{
    const p = child.val();
    p._key = child.key;
    items.push(p);
  });
  
  // Sort by createdAt descending
  items.sort((a,b)=> (b.createdAt||0)-(a.createdAt||0));
  
  // 2. Use DocumentFragment for faster DOM insertion
  const fragment = document.createDocumentFragment();

  for(const p of items){
    const el = document.createElement("li"); 
    el.className = "schedule-item";
    
    // ... (DOM construction) ...

    const right = document.createElement("div");
    right.style.textAlign = "right"; 
    const timeEl = document.createElement("div");
    timeEl.style.fontWeight="700";
    timeEl.style.marginBottom="4px";
    right.appendChild(timeEl);

    // ... (Delete button) ...

    el.appendChild(left);
    el.appendChild(right);
    fragment.appendChild(el);

    // Countdown updater function
    function updateCountdown(){
      let diffMs = 0;
      if(p.type === "date"){
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
        const days = Math.floor(hours / 24);
        const hoursRemaining = hours % 24;

        if (days > 0) timeEl.textContent = `${days}d ${hoursRemaining}h left`;
        else timeEl.textContent = `${hours}h ${mins}m left`;
        
        timeEl.style.color = ""; 
      }
    }
    updateCountdown();
    
    // 3. Attach and store the interval ID
    const intervalId = setInterval(updateCountdown, 60*1000); // Update every minute
    countdownIntervals[p._key] = intervalId;
  }
  
  schedulesList.appendChild(fragment);
  renderCalendar();
});


// --- 6. Chat Logic ---

// ... (chat send logic is the same) ...

onValue(chatRef, snap=>{
  chatWindow.innerHTML = "";
  
  // Use DocumentFragment for faster DOM insertion
  const fragment = document.createDocumentFragment();

  snap.forEach(child=>{
    const m = child.val();
    const row = document.createElement("li"); // Use li for semantic correctness
    // ... (DOM construction for bubble and avatar) ...
    
    fragment.appendChild(row);
  });
  
  chatWindow.appendChild(fragment);
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

// --- 7. Avatar Factory (Cute SVG) ---
// ... (Avatar logic is the same) ...

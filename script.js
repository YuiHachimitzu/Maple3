import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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
const scoresRef = ref(db, "scores");

// UI refs
const appRoot = document.getElementById("app");
const tabs = Array.from(document.querySelectorAll(".tab"));
const navBtns = Array.from(document.querySelectorAll(".navbtn"));
const themeBtn = document.getElementById("themeBtn");

const toSchedule = document.getElementById("toSchedule");
const toChat = document.getElementById("toChat");
const toGame = document.getElementById("toGame");

// Schedule elements
const schType = document.getElementById("sch-type");
const schDate = document.getElementById("sch-date");
const schTitle = document.getElementById("sch-title");
const schDetails = document.getElementById("sch-details");
const schName = document.getElementById("sch-name");
const schAdd = document.getElementById("sch-add");
const schPost = document.getElementById("sch-post");
const schedulesList = document.getElementById("schedulesList");

// Chat elements
const chatSender = document.getElementById("chatSender");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");
const chatWindow = document.getElementById("chatWindow");

// Game elements
const playerSelect = document.getElementById("playerSelect");
const startGameBtn = document.getElementById("startGame");
const canvas = document.getElementById("gameCanvas");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("bestScore");

let theme = localStorage.getItem("yk_theme") || "pink";
applyTheme(theme);

function applyTheme(t){
  if(t==="green"){ appRoot.classList.remove("pink"); appRoot.classList.add("green"); document.body.style.background = "linear-gradient(135deg,#e6fff0,#d8fbe4)"; }
  else { appRoot.classList.remove("green"); appRoot.classList.add("pink"); document.body.style.background = "linear-gradient(135deg,#ffeaf2,#ffd6e8)"; }
  localStorage.setItem("yk_theme", t);
}

// Theme toggle
themeBtn.onclick = () => {
  theme = theme === "pink" ? "green" : "pink";
  applyTheme(theme);
};

// bottom nav
navBtns.forEach(b=>{
  b.onclick = ()=>{
    navBtns.forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    const tabName = b.dataset.tab;
    tabs.forEach(t=> t.id === `tab-${tabName}` ? t.classList.add("active") : t.classList.remove("active"));
  };
});

// quick nav
toSchedule.onclick = ()=> navigateTo("schedule");
toChat.onclick = ()=> navigateTo("chat");
toGame.onclick = ()=> navigateTo("game");
function navigateTo(n){ navBtns.forEach(x=> x.classList.toggle("active", x.dataset.tab===n)); tabs.forEach(t=> t.id===`tab-${n}`? t.classList.add("active"): t.classList.remove("active")); }

// MONIVERSARY: every month on 5th
const daysLeftEl = document.getElementById("daysLeft");
function updateDaysLeft(){
  const now = new Date();
  const year = now.getFullYear();
  let target = new Date(year, now.getMonth(), 5);
  if(target <= now) { target = new Date(year, now.getMonth()+1, 5); }
  const diff = Math.ceil((target - now) / (1000*60*60*24));
  daysLeftEl.textContent = diff>0 ? `${diff} days left 💖` : "🎉 It's today!";
}
updateDaysLeft();
setInterval(updateDaysLeft, 1000*60*60);

// SCHEDULE: add / post / list / delete
schAdd.onclick = () => {
  if(!schTitle.value || !schDate.value || !schName.value) return alert("Please fill Title, Date and Name");
  const obj = { type: schType.value, title: schTitle.value, details: schDetails.value||"", date: schDate.value, name: schName.value, createdAt: Date.now() };
  push(schedulesRef, obj);
  schTitle.value = schDetails.value = schName.value = ""; schDate.value="";
};
schPost.onclick = ()=> alert("Posted 💌");

onValue(schedulesRef, snapshot=>{
  schedulesList.innerHTML = "";
  snapshot.forEach(child=>{
    const p = child.val();
    const key = child.key;
    const el = document.createElement("div");
    el.className = "schedule-item";
    const meta = `${p.type==="date" ? "💗 Date" : "📝 Assignment"} • ${p.date} • by ${p.name}`;
    el.innerHTML = `<div>
        <div style="font-weight:700">${escapeHtml(p.title)}</div>
        <div class="meta">${escapeHtml(p.details)}</div>
        <div class="meta">${meta}</div>
      </div>
      <div>
        <button class="delete-btn" data-key="${key}">❌</button>
      </div>`;
    schedulesList.appendChild(el);
  });
  document.querySelectorAll(".delete-btn").forEach(btn=> btn.onclick = ()=> remove(ref(db, "schedules/"+btn.dataset.key)));
});

// CHAT: send / render with sender color
chatSend.onclick = ()=>{
  const txt = chatInput.value.trim();
  const sender = chatSender.value || "Yui";
  if(!txt) return;
  push(chatRef, { text: txt, sender, ts: Date.now() });
  chatInput.value = "";
};

onValue(chatRef, snap=>{
  chatWindow.innerHTML = "";
  snap.forEach(child=>{
    const msg = child.val();
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${msg.sender.toLowerCase()}`;
    bubble.innerHTML = `<strong>${escapeHtml(msg.sender)}</strong>: ${escapeHtml(msg.text)}`;
    chatWindow.appendChild(bubble);
  });
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

// GAME: simplified Chrome-dino style with character choice
const ctx = canvas.getContext("2d");
let running = false;
let gameState = { playerY: 100, vy:0, gravity:0.6, jump:-10, score:0, obstacles:[], frame:0 };
let bestScoreLocal = 0;

startGameBtn.onclick = ()=> startGame();

onValue(scoresRef, snap=>{
  let best = 0;
  snap.forEach(s=> { const v = s.val(); if(v.score>best) best = v.score; });
  bestScoreLocal = best;
  bestEl.textContent = bestScoreLocal;
});

function startGame(){
  if(running) return;
  running = true;
  gameState = { playerY: 100, vy:0, gravity:0.6, jump:-10, score:0, obstacles:[], frame:0 };
  scoreEl.textContent = "0";
  const player = playerSelect.value;
  let loop = setInterval(()=>{
    updateGame();
    drawGame(player);
    if(!running){
      clearInterval(loop);
      const name = prompt("Game over! Enter your name to save score:", player) || player;
      push(scoresRef, { name, score: gameState.score, ts: Date.now(), player });
      running = false;
    }
  }, 30);
  canvas.onclick = ()=> {
    if(gameState.playerY >= 100) gameState.vy = gameState.jump;
  };
}

function updateGame(){
  gameState.frame++;
  gameState.vy += gameState.gravity;
  gameState.playerY += gameState.vy;
  if(gameState.playerY > 100) { gameState.playerY = 100; gameState.vy = 0; }
  if(gameState.frame % 60 === 0){
    gameState.obstacles.push({ x: 340, w: 18, h: 24 });
  }
  gameState.obstacles.forEach(o=> o.x -= 6);
  gameState.obstacles = gameState.obstacles.filter(o=> o.x + o.w > -10);
  // collision
  gameState.obstacles.forEach(o=>{
    const px = 40, py = gameState.playerY;
    if(px + 20 > o.x && px < o.x + o.w && py + 20 > 140 - o.h){
      running = false;
    }
  });
  gameState.score = Math.floor(gameState.frame / 6);
  scoreEl.textContent = gameState.score;
}

function drawGame(player){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // ground
  ctx.fillStyle = "#eed1df";
  ctx.fillRect(0, 120, canvas.width, 20);
  // player (simple chibi: circle head + body)
  if(player === "yui") ctx.fillStyle = "#ff9ecb"; else ctx.fillStyle = "#8ed1a6";
  ctx.beginPath();
  ctx.arc(40, gameState.playerY - 6, 10, 0, Math.PI*2);
  ctx.fill();
  ctx.fillRect(33, gameState.playerY+4, 14, 18);
  // obstacles
  ctx.fillStyle = "#7a2340";
  gameState.obstacles.forEach(o=>{
    ctx.fillRect(o.x, 140 - o.h, o.w, o.h);
  });
}

// escaping helper
function escapeHtml(s){ return (s||"").toString().replace(/[&<>"']/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

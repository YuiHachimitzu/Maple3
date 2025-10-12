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

// UI refs and helpers
const appRoot = document.getElementById("app");
const tabs = Array.from(document.querySelectorAll(".tab"));
const navBtns = Array.from(document.querySelectorAll(".navbtn"));
const themeBtn = document.getElementById("themeBtn");
const toSchedule = document.getElementById("toSchedule");
const toChat = document.getElementById("toChat");
const toGame = document.getElementById("toGame");

// schedule elements
const schType = document.getElementById("sch-type");
const schDate = document.getElementById("sch-date");
const schTitle = document.getElementById("sch-title");
const schDetails = document.getElementById("sch-details");
const schName = document.getElementById("sch-name");
const schAdd = document.getElementById("sch-add");
const schPost = document.getElementById("sch-post");
const schedulesList = document.getElementById("schedulesList");

// chat elements
const chatSender = document.getElementById("chatSender");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");
const chatWindow = document.getElementById("chatWindow");

// game elements
const playerSelect = document.getElementById("playerSelect");
const startGameBtn = document.getElementById("startGame");
const canvas = document.getElementById("gameCanvas");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("bestScore");

// theme
let theme = localStorage.getItem("yk_theme") || "pink";
applyTheme(theme);
themeBtn.onclick = () => { theme = theme === "pink" ? "green" : "pink"; applyTheme(theme); };

function applyTheme(t){
  if(t==="green"){ appRoot.classList.add("green"); document.body.style.background = "linear-gradient(135deg,#e6fff0,#d8fbe4)"; }
  else { appRoot.classList.remove("green"); document.body.style.background = "linear-gradient(135deg,#ffeaf2,#ffd6e8)"; }
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
toGame.onclick = ()=> navigateTo("game");

// moniversary (5th)
const daysLeftEl = document.getElementById("daysLeft");
function updateDaysLeft(){
  const now = new Date();
  let target = new Date(now.getFullYear(), now.getMonth(), 5);
  if(target <= now) target = new Date(now.getFullYear(), now.getMonth()+1, 5);
  const diff = Math.ceil((target - now) / (1000*60*60*24));
  daysLeftEl.textContent = diff>0 ? `${diff} days left 💖` : "🎉 It's today!";
}
updateDaysLeft();
setInterval(updateDaysLeft, 60*60*1000);

// SCHEDULE: push/list/delete
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
  // attach delete handlers
  document.querySelectorAll(".delete-btn").forEach(btn=>{
    btn.onclick = ()=> {
      const k = btn.dataset.key;
      if(!confirm("Delete this post?")) return;
      remove(ref(db, "schedules/"+k));
    };
  });
});

// CHAT: send & render with sender color
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
    const cls = (msg.sender || "Yui").toLowerCase() === "koi" ? "koi" : "yui";
    bubble.className = `chat-bubble ${cls}`;
    bubble.innerHTML = `<strong>${escapeHtml(msg.sender)}</strong>: ${escapeHtml(msg.text)}`;
    chatWindow.appendChild(bubble);
  });
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

// GAME: improved scoring and random spawn
const ctx = canvas.getContext("2d");
let running = false;
let gameState = null;
let bestLocal = Number(localStorage.getItem("yk_best")) || 0;
bestEl.textContent = bestLocal;

startGameBtn.onclick = ()=> startGame();

onValue(scoresRef, snap=>{
  // update displayed best from DB
  let best = bestLocal;
  snap.forEach(child => { const v = child.val(); if(v.score > best) best = v.score; });
  bestEl.textContent = best;
});

function startGame(){
  if(running) return;
  running = true;
  gameState = { y: 100, vy:0, gravity:0.7, jump:-11, score:0, obstacles:[], frame:0, spawnTimer:0, spawnInterval: Math.floor(80 + Math.random()*120) };
  scoreEl.textContent = "0";
  const player = playerSelect.value;
  canvas.focus();
  let lastTime = performance.now();
  function loop(t){
    if(!running) return endGame();
    const dt = t - lastTime; lastTime = t;
    updateGame(dt);
    drawGame(player);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  canvas.onclick = ()=> { if(gameState.y >= 100) gameState.vy = gameState.jump; };
  document.addEventListener("keydown", keyJump);
}

function keyJump(e){
  if(e.code === "Space" || e.code === "ArrowUp") {
    if(gameState && gameState.y >= 100) gameState.vy = gameState.jump;
  }
}

function updateGame(dt){
  gameState.frame++;
  gameState.spawnTimer++;
  gameState.vy += gameState.gravity;
  gameState.y += gameState.vy;
  if(gameState.y > 100){ gameState.y = 100; gameState.vy = 0; }

  // random spawn: occasional clusters or single cactus
  if(gameState.spawnTimer >= gameState.spawnInterval){
    // reset spawn timer and randomize next interval
    gameState.spawnTimer = 0;
    gameState.spawnInterval = Math.floor(50 + Math.random()*140);
    // spawn 1-2 obstacles: possibly create a small cluster
    const count = Math.random() < 0.25 ? 2 : 1;
    for(let i=0;i<count;i++){
      const offset = i * (30 + Math.random()*20);
      gameState.obstacles.push({ x: canvas.width + offset, w: 18, h: 18 + Math.floor(Math.random()*30) });
    }
  }

  // move obstacles and check collisions
  for(let o of gameState.obstacles) o.x -= 6 + Math.min(6, Math.floor(gameState.score/50));
  // remove off-screen
  gameState.obstacles = gameState.obstacles.filter(o => o.x + o.w > -20);

  // collision detection
  for(let o of gameState.obstacles){
    const px = 40, py = gameState.y;
    if(px + 18 > o.x && px < o.x + o.w && py + 18 > 140 - o.h){
      running = false;
    }
  }

  // scoring: +1 per frame window / 6, bonus for near-miss
  gameState.score = Math.floor(gameState.frame / 6);
  scoreEl.textContent = gameState.score;
}

function drawGame(player){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // scale to canvas size
  const W = canvas.width, H = canvas.height;
  // ground
  ctx.fillStyle = "#eed1df"; ctx.fillRect(0, 120, W, 20);
  // player (simple chibi)
  ctx.fillStyle = player === "yui" ? "#ff9ecb" : "#8ed1a6";
  ctx.beginPath(); ctx.arc(40, gameState.y - 6, 10, 0, Math.PI*2); ctx.fill();
  ctx.fillRect(33, gameState.y+4, 14, 18);
  // obstacles
  ctx.fillStyle = "#7a2340";
  for(let o of gameState.obstacles){
    ctx.fillRect(o.x, 140 - o.h, o.w, o.h);
  }
}

function endGame(){
  // cleanup
  document.removeEventListener("keydown", keyJump);
  const finalScore = gameState.score;
  scoreEl.textContent = finalScore;
  running = false;
  // save locally and to firebase
  if(finalScore > bestLocal){ bestLocal = finalScore; localStorage.setItem("yk_best", bestLocal); bestEl.textContent = bestLocal; }
  push(scoresRef, { name: playerSelect.value, score: finalScore, ts: Date.now() });
  alert(`Game over! Score: ${finalScore} 💗`);
}

// helper
function escapeHtml(s){ return (s||"").toString().replace(/[&<>"']/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
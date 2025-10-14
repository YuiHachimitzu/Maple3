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

const picker = document.getElementById("picker");
const pickY = document.getElementById("pick-yui");
const pickK = document.getElementById("pick-koi");
const userBadge = document.getElementById("userBadge");
let currentUser = localStorage.getItem("yk_user") || null;

function setUser(u){
  currentUser = u;
  localStorage.setItem("yk_user", u);
  userBadge.innerHTML = u === "Koi" ? `<span class="tag koi">Koi 💚</span>` : `<span class="tag yui">Yui 💗</span>`;
  applyTheme(localStorage.getItem("yk_theme") || "pink");
  picker.classList.add("hidden");
}

if(!currentUser) picker.classList.remove("hidden"); else setUser(currentUser);
pickY.onclick = ()=> setUser("Yui");
pickK.onclick = ()=> setUser("Koi");

const tabBtns = Array.from(document.querySelectorAll(".tabbtn"));
const panels = { schedule: document.getElementById("schedule"), chat: document.getElementById("chat"), theme: document.getElementById("theme")};
tabBtns.forEach(b=>{
  b.addEventListener("click", ()=>{
    tabBtns.forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    const t = b.dataset.tab;
    Object.values(panels).forEach(p=>p.classList.remove("active"));
    panels[t].classList.add("active");
  });
});

const modeDate = document.getElementById("modeDate");
const modeTimer = document.getElementById("modeTimer");
const dateInputs = document.getElementById("dateInputs");
const timerInputs = document.getElementById("timerInputs");
modeDate.onclick = ()=>{ modeDate.classList.add("active"); modeTimer.classList.remove("active"); dateInputs.classList.remove("hidden"); timerInputs.classList.add("hidden"); };
modeTimer.onclick = ()=>{ modeTimer.classList.add("active"); modeDate.classList.remove("active"); timerInputs.classList.remove("hidden"); dateInputs.classList.add("hidden"); };

const evTitle = document.getElementById("ev-title");
const evDetails = document.getElementById("ev-details");
const evDate = document.getElementById("ev-date");
const evTime = document.getElementById("ev-time");
const evHours = document.getElementById("ev-hours");
const evMins = document.getElementById("ev-mins");
const evName = document.getElementById("ev-name");
const evAdd = document.getElementById("ev-add");
const evPost = document.getElementById("ev-post");
const eventsList = document.getElementById("eventsList");
const calendarWrap = document.getElementById("calendarWrap");

const chatWindow = document.getElementById("chatWindow");
const chatSender = document.getElementById("chatSender");
const chatText = document.getElementById("chatText");
const chatSend = document.getElementById("chatSend");

const themePink = document.getElementById("themePink");
const themeGreen = document.getElementById("themeGreen");

function applyTheme(t){
  if(t==="green"){ document.documentElement.classList.add("app-green"); document.body.style.background = "linear-gradient(135deg,#f1fff7,#e6fff0)"; themeGreen.classList.add("active"); themePink.classList.remove("active"); localStorage.setItem("yk_theme","green"); }
  else{ document.documentElement.classList.remove("app-green"); document.body.style.background = "linear-gradient(135deg,#fff1f6,#ffe7ef)"; themePink.classList.add("active"); themeGreen.classList.remove("active"); localStorage.setItem("yk_theme","pink"); }
}
themePink.onclick = ()=> applyTheme("pink");
themeGreen.onclick = ()=> applyTheme("green");
applyTheme(localStorage.getItem("yk_theme") || "pink");

function buildCalendar(){
  calendarWrap.innerHTML = "";
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const box = document.createElement("div");
  box.className = "month";
  const header = document.createElement("div");
  header.className = "row";
  const title = document.createElement("div");
  title.textContent = now.toLocaleString(undefined,{month:"long", year:"numeric"});
  title.style.fontWeight="700";
  header.appendChild(title);
  box.appendChild(header);
  const labels = document.createElement("div");
  labels.className="row";
  ["S","M","T","W","T","F","S"].forEach(d=> { const el=document.createElement("div"); el.className="day"; el.style.fontWeight="600"; el.textContent=d; labels.appendChild(el); });
  box.appendChild(labels);
  const first = new Date(year,month,1);
  const start = first.getDay();
  const days = new Date(year,month+1,0).getDate();
  const cells=[];
  for(let i=0;i<start;i++) cells.push(null);
  for(let d=1; d<=days; d++) cells.push(new Date(year,month,d));
  const rows = Math.ceil(cells.length/7);
  for(let r=0;r<rows;r++){
    const row = document.createElement("div"); row.className="row";
    for(let c=0;c<7;c++){
      const idx=r*7+c; const cell=document.createElement("div"); cell.className="day";
      if(!cells[idx]) { cell.classList.add("other"); cell.innerHTML="&nbsp;"; }
      else {
        const d = cells[idx];
        const num=document.createElement("span"); num.className="num"; num.textContent=d.getDate();
        cell.appendChild(num);
        cell.addEventListener("click", ()=> {
          const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,"0"); const dd=String(d.getDate()).padStart(2,"0");
          evDate.value = `${y}-${m}-${dd}`;
          modeDate.click();
        });
      }
      row.appendChild(cell);
    }
    box.appendChild(row);
  }
  calendarWrap.appendChild(box);
  onValue(schedulesRef, snap=>{
    const saved=new Set();
    snap.forEach(ch=>{
      const v=ch.val();
      if(v.type==="date" && v.date) saved.add(v.date);
      if(v.type==="timer" && v.deadline){ const d=new Date(v.deadline); const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,"0"); const dd=String(d.getDate()).padStart(2,"0"); saved.add(`${y}-${m}-${dd}`); }
    });
    box.querySelectorAll(".day").forEach(cell=>{
      const num = cell.querySelector(".num");
      if(!num) return;
      const day = Number(num.textContent);
      const y = now.getFullYear(); const m = String(now.getMonth()+1).padStart(2,"0"); const dd=String(day).padStart(2,"0");
      const key = `${y}-${m}-${dd}`;
      if(saved.has(key)) cell.classList.add("heart"); else cell.classList.remove("heart");
    });
  });
}
buildCalendar();

evAdd.onclick = ()=>{
  const title = evTitle.value.trim();
  const details = evDetails.value.trim();
  const name = (evName.value.trim() || currentUser || "Yui");
  if(!title) return alert("Please add a title");
  if(modeDate.classList.contains("active")){
    if(!evDate.value) return alert("Pick a date");
    const obj = { type:"date", title, details, date:evDate.value, time:evTime.value||"", name, createdAt: Date.now() };
    push(schedulesRef, obj);
  } else {
    const h = Number(evHours.value)||0;
    const m = Number(evMins.value)||0;
    const ms = (h*60 + m) * 60 * 1000;
    if(ms <= 0) return alert("Set hours/minutes");
    const deadline = Date.now() + ms;
    const obj = { type:"timer", title, details, deadline, name, createdAt: Date.now() };
    push(schedulesRef, obj);
  }
  evTitle.value=""; evDetails.value=""; evDate.value=""; evTime.value=""; evHours.value=""; evMins.value=""; evName.value="";
};

onValue(schedulesRef, snap=>{
  eventsList.innerHTML="";
  const arr=[];
  snap.forEach(ch=>{ const v=ch.val(); v._key = ch.key; arr.push(v); });
  arr.sort((a,b)=> (a.createdAt||0)-(b.createdAt||0));
  arr.forEach(p=>{
    const el=document.createElement("div"); el.className="schedule-item";
    const left=document.createElement("div");
    const t=document.createElement("div"); t.style.fontWeight="700"; t.textContent=p.title;
    const d=document.createElement("div"); d.className="meta"; d.textContent=p.details || "";
    const meta=document.createElement("div"); meta.className="meta";
    if(p.type==="date") meta.textContent = `📅 ${p.date} ${p.time? "• "+p.time:""} • by ${p.name}`;
    else meta.textContent = `⏳ timer • by ${p.name}`;
    left.appendChild(t); left.appendChild(d); left.appendChild(meta);
    const right=document.createElement("div");
    const timeEl=document.createElement("div"); timeEl.style.fontWeight="700"; timeEl.style.marginBottom="6px";
    right.appendChild(timeEl);
    const del=document.createElement("button"); del.className="delete"; del.textContent="❌";
    del.onclick = ()=> { if(!confirm("Delete?")) return; remove(ref(db,"schedules/"+p._key)); };
    right.appendChild(del);
    el.appendChild(left); el.appendChild(right);
    eventsList.appendChild(el);

    function update(){
      let diff = 0;
      if(p.type==="date"){
        const dt = new Date((p.date || "") + "T" + (p.time || "23:59:59"));
        diff = dt - Date.now();
      } else {
        diff = (p.deadline || 0) - Date.now();
      }
      if(diff <= 0){ timeEl.textContent = "⏰ Time's up!"; timeEl.style.color="#c23a5b"; }
      else {
        const mins = Math.floor(diff/60000);
        const hrs = Math.floor(mins/60);
        const m = mins % 60;
        timeEl.textContent = `${hrs}h ${m}m left`;
        timeEl.style.color="";
      }
    }
    update();
    p._interval = setInterval(update, 60*1000);
  });
  buildCalendar();
});

chatSend.onclick = ()=>{
  const text = chatText.value.trim();
  const sender = chatSender.value || currentUser || "Yui";
  if(!text) return;
  push(chatRef, { text, sender, ts: Date.now() });
  chatText.value="";
};

onValue(chatRef, snap=>{
  chatWindow.innerHTML="";
  snap.forEach(ch=>{
    const m = ch.val();
    const cls = (m.sender||"Yui").toLowerCase() === "koi" ? "koi" : "yui";
    const row = document.createElement("div"); row.className="chat-row";
    const bubble = document.createElement("div"); bubble.className = `chat-bubble ${cls}`;
    const meta = document.createElement("div"); meta.className="meta"; const time = new Date(m.ts||Date.now()); const ts = time.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    meta.innerHTML = `<strong>${escapeHtml(m.sender)}</strong> • <small>${ts}</small>`;
    const txt = document.createElement("div"); txt.textContent = m.text;
    bubble.appendChild(meta); bubble.appendChild(txt);

    if(cls==="yui"){
      const a = makeAvatar("yui"); a.style.marginRight="8px"; row.appendChild(a); row.appendChild(bubble);
    } else {
      row.appendChild(bubble); const a = makeAvatar("koi"); a.style.marginLeft="8px"; row.appendChild(a);
      row.style.justifyContent="flex-end";
    }
    chatWindow.appendChild(row);
  });
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

function makeAvatar(which){
  const wrap=document.createElement("div"); wrap.style.width="44px"; wrap.style.height="44px"; wrap.style.flex="0 0 44px";
  const img=document.createElement("img"); img.style.width="44px"; img.style.height="44px"; img.style.borderRadius="8px";
  if(which==="yui"){
    img.src='data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44'><rect rx='8' width='44' height='44' fill='#ffdfe8'/><circle cx='22' cy='14' r='9' fill='#fff4f6'/><rect x='11' y='24' width='22' height='12' rx='3' fill='#ffd6e8'/></svg>`);
  } else {
    img.src='data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44'><rect rx='8' width='44' height='44' fill='#dff7ea'/><circle cx='22' cy='14' r='9' fill='#f6fffb'/><rect x='11' y='24' width='22' height='12' rx='3' fill='#d8fbe4'/></svg>`);
  }
  wrap.appendChild(img); return wrap;
}

function escapeHtml(s){return(s||"").toString().replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

function start(){
  const tabs=document.querySelectorAll(".tab")
  const contents=document.querySelectorAll(".tab-content")
  const userBadge=document.getElementById("userBadge")
  const chatList=document.getElementById("chatList")
  const msgInput=document.getElementById("msgInput")
  const sendBtn=document.getElementById("sendBtn")
  const scheduleList=document.getElementById("scheduleList")
  const scheduleBtn=document.getElementById("scheduleBtn")
  const themeToggle=document.getElementById("themeToggle")

  let currentUser=localStorage.getItem("user")||"Koi"
  let theme=localStorage.getItem("theme")||"pink"
  userBadge.textContent=currentUser
  document.body.setAttribute("data-theme",theme)

  const firebaseConfig={
    apiKey:"YOUR_KEY",
    authDomain:"YOUR_DOMAIN",
    databaseURL:"YOUR_DB",
    projectId:"YOUR_ID",
    storageBucket:"YOUR_BUCKET",
    messagingSenderId:"YOUR_SENDER",
    appId:"YOUR_APP"
  }
  firebase.initializeApp(firebaseConfig)
  const db=firebase.database()
  const chatRef=db.ref("cuteChat")
  const schedulesRef=db.ref("cuteSchedules")

  function glow(el,color){
    el.animate([{boxShadow:`0 0 0 ${color}`},{boxShadow:`0 0 15px ${color}`},{boxShadow:`0 0 0 ${color}`}],{duration:2000,iterations:Infinity})
  }

  tabs.forEach(tab=>{
    tab.onclick=()=>{
      tabs.forEach(t=>t.classList.remove("active"))
      contents.forEach(c=>c.classList.remove("active"))
      tab.classList.add("active")
      document.getElementById(tab.dataset.target).classList.add("active")
    }
  })

  function notifyCute(msg){
    const box=document.createElement("div")
    box.className="cute-toast"
    box.textContent=msg
    document.body.appendChild(box)
    setTimeout(()=>box.classList.add("show"),10)
    setTimeout(()=>box.classList.remove("show"),2500)
    setTimeout(()=>box.remove(),3000)
  }

  sendBtn.onclick=()=>{
    const text=msgInput.value.trim()
    if(!text)return
    const msg={user:currentUser,text:escapeHtml(text),time:new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
    chatRef.push(msg)
    msgInput.value=""
  }

  chatRef.on("child_added",snap=>{
    const {user,text,time}=snap.val()
    const li=document.createElement("li")
    li.className=user===currentUser?"me":"them"
    li.innerHTML=`<div class="pfp ${user==="Koi"?"green":"pink"}"></div>
                  <div class="bubble">
                    <span class="name">${user}</span>
                    <p>${text}</p>
                    <span class="time">${time}</span>
                  </div>`
    chatList.appendChild(li)
    chatList.scrollTop=chatList.scrollHeight
  })

  scheduleBtn.onclick=()=>{
    const title=prompt("Task title?")
    if(!title)return
    const h=parseInt(prompt("Hours until deadline?"),10)
    const m=parseInt(prompt("Minutes until deadline?"),10)
    if(isNaN(h)&&isNaN(m))return
    const deadline=new Date(Date.now()+(h*3600000)+(m*60000))
    const data={title,deadline:deadline.toISOString(),user:currentUser}
    schedulesRef.push(data)
  }

  schedulesRef.on("value",snap=>{
    scheduleList.innerHTML=""
    const now=new Date()
    snap.forEach(child=>{
      const {title,deadline,user}=child.val()
      const d=new Date(deadline)
      const remain=Math.max(0,Math.floor((d-now)/60000))
      const hours=Math.floor(remain/60)
      const mins=remain%60
      const li=document.createElement("li")
      li.className="schedule-item"
      li.innerHTML=`<div class="title">${escapeHtml(title)}</div>
                    <div class="meta">${user} • ${hours}h ${mins}m left</div>`
      scheduleList.appendChild(li)
    })
  })

  themeToggle.onclick=()=>{
    theme=theme==="pink"?"green":"pink"
    document.body.setAttribute("data-theme",theme)
    localStorage.setItem("theme",theme)
  }

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>e.isIntersecting&&e.target.classList.add("visible"))
  },{threshold:0.1})
  const observeSchedules=()=>document.querySelectorAll(".schedule-item").forEach(el=>observer.observe(el))

  schedulesRef.on("value",()=>{observeSchedules();notifyCute("🌸 schedule updated")})
  chatRef.on("value",()=>notifyCute("💌 new message"))
  setTimeout(()=>glow(userBadge,currentUser==="Koi"?"#a5f0b4":"#ffb8d2"),1200)
}
Lfunction escapeHtml(s){ 
  return (s||"").toString().replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); 
}

document.addEventListener("DOMContentLoaded",()=>{

  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");
  const chatBox = document.getElementById("chat-box");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const scheduleForm = document.getElementById("schedule-form");
  const scheduleList = document.getElementById("schedule-list");
  const calendar = document.getElementById("calendar");
  const themeBtn = document.getElementById("theme-btn");
  const userSelect = document.getElementById("user-select");

  let theme = localStorage.getItem("theme") || "pink";
  let messages = JSON.parse(localStorage.getItem("messages") || "[]");
  let schedules = JSON.parse(localStorage.getItem("schedules") || "[]");

  function setTheme(newTheme){
    theme = newTheme;
    document.body.className = theme;
    localStorage.setItem("theme",theme);
  }

  themeBtn.onclick=()=>{
    setTheme(theme==="pink"?"green":"pink");
  };

  setTheme(theme);

  tabs.forEach(t=>{
    t.onclick=()=>{
      tabs.forEach(tab=>tab.classList.remove("active"));
      t.classList.add("active");
      const id=t.getAttribute("data-tab");
      tabContents.forEach(c=>c.classList.remove("active"));
      document.getElementById(id).classList.add("active");
      if(id==="chat") scrollChatToBottom();
    };
  });

  function scrollChatToBottom(){
    setTimeout(()=>{ chatBox.scrollTop = chatBox.scrollHeight; },100);
  }

  function renderMessages(){
    chatBox.innerHTML = "";
    messages.forEach(msg=>{
      const div = document.createElement("div");
      div.className="message "+(msg.user.toLowerCase());
      div.innerHTML=`<div class="msg-header">${msg.user} <span>${msg.time}</span></div>
                     <div class="msg-text">${escapeHtml(msg.text)}</div>`;
      chatBox.appendChild(div);
    });
    scrollChatToBottom();
  }

  sendBtn.onclick=()=>{
    const text = chatInput.value.trim();
    const user = userSelect.value;
    if(!text) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
    const msg = {user, text, time};
    messages.push(msg);
    localStorage.setItem("messages",JSON.stringify(messages));
    chatInput.value="";
    renderMessages();
  };

  function renderSchedules(){
    scheduleList.innerHTML = "";
    schedules.forEach((s,i)=>{
      const li = document.createElement("li");
      li.textContent = `${s.date}: ${s.title}`;
      scheduleList.appendChild(li);
    });
    renderCalendar();
  }

  function renderCalendar(){
    calendar.innerHTML="";
    const days = Array.from({length:30},(_,i)=>i+1);
    days.forEach(day=>{
      const dateStr = `2025-10-${day.toString().padStart(2,"0")}`;
      const cell = document.createElement("div");
      cell.className="day";
      cell.textContent=day;
      const found = schedules.find(s=>s.date===dateStr);
      if(found) cell.classList.add("has-schedule");
      cell.onclick=()=>{
        const info = schedules.filter(s=>s.date===dateStr);
        if(info.length){
          alert(`Schedules on ${dateStr}:\n\n${info.map(i=>`${i.title} - ${i.time}`).join("\n")}`);
        } else {
          alert("No schedule on this day.");
        }
      };
      calendar.appendChild(cell);
    });
  }

  scheduleForm.onsubmit=(e)=>{
    e.preventDefault();
    const title = document.getElementById("schedule-title").value.trim();
    const date = document.getElementById("schedule-date").value;
    const time = document.getElementById("schedule-time").value;
    if(!title||!date) return alert("Please fill all fields.");
    schedules.push({title,date,time});
    localStorage.setItem("schedules",JSON.stringify(schedules));
    scheduleForm.reset();
    renderSchedules();
  };

  renderMessages();
  renderSchedules();
});
const startGame = document.getElementById("startGame");
const gameArea = document.getElementById("gameArea");

startGame.onclick = () => {
  gameArea.innerHTML = "";
  let score = 0;
  let clicks = 0;

  const makeBubble = () => {
    const btn = document.createElement("button");
    btn.style.left = Math.random() * 300 + "px";
    btn.style.top = Math.random() * 200 + "px";
    btn.textContent = "💖";
    gameArea.appendChild(btn);

    btn.onclick = () => {
      score++;
      btn.remove();
    };

    setTimeout(() => btn.remove(), 1200);
  };

  const gameInterval = setInterval(() => {
    makeBubble();
    clicks++;
    if (clicks >= 15) {
      clearInterval(gameInterval);
      alert(`Game over! Score: ${score} 💗`);
    }
  }, 800);
};

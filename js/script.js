document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const downloadLink = 'your-mediafire-download-link-here';
    const countdownSeconds = 5;

    // --- ELEMENT SELECTORS ---
    const container = document.querySelector('.container');
    const hudCard = document.querySelector('.hud-card');
    const statusTextEl = document.getElementById('status-text');
    const downloadBtn = document.getElementById('downloadBtn');
    const btnIcon = document.getElementById('btn-icon');
    const btnText = document.getElementById('btn-text');

    // --- 3D MOUSE TILT EFFECT ---
    container.addEventListener('mousemove', (e) => {
        let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        hudCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    container.addEventListener('mouseleave', () => {
        hudCard.style.transform = 'rotateY(0deg) rotateX(0deg)';
        hudCard.style.transition = 'transform 0.5s ease';
    });
    
    container.addEventListener('mouseenter', () => {
        hudCard.style.transition = 'transform 0.1s ease-out';
    });


    // --- ADVANCED TYPING & COUNTDOWN LOGIC ---
    const typeMessage = (element, message, delay = 50) => {
        return new Promise(resolve => {
            let i = 0;
            element.innerHTML = "> ";
            const interval = setInterval(() => {
                if (i < message.length) {
                    element.innerHTML += message.charAt(i);
                    i++;
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, delay);
        });
    };

    const runSystemCheck = async () => {
        await new Promise(r => setTimeout(r, 500));
        await typeMessage(statusTextEl, 'Verifying defense parameters...');
        await new Promise(r => setTimeout(r, 800));
        await typeMessage(statusTextEl, 'Compiling skill modules...');
        await new Promise(r => setTimeout(r, 1000));
        await typeMessage(statusTextEl, 'Connection secured. Ready for download.');
        await new Promise(r => setTimeout(r, 500));

        // Start countdown
        let countdown = countdownSeconds;
        btnIcon.className = 'fa-solid fa-sync fa-spin';
        
        const countdownInterval = setInterval(async () => {
            if (countdown > 0) {
                await typeMessage(statusTextEl, `Initializing in T-${countdown}...`);
                btnText.textContent = `Initializing...`;
                countdown--;
            } else {
                clearInterval(countdownInterval);
                statusTextEl.innerHTML = "> Download integrity verified. Proceed.";
                downloadBtn.classList.remove('disabled');
                downloadBtn.href = downloadLink; // Set the link only when active
                btnIcon.className = 'fa-solid fa-download';
                btnText.textContent = 'Execute Download';
            }
        }, 1200);
    };

    runSystemCheck();
});

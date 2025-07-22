document.addEventListener('DOMContentLoaded', () => {
    // --- ‼️ IMPORTANT ‼️ ---
    // --- PASTE YOUR MEDIAFIRE DOWNLOAD LINK HERE ---
    const mediafireDownloadLink = 'YOUR_MEDIAFIRE_LINK_HERE';


    // --- ELEMENT SELECTORS ---
    const container = document.querySelector('.container');
    const hudCard = document.querySelector('.hud-card');
    const downloadBtn = document.getElementById('downloadBtn');
    const btnIcon = document.getElementById('btn-icon');
    const btnText = document.getElementById('btn-text');

    // --- 3D MOUSE TILT EFFECT ---
    container.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return; // Disable effect on mobile
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


    // --- DOWNLOAD BUTTON LOGIC ---
    const activateDownload = () => {
        btnIcon.className = 'fa-solid fa-sync fa-spin';
        btnText.textContent = 'Preparing Link...';

        setTimeout(() => {
            downloadBtn.classList.remove('disabled');
            downloadBtn.href = mediafireDownloadLink; // Set the actual download link
            
            btnIcon.className = 'fa-solid fa-download';
            btnText.textContent = 'Download Maple3';

            // Add a click listener to provide feedback
            downloadBtn.addEventListener('click', () => {
                btnIcon.className = 'fa-solid fa-check';
                btnText.textContent = 'Download Started!';
                
                // Prevent multiple clicks and reset state after a delay
                downloadBtn.classList.add('disabled');
                setTimeout(() => {
                     downloadBtn.classList.remove('disabled');
                     btnIcon.className = 'fa-solid fa-download';
                     btnText.textContent = 'Download Maple3';
                }, 5000); // Reset after 5 seconds
            });

        }, 2000); // Wait 2 seconds before making the link active
    };

    // Start the activation sequence
    activateDownload();
});

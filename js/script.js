document.addEventListener('DOMContentLoaded', () => {
    // === File Data (just add new objects here) ===
    const scripts = [
        {
            name: "SpeedHack.lua",
            description: "Boosts movement speed dramatically.",
            version: "2.0",
            size: "8 KB",
            type: "lua",
            link: "https://example.com/speedhack.lua",
            date: "2025-08-10"
        },
        {
            name: "Aimbot.lua",
            description: "Automatically aims at targets.",
            version: "1.4",
            size: "12 KB",
            type: "lua",
            link: "https://example.com/aimbot.lua",
            date: "2025-08-12"
        }
    ];

    // Sort by newest date
    scripts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Generate file cards
    const fileList = document.getElementById('file-list');
    if (fileList) {
        fileList.innerHTML = scripts.map(file => `
            <div class="file-card visible">
                <div class="card-header">
                    <h3>${file.name}</h3>
                    <span class="badge badge-${file.type}">${file.type.toUpperCase()}</span>
                </div>
                <p class="file-description">${file.description}</p>
                <div class="file-meta">
                    <span><i class="fa-solid fa-code-branch"></i> v${file.version}</span>
                    <span><i class="fa-solid fa-database"></i> ${file.size}</span>
                </div>
                <div class="button-group">
                    <a href="${file.link}" target="_blank" class="download-btn">
                        <i class="fa-solid fa-download"></i> Download
                    </a>
                    <button class="copy-btn">
                        <i class="fa-solid fa-copy"></i> Copy Link
                    </button>
                </div>
            </div>
        `).join('');
    }

    // === Sticky Header ===
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // === Live Search ===
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        const fileCards = document.getElementsByClassName('file-card');
        const noResults = document.getElementById('no-results');

        searchInput.addEventListener('keyup', () => {
            const filter = searchInput.value.toLowerCase();
            let filesFound = false;

            for (let card of fileCards) {
                const textContent = card.textContent || card.innerText;
                if (textContent.toLowerCase().includes(filter)) {
                    card.style.display = "";
                    filesFound = true;
                } else {
                    card.style.display = "none";
                }
            }
            noResults.style.display = filesFound ? "none" : "block";
        });
    }

    // === Copy Link Button ===
    if (fileList) {
        fileList.addEventListener('click', (e) => {
            const copyBtn = e.target.closest('.copy-btn');
            if (copyBtn) {
                const downloadBtn = copyBtn.previousElementSibling;
                const linkToCopy = downloadBtn.href;

                navigator.clipboard.writeText(linkToCopy).then(() => {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            }
        });
    }

    // === Mobile Menu Toggle ===
    const menuBtn = document.getElementById('menu-btn');
    const nav = document.getElementById('main-nav');
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('is-open');
        });
        nav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') nav.classList.remove('is-open');
        });
    }

    // === Live Time in Footer ===
    const timeSpan = document.getElementById('current-time');
    if (timeSpan) {
        const updateTime = () => {
            const options = {
                timeZone: 'Asia/Manila',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            timeSpan.textContent = new Intl.DateTimeFormat('en-US', options).format(new Date());
        };
        updateTime();
        setInterval(updateTime, 1000);
    }
});
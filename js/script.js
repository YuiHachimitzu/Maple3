document.addEventListener('DOMContentLoaded', () => {
    // --- Script Data Array ---
    const scripts = [
        {
            name: "Maple3.lua",
            description: "Cul Ui // Mod menu",
            version: "1.0",
            size: "12 KB",
            link: "https://www.mediafire.com/file/d97botb0qb8oi8f/a.lua/file"
        },
        {
            name: "panel_template.lua",
            description: "Reusable GUI Panel Template",
            version: "1.1",
            size: "12 KB",
            link: "https://www.mediafire.com/file/bqgpmn6p4en06wk/Guesten_punel.lua/file"
        },
        {
            name: "aimbut.lua",
            description: "Mystery script functionality",
            version: "1.0",
            size: "5 KB",
            link: "https://www.mediafire.com/file/rtrcg2jovnzrkqt/aimbot.lua/file"
        },
        {
            name: "speedhack.lua",
            description: "Boost movement speed in-game",
            version: "2.0",
            size: "8 KB",
            link: "https://www.mediafire.com/file/example/speedhack.lua/file"
        },
        {
            name: "flymod.lua",
            description: "Allows the player to fly freely",
            version: "1.3",
            size: "10 KB",
            link: "https://www.mediafire.com/file/example/flymod.lua/file"
        },
        {
            name: "wallhack.lua",
            description: "See through walls for tactical advantage",
            version: "1.4",
            size: "7 KB",
            link: "https://www.mediafire.com/file/example/wallhack.lua/file"
        }
    ];

    // --- Generate File Cards ---
    const fileList = document.getElementById('file-list');
    if (fileList) {
        scripts.forEach(script => {
            const card = document.createElement('div');
            card.className = 'file-card';
            card.innerHTML = `
                <div class="card-header">
                    <h3>${script.name}</h3>
                    <span class="badge badge-lua">LUA</span>
                </div>
                <p class="file-description">${script.description}</p>
                <div class="file-meta">
                    <span>Version: ${script.version}</span>
                    <span>Size: ${script.size}</span>
                </div>
                <div class="button-group">
                    <a href="${script.link}" class="download-btn"><i class="fa-solid fa-download"></i> Download</a>
                    <button class="copy-btn"><i class="fa-solid fa-copy"></i> Copy Link</button>
                </div>
            `;
            fileList.appendChild(card);
        });
    }

    // --- Sticky Header ---
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Live Search Filter ---
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        const noResults = document.getElementById('no-results');
        searchInput.addEventListener('keyup', () => {
            const filter = searchInput.value.toLowerCase();
            const fileCards = fileList.getElementsByClassName('file-card');
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

    // --- Fade-in Animation on Scroll ---
    const animatedCards = document.querySelectorAll('.file-card');
    if (animatedCards.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedCards.forEach(card => observer.observe(card));
    }

    // --- Copy Link Button ---
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

    // --- Mobile Menu Toggle ---
    const menuBtn = document.getElementById('menu-btn');
    const nav = document.getElementById('main-nav');
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('is-open');
        });
        
        nav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                nav.classList.remove('is-open');
            }
        });
    }

    // --- Live Time in Footer ---
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
            const formatter = new Intl.DateTimeFormat('en-US', options);
            const formattedTime = formatter.format(new Date());
            timeSpan.textContent = formattedTime;
        };
        updateTime();
        setInterval(updateTime, 1000);
    }
});
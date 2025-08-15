document.addEventListener('DOMContentLoaded', () => {
    // -------------------------
    // SCRIPT DATA ARRAY
    // -------------------------
    const scripts = [
        {
            name: "Maple3.lua",
            description: "Cul Ui // Mod menu",
            version: 1.0,
            bytes: 12288,
            type: "lua",
            link: "https://www.mediafire.com/file/d97botb0qb8oi8f/a.lua/file",
            dateAdded: "2025-08-10"
        },
        {
            name: "panel_template.lua",
            description: "Reusable GUI Panel Template",
            version: 1.1,
            bytes: 12288,
            type: "lua",
            link: "https://www.mediafire.com/file/bqgpmn6p4en06wk/Guesten_punel.lua/file",
            dateAdded: "2025-08-14"
        },
        {
            name: "aimbut.lua",
            description: "Mystery script functionality",
            version: 1.0,
            bytes: 5120,
            type: "lua",
            link: "https://www.mediafire.com/file/rtrcg2jovnzrkqt/aimbot.lua/file",
            dateAdded: "2025-08-01"
        },
        {
            name: "speedhack.lua",
            description: "Boost movement speed in-game",
            version: 2.0,
            bytes: 8192,
            type: "lua",
            link: "https://www.mediafire.com/file/example/speedhack.lua/file",
            dateAdded: "2025-08-12"
        },
        {
            name: "flymod.lua",
            description: "Allows the player to fly freely",
            version: 1.3,
            bytes: 10240,
            type: "lua",
            link: "https://www.mediafire.com/file/example/flymod.lua/file",
            dateAdded: "2025-08-08"
        },
        {
            name: "wallhack.lua",
            description: "See through walls for tactical advantage",
            version: 1.4,
            bytes: 7168,
            type: "lua",
            link: "https://www.mediafire.com/file/example/wallhack.lua/file",
            dateAdded: "2025-08-15"
        }
    ];

    // Utility functions
    const formatSize = (bytes) => {
        if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + " MB";
        return (bytes / 1024).toFixed(2) + " KB";
    };
    const getBadgeColor = (type) => {
        switch (type.toLowerCase()) {
            case "lua": return "badge-lua";
            case "js": return "badge-js";
            case "py": return "badge-py";
            default: return "badge-default";
        }
    };
    const isNew = (dateAdded) => {
        const daysDiff = (new Date() - new Date(dateAdded)) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
    };

    // Sort newest version, then alphabetically
    scripts.sort((a, b) => b.version - a.version || a.name.localeCompare(b.name));

    // Render cards
    const fileList = document.getElementById('file-list');
    if (fileList) {
        scripts.forEach(script => {
            const card = document.createElement('div');
            card.className = 'file-card fade-in';
            card.innerHTML = `
                <div class="card-header">
                    <h3>${script.name}</h3>
                    <span class="badge ${getBadgeColor(script.type)}">${script.type.toUpperCase()}</span>
                    ${isNew(script.dateAdded) ? '<span class="badge badge-new">NEW</span>' : ''}
                </div>
                <p class="file-description">${script.description}</p>
                <div class="file-meta">
                    <span>Version: ${script.version}</span>
                    <span>Size: ${formatSize(script.bytes)}</span>
                </div>
                <div class="button-group">
                    <a href="${script.link}" class="download-btn" target="_blank"><i class="fa-solid fa-download"></i> Download</a>
                    <button class="copy-btn"><i class="fa-solid fa-copy"></i> Copy Link</button>
                </div>
            `;

            // Make whole card clickable (except copy button)
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.copy-btn')) {
                    window.open(script.link, '_blank');
                }
            });

            fileList.appendChild(card);
        });
    }

    // Sticky Header
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // Search Filter
    const searchInput = document.getElementById('search-input');
    const noResults = document.getElementById('no-results');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const filter = searchInput.value.toLowerCase();
            let found = false;
            document.querySelectorAll('.file-card').forEach(card => {
                const match = card.textContent.toLowerCase().includes(filter);
                card.style.display = match ? "" : "none";
                found = found || match;
            });
            noResults.style.display = found ? "none" : "block";
        });
    }

    // Copy Button
    if (fileList) {
        fileList.addEventListener('click', (e) => {
            const copyBtn = e.target.closest('.copy-btn');
            if (copyBtn) {
                e.stopPropagation();
                const link = copyBtn.previousElementSibling.href;
                navigator.clipboard.writeText(link).then(() => {
                    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                    setTimeout(() => copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Link', 2000);
                });
            }
        });
    }

    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const nav = document.getElementById('main-nav');
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => nav.classList.toggle('is-open'));
        nav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') nav.classList.remove('is-open');
        });
    }

    // Live Time
    const timeSpan = document.getElementById('current-time');
    if (timeSpan) {
        const updateTime = () => {
            timeSpan.textContent = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Manila',
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
            }).format(new Date());
        };
        updateTime();
        setInterval(updateTime, 1000);
    }
});
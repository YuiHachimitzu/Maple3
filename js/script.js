document.addEventListener("DOMContentLoaded", () => {
    const fileList = document.getElementById("file-list");
    const searchInput = document.getElementById("search-input");
    const noResultsMessage = document.getElementById("no-results-message");

    // Example script data
    const scripts = [
        {
            title: "Aimbot",
            description: "Automatically aim at enemies for perfect shots.",
            views: 1240,
            uploadDate: "2025-08-10",
            language: "Lua",
            downloadLink: "scripts/aimbot.lua",
            codeSnippet: "-- Aimbot code example",
            stepsPage: "steps-aimbot.html"
        },
        {
            title: "Speed Hack",
            description: "Boost your movement speed in-game.",
            views: 980,
            uploadDate: "2025-08-09",
            language: "Lua",
            downloadLink: "scripts/speedhack.lua",
            codeSnippet: "-- Speed hack code example",
            stepsPage: "steps-speedhack.html"
        }
    ];

    // Function to create script cards
    function renderScripts(filter = "") {
        fileList.innerHTML = "";
        let filtered = scripts.filter(script =>
            script.title.toLowerCase().includes(filter.toLowerCase())
        );

        if (filtered.length === 0) {
            noResultsMessage.style.display = "block";
            return;
        } else {
            noResultsMessage.style.display = "none";
        }

        filtered.forEach(script => {
            const card = document.createElement("div");
            card.classList.add("file-card", "visible");

            card.innerHTML = `
                <div class="card-header">
                    <h3>${script.title}</h3>
                    <span class="badge badge-lua">${script.language}</span>
                </div>
                <p class="file-description">${script.description}</p>
                <div class="file-meta">
                    <span><i class="fa-solid fa-eye"></i> ${script.views}</span>
                    <span><i class="fa-solid fa-calendar"></i> ${script.uploadDate}</span>
                </div>
                <div class="button-group">
                    <a href="${script.downloadLink}" class="download-btn" download>
                        <i class="fa-solid fa-download"></i> Download
                    </a>
                    <button class="copy-btn" onclick="navigator.clipboard.writeText(\`${script.codeSnippet}\`)">
                        <i class="fa-solid fa-copy"></i> Copy
                    </button>
                    <a href="${script.stepsPage}" class="steps-btn">
                        <i class="fa-solid fa-list-check"></i> Steps
                    </a>
                </div>
            `;

            fileList.appendChild(card);
        });
    }

    // Initial render
    renderScripts();

    // Search filter
    searchInput.addEventListener("input", e => {
        renderScripts(e.target.value);
    });

    // Mobile menu
    document.getElementById("menu-btn").addEventListener("click", () => {
        document.getElementById("main-nav").classList.toggle("is-open");
    });

    // Footer year
    document.getElementById("current-time").textContent = new Date().getFullYear();
});
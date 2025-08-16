document.addEventListener("DOMContentLoaded", () => {
    const fileList = document.getElementById("file-list");
    const searchInput = document.getElementById("search-input");
    const noResultsMessage = document.getElementById("no-results-message");

    // Example subject-themed data
    const scripts = [
        {
            title: "Mathematics",
            description: "Life is like algebra — find your x and never forget your y.",
            views: 1240,
            uploadDate: "2025-08-10",
            language: "Quote",
            downloadLink: "#",
            codeSnippet: `"Math is the language the universe whispers to those who listen."`,
            stepsPage: "steps-math.html"
        },
        {
            title: "Science",
            description: "Even small reactions can change the whole experiment of life.",
            views: 980,
            uploadDate: "2025-08-09",
            language: "Quote",
            downloadLink: "#",
            codeSnippet: `"Stay curious — the next discovery might be yours."`,
            stepsPage: "steps-science.html"
        },
        {
            title: "English",
            description: "Your words are chapters — write them with meaning.",
            views: 860,
            uploadDate: "2025-08-08",
            language: "Quote",
            downloadLink: "#",
            codeSnippet: `"Every sentence you write is a step in your own story."`,
            stepsPage: "steps-english.html"
        },
        {
            title: "History",
            description: "The past is your teacher, but the future is your exam.",
            views: 790,
            uploadDate: "2025-08-07",
            language: "Quote",
            downloadLink: "#",
            codeSnippet: `"Those who learn from history write their own destiny."`,
            stepsPage: "steps-history.html"
        },
        {
            title: "Geography",
            description: "Find your place in the world — and explore beyond the map.",
            views: 720,
            uploadDate: "2025-08-06",
            language: "Quote",
            downloadLink: "#",
            codeSnippet: `"The world is a book, and those who do not travel read only one page."`,
            stepsPage: "steps-geography.html"
        },
        {
            title: "Music",
            description: "Your heartbeat is the first rhythm you ever danced to.",
            views: 680,
            uploadDate: "2025-08-05",
            language: "Quote",
            downloadLink: "#",
            codeSnippet: `"Life without music is like a body without a soul."`,
            stepsPage: "steps-music.html"
        },
        {
            title: "Art",
            description: "Life is your canvas — spill every color you feel.",
            views: 650,
            uploadDate: "2025-08-04",
            language: "Quote",
            downloadLink: "#",
            codeSnippet: `"Every blank page is an invitation to create."`,
            stepsPage: "steps-art.html"
        },
        {
            title: "Physical Education",
            description: "Strength isn’t just in muscles — it’s in showing up every day.",
            views: 610,
            uploadDate: "2025-08-03",
            language: "Quote",
            downloadLink: "#",
            codeSnippet: `"Your body can go further than your mind thinks."`,
            stepsPage: "steps-pe.html"
        }
    ];

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

    renderScripts();

    searchInput.addEventListener("input", e => {
        renderScripts(e.target.value);
    });

    document.getElementById("menu-btn").addEventListener("click", () => {
        document.getElementById("main-nav").classList.toggle("is-open");
    });

    document.getElementById("current-time").textContent = new Date().getFullYear();
});
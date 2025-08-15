// scriptsData array holds all your scripts
const scriptsData = [
    {
        title: "Speed Hack",
        description: "Boosts your in-game speed for quick movement.",
        language: "Lua",
        views: "1.2k",
        uploadDate: "Aug 15, 2025",
        downloadLink: "files/speedhack.lua",
        codeSnippet: "print('Speed Hack Activated')",
        stepsPage: "steps/speedhack.html"
    },
    {
        title: "Fly Hack",
        description: "Allows flying across the map.",
        language: "Lua",
        views: "980",
        uploadDate: "Aug 14, 2025",
        downloadLink: "files/flyhack.lua",
        codeSnippet: "print('Fly Hack Activated')",
        stepsPage: "steps/flyhack.html"
    }
    // Add more scripts here...
];

// Function to create the cards dynamically
function createScriptCards() {
    const fileList = document.querySelector(".file-list");

    scriptsData.forEach(script => {
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

// Run when DOM is loaded
document.addEventListener("DOMContentLoaded", createScriptCards);
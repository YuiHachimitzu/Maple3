document.addEventListener("DOMContentLoaded", () => {
    const quizList = document.getElementById("quiz-list");
    const searchInput = document.getElementById("search-input");
    const noResultsMessage = document.getElementById("no-results-message");

    // Example quiz/assignment data
    const quizzes = [
        {
            title: "Math Quiz - Algebra Basics",
            description: "Test your algebra skills with 10 beginner-friendly questions.",
            date: "2025-08-15",
            answersCount: 10,
            img: "images/math-quiz.jpg",
            link: "quiz-math.html"
        },
        {
            title: "History Assignment - World War II",
            description: "Complete the timeline and answer questions about key events.",
            date: "2025-08-12",
            answersCount: 15,
            img: "images/history-assignment.jpg",
            link: "assignment-history.html"
        },
        {
            title: "Science Quiz - Physics Laws",
            description: "Identify and explain key laws of physics.",
            date: "2025-08-10",
            answersCount: 12,
            img: "images/science-quiz.jpg",
            link: "quiz-science.html"
        }
    ];

    // Render quizzes
    function renderQuizzes(filter = "") {
        quizList.innerHTML = "";
        let filtered = quizzes.filter(q =>
            q.title.toLowerCase().includes(filter.toLowerCase())
        );

        if (filtered.length === 0) {
            noResultsMessage.style.display = "block";
            return;
        }
        noResultsMessage.style.display = "none";

        filtered.forEach(q => {
            const card = document.createElement("div");
            card.classList.add("quiz-preview-card");
            card.innerHTML = `
                <img src="${q.img}" alt="${q.title}" class="quiz-preview-img">
                <div class="quiz-preview-content">
                    <h3>${q.title}</h3>
                    <p>${q.description}</p>
                    <div class="quiz-meta">
                        <span><i class="fa-solid fa-calendar"></i> ${q.date}</span>
                        <span><i class="fa-solid fa-list"></i> ${q.answersCount} Questions</span>
                    </div>
                    <a href="${q.link}">View Quiz</a>
                </div>
            `;
            quizList.appendChild(card);
        });
    }

    // Initial render
    renderQuizzes();

    // Search filter
    searchInput.addEventListener("input", e => {
        renderQuizzes(e.target.value);
    });

    // Mobile menu
    document.getElementById("menu-btn").addEventListener("click", () => {
        document.getElementById("main-nav").classList.toggle("is-open");
    });

    // Footer year
    document.getElementById("current-time").textContent = new Date().getFullYear();
});
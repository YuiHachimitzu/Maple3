document.addEventListener('DOMContentLoaded', () => {
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

    // --- Live Search Filter (only runs if search input exists) ---
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        const fileList = document.getElementById('file-list');
        const fileCards = fileList.getElementsByClassName('file-card');
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
    const fileListContainer = document.getElementById('file-list');
    if(fileListContainer){
        fileListContainer.addEventListener('click', (e) => {
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

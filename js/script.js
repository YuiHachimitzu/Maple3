document.addEventListener('DOMContentLoaded', () => {
    // --- Sticky Header ---
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Live Search Filter ---
    const searchInput = document.getElementById('search-input');
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

    // --- Fade-in Animation on Scroll ---
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    for (let card of fileCards) {
        observer.observe(card);
    }

    // --- Copy Link Button ---
    fileList.addEventListener('click', (e) => {
        if (e.target.classList.contains('copy-btn') || e.target.parentElement.classList.contains('copy-btn')) {
            const copyBtn = e.target.closest('.copy-btn');
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

    // --- Mobile Menu Toggle ---
    const menuBtn = document.getElementById('menu-btn');
    const nav = document.getElementById('main-nav');
    menuBtn.addEventListener('click', () => {
        nav.classList.toggle('is-open');
    });

    // --- Automatic Year in Footer ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

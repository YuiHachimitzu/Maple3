document.addEventListener('DOMContentLoaded', () => {
    // Automatically update the year in the footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

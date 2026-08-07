document.addEventListener("DOMContentLoaded", () => {
    const menuLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('section[id]');
    const navItems = {};
    
    menuLinks.forEach(link => {
        const id = link.getAttribute('href').slice(1);
        navItems[id] = link;
    });

    const observerOptions = {
        root: null,
        rootMargin: '-15% 0px -75% 0px', // Focus window near the top-middle of viewport
        threshold: 0
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                menuLinks.forEach(link => link.classList.remove('active'));
                if (navItems[id]) {
                    navItems[id].classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
});

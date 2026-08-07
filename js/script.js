document.addEventListener("DOMContentLoaded", () => {
    // ── SCROLLSPY LOGIC ──
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

    // ── WEBVIEW CONTACTS FALLBACK (tel: & mailto:) ──
    
    // WebView user agent detection
    const isWebView = (() => {
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        const isAndroidWV = /android/i.test(ua) && /version/i.test(ua);
        const isIOSWV = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(ua);
        return isAndroidWV || isIOSWV;
    })();

    // Copy to clipboard helper that supports file:// protocol inside WebViews
    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            return new Promise((resolve, reject) => {
                const success = document.execCommand('copy');
                textArea.remove();
                if (success) {
                    resolve();
                } else {
                    reject(new Error("Copy failed"));
                }
            });
        }
    }

    // Toast popup generator
    function showToast(message) {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // If loaded inside a mobile app WebView, intercept tel: and mailto: clicks
    if (isWebView) {
        document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                const value = href.replace('tel:', '').replace('mailto:', '');
                const label = href.startsWith('tel:') ? 'Phone number' : 'Email address';

                copyToClipboard(value)
                    .then(() => {
                        showToast(`${label} copied to clipboard!`);
                    })
                    .catch(() => {
                        // Fallback fallback if both copy methods fail (e.g. system permissions restriction)
                        showToast(`${label}: ${value}`);
                    });
            });
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    
    // Copy to clipboard helper
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

    // Intercept tel: and mailto: clicks for better UX in webviews
    document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', (e) => {
            // Optional: prevent default if you strictly want copy-to-clipboard instead of opening apps
            // e.preventDefault(); 
            const href = link.getAttribute('href');
            const value = href.replace('tel:', '').replace('mailto:', '');
            
            copyToClipboard(value)
                .then(() => {
                    showToast(`Copied to clipboard: ${value}`);
                })
                .catch(() => {
                    console.log(`Failed to auto-copy ${value}`);
                });
        });
    });

});

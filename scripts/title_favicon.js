<script>
(function applyCustomSettings() {
    document.addEventListener('DOMContentLoaded', () => {
        const customTitle = localStorage.getItem('customTitle');
        const customFavicon = localStorage.getItem('customFavicon');
        const defaultFavicon = 'https://wowdabug.github.io/wdbg/images/favicon-32x32.png';

        if (customTitle) {
            document.title = customTitle;
        }

        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            link.type = 'image/png';
            document.head.appendChild(link);
        }

        link.href = customFavicon || defaultFavicon;
    });
})();
</script>

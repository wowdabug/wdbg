<script>
(function applyCustomSettings() {
    const title = localStorage.getItem('customTitle');
    const favicon = localStorage.getItem('customFavicon');

    if (title) {
        document.title = title;
    }

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }

    link.href = favicon || '../images/favicon-32x32.png';
})();
</script>

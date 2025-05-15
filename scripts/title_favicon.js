(function applyCustomSettings() {
    const defaultTitle = "WDBG";
    const defaultFavicon = "https://wowdabug.github.io/wdbg/images/favicon.png";
    const title = localStorage.getItem('customTitle');
    const favicon = localStorage.getItem('customFavicon');

    if (title) {
        document.title = title;
    } else {
        document.title = defaultTitle;
    }

    if (favicon) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = favicon;
    } else {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = defaultFavicon;
    }

document.addEventListener('keydown', (e) => {
  const panicKey = localStorage.getItem('panicKey');
  const panicUrl = localStorage.getItem('panicUrl');
  if (panicKey && panicUrl && e.key === panicKey) {
  window.open(panicUrl, '_blank');
  }
});
})();

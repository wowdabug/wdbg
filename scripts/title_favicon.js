<script>
(function applyCustomSettings() {
  const defaultTitle = "WDBG";
  const defaultFavicon = "https://wowdabug.github.io/wdbg/images/favicon.png";
  const title = localStorage.getItem('customTitle');
  const favicon = localStorage.getItem('customFavicon');
  const keybind = localStorage.getItem('customKeybind');
  const keybindUrl = localStorage.getItem('customKeybindUrl');

  document.title = title || defaultTitle;

  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = favicon || defaultFavicon;

  if (keybind && keybindUrl) {
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === keybind && !e.ctrlKey && !e.metaKey && !e.altKey) {
        window.location.replace(keybindUrl);
      }
    });
  }
})();
</script>

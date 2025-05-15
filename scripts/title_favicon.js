<script>
(function applyCustomSettings() {
  const defaultTitle = "WDBG";
  const defaultFavicon = "https://wowdabug.github.io/wdbg/images/favicon.png";

  const title = localStorage.getItem('customTitle') || defaultTitle;
  const favicon = localStorage.getItem('customFavicon') || defaultFavicon;
  const keybind = localStorage.getItem('customKeybind');
  const keybindUrl = localStorage.getItem('customKeybindUrl');

  // Apply title
  document.title = title;

  // Apply favicon
  let link = document.querySelector("link[rel='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'icon';
  link.href = favicon;
  if (!document.querySelector("link[rel='icon']")) {
    document.head.appendChild(link);
  }

  // Add keybind listener
  if (keybind && keybindUrl) {
    document.addEventListener('keydown', (e) => {
      if (
        e.key.toLowerCase() === keybind.toLowerCase() &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.metaKey
      ) {
        window.location.replace(keybindUrl);
      }
    });
  }
})();
</script>

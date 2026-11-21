try {
  const theme = localStorage.getItem('zecheng-li-theme');
  if (theme === 'dark' || theme === 'light') document.documentElement.dataset.theme = theme;
} catch {
  // The stylesheet uses the system preference when storage is unavailable.
}

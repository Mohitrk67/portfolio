// minimal.js - handles scroll animations and dark mode toggle
// Scroll-driven fade-up animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Dark mode toggle
const toggle = document.getElementById('darkModeToggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-mode');
    // Persist preference
    const isDark = document.documentElement.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    // Update button label
    toggle.textContent = isDark ? '☀️' : '🌓';
  });
  // Initialize based on saved preference
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.classList.add('dark-mode');
    toggle.textContent = '☀️';
  } else {
    toggle.textContent = '🌓';
  }
}

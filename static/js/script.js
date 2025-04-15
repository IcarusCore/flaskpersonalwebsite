document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Functionality
    const toggleButton = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateToggleIcon(savedTheme);

    // Toggle theme on button click
    toggleButton.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleIcon(newTheme);
    });

    // Update toggle button icon
    function updateToggleIcon(theme) {
        toggleButton.textContent = theme === 'light' ? '☀️' : '🌙';
    }

    // Hamburger Menu Functionality
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('nav-active');
        console.log('Hamburger toggled:', nav.classList.contains('nav-active') ? 'Menu open' : 'Menu closed');
    });

    // Close menu when a link is clicked
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('nav-active');
            console.log('Nav link clicked, menu closed');
        });
    });

    // Close menu when theme toggle is clicked
    toggleButton.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('nav-active');
        console.log('Theme toggle clicked, menu closed');
    });
});
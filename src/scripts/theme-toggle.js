/**
 * Theme Toggle functionality for HRC Lab website
 * Switches between light and dark modes
 */

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeThemeToggle();
});

function initializeThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Add click event listener to theme toggle button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }
}

function setTheme(theme) {
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Set the theme attribute
    htmlElement.setAttribute('data-theme', theme);
    
    // Save theme preference
    localStorage.setItem('theme', theme);
    
    // Update the toggle button icon
    if (themeToggleBtn) {
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa fa-sun-o';
            themeToggleBtn.title = '切換到淺色模式';
        } else {
            icon.className = 'fa fa-moon-o';
            themeToggleBtn.title = '切換到深色模式';
        }
    }
}

// Function to get current theme
function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
}

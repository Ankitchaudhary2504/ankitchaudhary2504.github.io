document.addEventListener('DOMContentLoaded', () => {

    // 0. Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        
        // Switch Icon and save preference
        if (isLight) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });
    // 1. Typing Effect for Subtitle
    const subtitleElement = document.getElementById('typing-text');
    const textToType = 'Mobile App Developer';
    let i = 0;

    function typeWriter() {
        if (i < textToType.length) {
            subtitleElement.innerHTML += textToType.charAt(i);
            i++;
            setTimeout(typeWriter, 100); // typing speed
        }
    }

    // Start typing after a short delay
    setTimeout(typeWriter, 500);

    // 2. Reveal on Scroll for App Cards
    const appCards = document.querySelectorAll('.app-card');

    // Add staggered delay to cards
    appCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    appCards.forEach(card => {
        observer.observe(card);
    });

    // 3. Dynamic Glow Effect following Mouse (Optional advanced effect)
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        // Move background orbs slightly opposite to mouse movement (parallax)
        const orb1 = document.querySelector('.orb-1');
        const orb2 = document.querySelector('.orb-2');

        if (orb1 && orb2) {
            orb1.style.transform = `translate(${x * -30}px, ${y * -30}px)`;
            orb2.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
        }
    });
});

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

    // 2. Reveal on Scroll for App Cards & Timeline
    const appCards = document.querySelectorAll('.app-card');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const elementsToReveal = [...appCards, ...timelineItems];

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
                entry.target.classList.remove('hidden');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    elementsToReveal.forEach(el => observer.observe(el));

    // 3. Dynamic Glow Effect following Mouse & Custom Cursor
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // Custom Cursor
        if (cursorDot && cursorOutline) {
            cursorDot.style.left = `${x}px`;
            cursorDot.style.top = `${y}px`;
            
            // Add a tiny delay to the outline for that smooth effect
            cursorOutline.animate({
                left: `${x}px`,
                top: `${y}px`
            }, { duration: 500, fill: "forwards" });
        }

        // Move background orbs slightly opposite to mouse movement (parallax)
        const xOrb = x / window.innerWidth;
        const yOrb = y / window.innerHeight;
        
        const orb1 = document.querySelector('.orb-1');
        const orb2 = document.querySelector('.orb-2');

        if (orb1 && orb2) {
            orb1.style.transform = `translate(${xOrb * -30}px, ${yOrb * -30}px)`;
            orb2.style.transform = `translate(${xOrb * 40}px, ${yOrb * 40}px)`;
        }
    });

    // Cursor hover effects on links/buttons
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseover', () => {
            if (cursorOutline) {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
            }
        });
        el.addEventListener('mouseout', () => {
            if (cursorOutline) {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.backgroundColor = 'transparent';
            }
        });
    });

    // 4. Stat Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                hasCounted = true;
                stats.forEach(stat => {
                    const target = +stat.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    
                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            stat.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.innerText = target;
                        }
                    };
                    updateCounter();
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

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

    // 5. Terminal Typing Animation
    const terminalLines = [
        "> flutter run --release",
        "> Building for Android and iOS...",
        "> Compiling Dart bridging...",
        "> Build complete in 12.4s.",
        "> App successfully published! 🚀"
    ];
    const terminalText = document.getElementById('terminal-text');
    if (terminalText) {
        let lineIdx = 0;
        let charIdx = 0;

        function typeTerminal() {
            if (lineIdx < terminalLines.length) {
                if (charIdx < terminalLines[lineIdx].length) {
                    // Start of new line
                    if (charIdx === 0 && lineIdx !== 0) {
                        terminalText.innerHTML = terminalText.innerHTML.replace('<span class="typed-cursor">_</span>', '') + '<br>';
                    } else if (charIdx === 0 && lineIdx === 0) {
                        terminalText.innerHTML = '';
                    }

                    let currText = terminalText.innerHTML.replace('<span class="typed-cursor">_</span>', '');
                    terminalText.innerHTML = currText + terminalLines[lineIdx].charAt(charIdx) + '<span class="typed-cursor">_</span>';

                    charIdx++;
                    setTimeout(typeTerminal, 50 + Math.random() * 50); // randomize typing speed
                } else {
                    // Line done -> move to next line after a pause
                    lineIdx++;
                    charIdx = 0;
                    setTimeout(typeTerminal, 800);
                }
            } else {
                // Loop terminal animation
                setTimeout(() => {
                    lineIdx = 0;
                    charIdx = 0;
                    typeTerminal();
                }, 3000);
            }
        }
        setTimeout(typeTerminal, 1500);
    }

    // 6. Skill Rings Animation Intersection Observer
    const skillRings = document.querySelectorAll('.skill-ring');
    const ringObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const ring = entry.target;
                const progressCircle = ring.querySelector('.ring-progress');
                const percentText = ring.querySelector('.percent');
                const targetPercent = +ring.getAttribute('data-percent');

                // Animate circle stroke
                const circumference = 283;
                const offset = circumference - (targetPercent / 100) * circumference;
                progressCircle.style.strokeDashoffset = offset;

                // Animate text
                let currentProg = 0;
                const dur = 2000;
                const inc = targetPercent / (dur / 16);
                const updateProg = () => {
                    currentProg += inc;
                    if (currentProg < targetPercent) {
                        percentText.innerText = Math.ceil(currentProg) + '%';
                        requestAnimationFrame(updateProg);
                    } else {
                        percentText.innerText = targetPercent + '%';
                    }
                };
                updateProg();

                ringObserver.unobserve(ring);
            }
        });
    }, { threshold: 0.5 });

    skillRings.forEach(ring => ringObserver.observe(ring));
});

// Global Window Handlers
window.addEventListener('load', () => {
    // Hide Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 800); // minimum 800ms to show the cool logo animation
    }

    // Init tsParticles
    if (typeof tsParticles !== 'undefined') {
        tsParticles.load("tsparticles", {
            background: {
                color: { value: "transparent" },
            },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: { enable: true, mode: "grab" },
                },
                modes: {
                    grab: { distance: 200, links: { opacity: 0.5 } }
                },
            },
            particles: {
                color: { value: ["#38bdf8", "#818cf8"] },
                links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.1, width: 1 },
                move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 1, straight: false },
                number: { density: { enable: true, area: 800 }, value: 60 },
                opacity: { value: 0.3 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 3 } },
            },
            detectRetina: true,
        });
    }
});

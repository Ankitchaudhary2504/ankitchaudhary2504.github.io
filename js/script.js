document.addEventListener('DOMContentLoaded', () => {

    // 0. Theme Toggle with View Transitions
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');

    // Check local storage for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggleBtn.addEventListener('click', (e) => {
        // Track the click coordinates for the circular clip transition
        const x = e.clientX;
        const y = e.clientY;
        document.documentElement.style.setProperty('--click-x', `${x}px`);
        document.documentElement.style.setProperty('--click-y', `${y}px`);

        const toggleTheme = () => {
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
        };

        if (document.startViewTransition) {
            document.startViewTransition(toggleTheme);
        } else {
            toggleTheme();
        }
    });

    // 1. Typing Effect for Subtitle
    const subtitleElement = document.getElementById('typing-text');
    const textToType = 'Mobile App Developer';
    let typeIdx = 0;

    function typeWriter() {
        if (typeIdx < textToType.length) {
            subtitleElement.innerHTML += textToType.charAt(typeIdx);
            typeIdx++;
            setTimeout(typeWriter, 100); // typing speed
        }
    }

    // Start typing after a short delay
    setTimeout(typeWriter, 500);

    // 2. Reveal on Scroll for App Cards & Timeline (IntersectionObserver Fallback)
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

    // 3. Spotlight Mouse Hover Glow & 3D Card Tilt Properties
    const spotlightCards = document.querySelectorAll('.app-card, .stat-card, .review-card, .kiddo-card');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${mouseX}px`);
            card.style.setProperty('--mouse-y', `${mouseY}px`);
        });
    });

    const kiddoCards = document.querySelectorAll('.kiddo-card');
    kiddoCards.forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            
            // Calculate cursor offset relative to card center (-0.5 to 0.5)
            const xPercent = (e.clientX - rect.left) / width - 0.5;
            const yPercent = (e.clientY - rect.top) / height - 0.5;
            
            // Maximum tilt rotation: 25 degrees
            const rotateX = -yPercent * 25; 
            const rotateY = xPercent * 25;  
            
            card.style.setProperty('--rotate-x', `${rotateX}deg`);
            card.style.setProperty('--rotate-y', `${rotateY}deg`);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--rotate-x', '0deg');
            card.style.setProperty('--rotate-y', '0deg');
        });
    });

    // 4. Premium Magnetic Custom Cursor
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    if (isTouchDevice) {
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
    } else {
        document.body.classList.add('cursor-enabled');
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let isHoveringInteractive = false;
        let hoveredElement = null;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (cursorDot) {
                cursorDot.style.left = `${mouseX}px`;
                cursorDot.style.top = `${mouseY}px`;
            }
        });

        // Animation loop for smooth custom cursor follow (spring effect)
        const animateCursor = () => {
            if (isHoveringInteractive && hoveredElement) {
                const rect = hoveredElement.getBoundingClientRect();
                const targetX = rect.left + rect.width / 2;
                const targetY = rect.top + rect.height / 2;
                
                // Spring magnetic snap to center of hovered element
                cursorX += (targetX - cursorX) * 0.25;
                cursorY += (targetY - cursorY) * 0.25;
                
                if (cursorOutline) {
                    cursorOutline.style.left = `${cursorX}px`;
                    cursorOutline.style.top = `${cursorY}px`;
                    cursorOutline.style.width = `${rect.width + 12}px`;
                    cursorOutline.style.height = `${rect.height + 12}px`;
                    cursorOutline.style.borderRadius = window.getComputedStyle(hoveredElement).borderRadius;
                    cursorOutline.style.borderColor = 'var(--gradient-1)';
                    cursorOutline.style.backgroundColor = 'rgba(99, 102, 241, 0.08)';
                }
            } else {
                // Spring follow standard coordinates
                cursorX += (mouseX - cursorX) * 0.18;
                cursorY += (mouseY - cursorY) * 0.18;
                
                if (cursorOutline) {
                    cursorOutline.style.left = `${cursorX}px`;
                    cursorOutline.style.top = `${cursorY}px`;
                    cursorOutline.style.width = '40px';
                    cursorOutline.style.height = '40px';
                    cursorOutline.style.borderRadius = '50%';
                    cursorOutline.style.borderColor = 'var(--gradient-2)';
                    cursorOutline.style.backgroundColor = 'transparent';
                }
            }
            requestAnimationFrame(animateCursor);
        };
        requestAnimationFrame(animateCursor);

        // Magnetic hover listeners
        const interactiveElements = document.querySelectorAll('a, button, .social-link, .app-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                isHoveringInteractive = true;
                hoveredElement = el;
                if (cursorDot) {
                    cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
                    cursorDot.style.opacity = '0.3';
                }
            });
            el.addEventListener('mouseleave', () => {
                isHoveringInteractive = false;
                hoveredElement = null;
                if (cursorDot) {
                    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                    cursorDot.style.opacity = '1';
                }
            });
        });
    }

    // 5. Stat Counter Animation
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

    // 6. Terminal Typing Animation
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

    // 7. Skill Rings Animation Intersection Observer
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

    // 8. JS Fallback scroll listeners for non-SDA browsers (Firefox, etc.)
    const supportsSDA = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
    
    if (!supportsSDA) {
        // Scroll Progress Bar Fallback
        const scrollProgress = document.getElementById('scroll-progress');
        if (scrollProgress) {
            window.addEventListener('scroll', () => {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const pct = docHeight > 0 ? scrollTop / docHeight : 0;
                scrollProgress.style.transform = `scaleX(${pct})`;
            });
        }

        // Timeline Growing Line Fallback
        const timeline = document.querySelector('.timeline');
        if (timeline) {
            const updateTimelineScroll = () => {
                const rect = timeline.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                if (rect.top < windowHeight && rect.bottom > 0) {
                    const scrollRange = rect.height + windowHeight;
                    const scrollOffset = windowHeight - rect.top;
                    const pct = Math.min(1, Math.max(0, scrollOffset / scrollRange));
                    timeline.style.setProperty('--timeline-scale', pct);
                }
            };
            window.addEventListener('scroll', updateTimelineScroll);
            updateTimelineScroll();
        }
    }
});

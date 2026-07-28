document.addEventListener('DOMContentLoaded', () => {

    // 0. Theme Toggle with View Transitions
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggleBtn.addEventListener('click', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        document.documentElement.style.setProperty('--click-x', `${x}px`);
        document.documentElement.style.setProperty('--click-y', `${y}px`);

        const toggleTheme = () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');

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
    const textToType = 'Senior Flutter & Mobile App Architect';
    let typeIdx = 0;

    function typeWriter() {
        if (subtitleElement && typeIdx < textToType.length) {
            subtitleElement.innerHTML += textToType.charAt(typeIdx);
            typeIdx++;
            setTimeout(typeWriter, 80);
        }
    }
    setTimeout(typeWriter, 500);

    // 2. Reveal on Scroll for App Cards & Timeline
    const appCards = document.querySelectorAll('.app-card');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const elementsToReveal = [...appCards, ...timelineItems];

    appCards.forEach((card, index) => {
        card.style.transitionDelay = `${(index % 3) * 0.1}s`;
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.remove('hidden');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elementsToReveal.forEach(el => observer.observe(el));

    // 3. Category Filter System
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            appCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 4. Spotlight Mouse Hover Glow & 3D Tilt
    const bindSpotlight = () => {
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
    };
    bindSpotlight();

    // 4.1 Kiddo Learn Universe 3D Tilt Effect
    const kiddoCards = document.querySelectorAll('.kiddo-card');
    kiddoCards.forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const xPercent = (e.clientX - rect.left) / width - 0.5;
            const yPercent = (e.clientY - rect.top) / height - 0.5;
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

    // 5. Magnetic Custom Cursor
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

        const animateCursor = () => {
            if (isHoveringInteractive && hoveredElement) {
                const rect = hoveredElement.getBoundingClientRect();
                const targetX = rect.left + rect.width / 2;
                const targetY = rect.top + rect.height / 2;

                cursorX += (targetX - cursorX) * 0.25;
                cursorY += (targetY - cursorY) * 0.25;

                if (cursorOutline) {
                    cursorOutline.style.left = `${cursorX}px`;
                    cursorOutline.style.top = `${cursorY}px`;
                    cursorOutline.style.width = `${rect.width + 10}px`;
                    cursorOutline.style.height = `${rect.height + 10}px`;
                    cursorOutline.style.borderRadius = window.getComputedStyle(hoveredElement).borderRadius;
                    cursorOutline.style.borderColor = 'var(--gradient-1)';
                    cursorOutline.style.backgroundColor = 'rgba(99, 102, 241, 0.08)';
                }
            } else {
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

        const interactiveElements = document.querySelectorAll('a, button, .social-link, .app-card, .filter-btn');
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

    // 6. Stat Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                hasCounted = true;
                stats.forEach(stat => {
                    const target = +stat.getAttribute('data-target');
                    const duration = 2000;
                    const increment = target / (duration / 16);

                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            stat.innerText = Math.ceil(current).toLocaleString();
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.innerText = target.toLocaleString();
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

    // 7. Terminal Typing Animation
    const terminalLines = [
        "> flutter run --release",
        "> Building for Android & iOS target...",
        "> Compiling Pump Khata & Vishv Umiya Dham...",
        "> Building VUF Sangathan & Flowport...",
        "> Deploying Boxo & E-Commerce Mobile Engine...",
        "> Build complete! All 8+ Apps Live & Optimized! 🚀"
    ];
    const terminalText = document.getElementById('terminal-text');
    if (terminalText) {
        let lineIdx = 0;
        let charIdx = 0;

        function typeTerminal() {
            if (lineIdx < terminalLines.length) {
                if (charIdx < terminalLines[lineIdx].length) {
                    if (charIdx === 0 && lineIdx !== 0) {
                        terminalText.innerHTML = terminalText.innerHTML.replace('<span class="typed-cursor">_</span>', '') + '<br>';
                    } else if (charIdx === 0 && lineIdx === 0) {
                        terminalText.innerHTML = '';
                    }

                    let currText = terminalText.innerHTML.replace('<span class="typed-cursor">_</span>', '');
                    terminalText.innerHTML = currText + terminalLines[lineIdx].charAt(charIdx) + '<span class="typed-cursor">_</span>';

                    charIdx++;
                    setTimeout(typeTerminal, 35 + Math.random() * 35);
                } else {
                    lineIdx++;
                    charIdx = 0;
                    setTimeout(typeTerminal, 650);
                }
            } else {
                setTimeout(() => {
                    lineIdx = 0;
                    charIdx = 0;
                    typeTerminal();
                }, 4000);
            }
        }
        setTimeout(typeTerminal, 1200);
    }

    // 8. Skill Rings Animation
    const skillRings = document.querySelectorAll('.skill-ring');
    const ringObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const ring = entry.target;
                const progressCircle = ring.querySelector('.ring-progress');
                const percentText = ring.querySelector('.percent');
                const targetPercent = +ring.getAttribute('data-percent');

                const circumference = 283;
                const offset = circumference - (targetPercent / 100) * circumference;
                progressCircle.style.strokeDashoffset = offset;

                let currentProg = 0;
                const updateProg = () => {
                    currentProg += 1.5;
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

    // 9. Quick View App Modal Details Data
    const appDetailsMap = {
        pumpkhata: {
            title: "Pump Khata",
            category: "Petrol Pump Sales Calculator & Shift Ledger",
            icon: "assets/images/apps/pumpkhata.png",
            description: "A specialized daily shift calculator & cash drawer manager created for petrol pump workers, staff operators, and pump managers in India.",
            features: [
                "Automatic litres calculation based on fuel rate & rupee sales",
                "Instant payment segregation (Cash vs Digital UPI / PhonePe / Paytm)",
                "Shift reconciliation to verify cash register balances",
                "Offline-first storage with 100% private local data encryption",
                "High-contrast sunlight readable UI design for fuel stations"
            ],
            playStore: "https://play.google.com/store/apps/details?id=com.ankit.pumpkhata"
        },
        vishvumiyadham: {
            title: "VUF - Vishv Umiya Dham",
            category: "Official Foundation & Community Portal",
            icon: "assets/images/apps/vishvumiyadham.png",
            description: "The official mobile platform for the Vishv Umiya Foundation, highlighting mega development projects, social welfare, and cultural initiatives.",
            features: [
                "Comprehensive overview of foundation mission, vision & projects",
                "Event schedules, registrations, and photo/video galleries",
                "Community news announcements and leadership organization chart",
                "Multi-language support for global community members",
                "Optimized Flutter performance & smooth navigation"
            ],
            playStore: "https://play.google.com/store/apps/details?id=org.vishvumiyadham.application"
        },
        vuf_sangathan: {
            title: "VUF - Sangathan",
            category: "Global Community & Social Network",
            icon: "assets/images/apps/vuf_sangathan.png",
            description: "Developed for the Vishv Umiya Foundation, VUF Sangathan connects global members through an intuitive mobile experience.",
            features: [
                "Real-time news & announcement feed with rich media",
                "Global member directory with privacy settings",
                "Event registration and QR code check-ins",
                "Push notifications for instant community alerts",
                "Clean Architecture with modular state management"
            ],
            playStore: "https://play.google.com/store/apps/details?id=com.xpertnest.vufsangathan"
        },
        flowport: {
            title: "Flowport - Project Board",
            category: "Enterprise Task & Project Management",
            icon: "assets/images/apps/flowport.png",
            description: "A comprehensive project management system designed by Kumbh Design Inc. to power team collaboration and daily workflow tracking.",
            features: [
                "Interactive Kanban drag-and-drop boards for task stages",
                "Automated daily work log reporting & time tracking",
                "Integrated client management and invoice generation",
                "Real-time team chat & file sharing",
                "Role-based permissions & performance dashboards"
            ],
            playStore: "https://play.google.com/store/apps/details?id=com.kumbh.design.flowport"
        },
        boxo: {
            title: "Boxo / Playxible",
            category: "Sports Venue & Turf Booking Engine",
            icon: "assets/images/apps/boxo.png",
            description: "An online platform for sports enthusiasts to discover and book cricket turfs, badminton courts, and sports boxes seamlessly.",
            features: [
                "Real-time slot availability checking & calendar reservation",
                "Integrated secure payment gateway (Razorpay / UPI)",
                "Geolocation search to find nearby sports turfs",
                "Owner admin panel to manage bookings & pricing",
                "Instant SMS / WhatsApp booking confirmations"
            ],
            playStore: "https://play.google.com/store/apps/details?id=com.kumbhdesign.boxo_application"
        },
        ecommerce: {
            title: "E-Commerce Mobile Suite",
            category: "Multi-Vendor Shopping & Retail App",
            icon: "assets/images/apps/ecommerce.png",
            description: "A modern, high-converting mobile e-commerce platform built with Flutter to deliver ultra-fast shopping experiences.",
            features: [
                "Dynamic home feed with categorized banners & flash sales",
                "Seamless cart management with instant coupon application",
                "Multi-payment integration (Stripe, Razorpay, Apple Pay)",
                "Real-time order tracking & delivery status updates",
                "Offline catalog caching and smooth UI transitions"
            ],
            playStore: null
        },
        photobilling: {
            title: "Photo Billing App",
            category: "Digital Udhar Khata & Receipt Manager",
            icon: "assets/images/apps/photobilling.png",
            description: "Built for store owners to replace traditional paper account ledgers with instant mobile camera receipt indexing.",
            features: [
                "Instant receipt capture & automatic image compression",
                "Customer-wise ledger organization (Udhar / Payment received)",
                "Offline SQLite database for zero-latency local access",
                "One-click PDF statement generation for WhatsApp sharing",
                "Automated daily & monthly total calculation"
            ],
            playStore: "https://play.google.com/store/apps/details?id=com.ankit.photobilling"
        },
        kiddolearn: {
            title: "Kiddo Learn",
            category: "Gamified Early Education App",
            icon: "assets/images/apps/kiddolearn.png",
            description: "Vibrant educational app created to spark curiosity in kids through interactive visual modules, pronunciation audio, and fun quizzes.",
            features: [
                "Gamified learning modules for alphabets, numbers, and animals",
                "High-quality audio synthesis and pronunciation guide",
                "Vibrant character animations and interactive touch feedback",
                "Offline-first playback with zero intrusive ads",
                "Kid-friendly UI/UX design certified by educators"
            ],
            playStore: "https://play.google.com/store/apps/details?id=com.ankit.kiddolearn"
        }
    };

    const modalOverlay = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');

    const openModal = (appKey) => {
        const app = appDetailsMap[appKey];
        if (!app) return;

        let iconMarkup = app.isIconFont
            ? `<div class="app-icon ${app.icon}"><i class="fa-solid fa-bag-shopping"></i></div>`
            : `<img src="${app.icon}" alt="${app.title} Icon">`;

        let playStoreBtnMarkup = app.playStore
            ? `<a href="${app.playStore}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="margin-top: 15px; width:100%; justify-content:center;">
                <i class="fab fa-google-play"></i> Get on Google Play
               </a>`
            : `<div class="app-badge preview-badge" style="width:100%; justify-content:center; margin-top:15px; padding:12px;">
                <i class="fas fa-code"></i> Live Production Build
               </div>`;

        modalBody.innerHTML = `
            <div class="modal-body-header">
                ${iconMarkup}
                <div class="modal-body-title">
                    <h3>${app.title}</h3>
                    <span>${app.category}</span>
                </div>
            </div>
            <p style="color:var(--text-secondary); line-height:1.6; margin-bottom:15px;">${app.description}</p>
            <div class="modal-highlights">
                <h4>Key Technical Highlights:</h4>
                <ul>
                    ${app.features.map(f => `<li><i class="fas fa-check-circle"></i> ${f}</li>`).join('')}
                </ul>
            </div>
            ${playStoreBtnMarkup}
        `;

        modalOverlay.classList.add('active');
        modalOverlay.setAttribute('aria-hidden', 'false');
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        modalOverlay.setAttribute('aria-hidden', 'true');
    };

    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const appKey = btn.getAttribute('data-app');
            openModal(appKey);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
});

// Hide Preloader on Load
window.addEventListener('load', () => {
    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker Registered:', reg.scope))
            .catch(err => console.log('Service Worker Registration Failed:', err));
    }

    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 600);
    }

    if (typeof tsParticles !== 'undefined') {
        tsParticles.load("tsparticles", {
            background: { color: { value: "transparent" } },
            fpsLimit: 60,
            interactivity: {
                events: { onHover: { enable: true, mode: "grab" } },
                modes: { grab: { distance: 180, links: { opacity: 0.4 } } },
            },
            particles: {
                color: { value: ["#38bdf8", "#818cf8"] },
                links: { color: "#ffffff", distance: 140, enable: true, opacity: 0.1, width: 1 },
                move: { enable: true, speed: 1, outModes: { default: "bounce" } },
                number: { value: 50 },
                opacity: { value: 0.25 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 3 } },
            },
            detectRetina: true,
        });
    }
});

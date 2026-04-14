document.addEventListener('DOMContentLoaded', () => {

    // ===== Scroll-reveal via IntersectionObserver =====
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });
    revealElements.forEach(el => revealObserver.observe(el));

    // ===== Header scroll effect =====
    const header = document.getElementById('site-header');
    let lastScroll = 0;

    const onScroll = () => {
        const y = window.scrollY;
        if (y > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load

    // ===== Smooth scroll for anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== Animated stat counter =====
    const counterEl = document.querySelector('[data-count]');
    if (counterEl) {
        let counted = false;
        const countTarget = parseInt(counterEl.dataset.count, 10);

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    counted = true;
                    animateCounter(counterEl, countTarget);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counterObserver.observe(counterEl);
    }

    function animateCounter(el, target) {
        const duration = 1800;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(ease * target);
            el.textContent = `$${current}+`;
            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }
        requestAnimationFrame(tick);
    }

    // ===== Parallax on phone mockup =====
    const phoneMockup = document.getElementById('phone-mockup');
    if (phoneMockup) {
        window.addEventListener('scroll', () => {
            const rect = phoneMockup.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const viewCenter = window.innerHeight / 2;
            const offset = (center - viewCenter) * 0.04;
            phoneMockup.style.transform = `translateY(${offset}px)`;
        }, { passive: true });
    }

    // ===== Subtle tilt on review cards (desktop only) =====
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.review-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `translateY(-6px) perspective(600px) rotateX(${y * -6}deg) rotateY(${x * 6}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.4s ease';
            });
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
            });
        });
    }

});

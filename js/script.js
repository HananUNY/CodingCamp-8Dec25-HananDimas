const menuBtn = document.getElementById('menu-btn');
const nav = document.getElementById('main-nav');

if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
        nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => nav.classList.remove('open'));
    });
}

const counters = document.querySelectorAll('.count');
const statsGrid = document.getElementById('stats-grid');

const animateCounter = (el) => {
    const target = Number(el.dataset.target || 0);
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        el.textContent = new Intl.NumberFormat('id-ID').format(value) + (target > 999999 ? '+' : '');
        if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
};

if (statsGrid && counters.length) {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(animateCounter);
                obs.disconnect();
            }
        });
    }, { threshold: 0.25 });

    observer.observe(statsGrid);
}

const testimonials = [
    {
        quote: '“Program ini membuat kami paham cara membangun bisnis sosial yang tidak hanya idealis, tapi juga berkelanjutan.”',
        author: '— Aisyah, Founder DaurBerkah'
    },
    {
        quote: '“Mentornya sangat relevan. Dalam 4 bulan, omzet kami naik 2,3x dan dampak sosial kami lebih terukur.”',
        author: '— Rio, Co-Founder TaniLokal'
    },
    {
        quote: '“Jejaring partner dari SosioTumbuh membuka peluang kolaborasi yang sebelumnya tidak pernah kami bayangkan.”',
        author: '— Meilani, CEO KelasUntukSemua'
    }
];

const quoteEl = document.getElementById('testimonial-quote');
const authorEl = document.getElementById('testimonial-author');
const dotsEl = document.getElementById('testimonial-dots');
let currentIndex = 0;

function renderTestimonial(index) {
    if (!quoteEl || !authorEl || !dotsEl) return;

    quoteEl.textContent = testimonials[index].quote;
    authorEl.textContent = testimonials[index].author;

    dotsEl.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

if (dotsEl) {
    testimonials.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Tampilkan testimoni ${i + 1}`);
        dot.addEventListener('click', () => {
            currentIndex = i;
            renderTestimonial(currentIndex);
        });
        dotsEl.appendChild(dot);
    });

    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        renderTestimonial(currentIndex);
    }, 5000);
}

const form = document.getElementById('join-form');
const formMsg = document.getElementById('form-msg');

if (form && formMsg) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const focus = document.getElementById('focus').value;

        if (!name || !email || !focus) {
            formMsg.textContent = 'Mohon lengkapi semua data sebelum mengirim.';
            return;
        }

        formMsg.textContent = `Terima kasih, ${name}! Tim kami akan menghubungi Anda di ${email}.`;
        form.reset();
    });
}

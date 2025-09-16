document.addEventListener('DOMContentLoaded', () => {

    // MENU MÓVEL (HAMBURGER)
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });

    // FECHAR MENU AO CLICAR EM UM LINK
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
        });
    });

    // SLIDER DE DEPOIMENTOS
    const testimonials = [
        {
            quote: "Atendimento excelente e muito profissional! A clínica é impecável e a equipe muito atenciosa. Recomendo a todos!",
            author: "Maria S., Paciente"
        },
        {
            quote: "Tinha muito medo de dentista, mas a Dra. da OdontoCouto me deixou super tranquilo. O tratamento foi rápido e sem dor.",
            author: "João P., Paciente"
        },
        {
            quote: "O resultado do meu clareamento ficou incrível! Muito além do que eu esperava. Profissionais de altíssima qualidade.",
            author: "Ana C., Paciente"
        }
    ];

    let currentTestimonial = 0;
    const sliderContainer = document.querySelector('.testimonial-slider');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    function showTestimonial(index) {
        const testimonial = testimonials[index];
        sliderContainer.innerHTML = `
            <div class="testimonial-card active">
                <p>"${testimonial.quote}"</p>
                <h4>${testimonial.author}</h4>
            </div>
        `;
    }

    nextBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    });

    prevBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    });

    // Iniciar o slider
    showTestimonial(currentTestimonial);

    // CARROSSEL DE TRATAMENTOS
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const trackContainer = document.querySelector('.carousel-track-container');

    let cardWidth = cards[0].getBoundingClientRect().width;
    let currentIndex = 0;

    const updateCarouselPosition = () => {
        const gap = parseInt(window.getComputedStyle(track).gap);
        const offset = -currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(${offset}px)`;
    };

    const getVisibleCards = () => {
        const containerWidth = trackContainer.offsetWidth;
        const gap = parseInt(window.getComputedStyle(track).gap);
        return Math.floor(containerWidth / (cardWidth + gap));
    };

    nextButton.addEventListener('click', () => {
        const visibleCards = getVisibleCards();
        const maxIndex = cards.length - visibleCards;
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarouselPosition();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarouselPosition();
        }
    });

    window.addEventListener('resize', () => {
        cardWidth = cards[0].getBoundingClientRect().width;
        // Reseta a posição para evitar que o carrossel fique em um estado inválido
        const visibleCards = getVisibleCards();
        const maxIndex = cards.length - visibleCards;
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        updateCarouselPosition();
    });

});


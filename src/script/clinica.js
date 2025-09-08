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

});
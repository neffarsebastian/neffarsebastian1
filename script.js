document.addEventListener('DOMContentLoaded', () => {

    // --- Splash Screen Logic (Integrated) ---
    const splash = document.getElementById('splash-screen');
    const heroVideo = document.querySelector('.hero-video');

    if (splash) {
        const hideSplash = () => {
            splash.classList.add('fade-out');
            setTimeout(() => {
                splash.style.display = 'none';
                // Trigger animations after splash is gone
                document.body.classList.add('page-loaded'); // Start entrance animations
                if (heroVideo) heroVideo.play().catch(() => { }); // Ensure video plays
            }, 1000);
        };

        const onVideoReady = () => {
            return new Promise((resolve) => {
                if (!heroVideo) return resolve();
                if (heroVideo.readyState >= 3) return resolve();

                heroVideo.addEventListener('loadeddata', resolve, { once: true });
                heroVideo.addEventListener('error', resolve, { once: true });
            });
        };

        const onWindowLoad = () => {
            return new Promise((resolve) => {
                if (document.readyState === 'complete') return resolve();
                window.addEventListener('load', resolve, { once: true });
            });
        };

        // Wait for both, but max 4 seconds failsafe (in case video is stuck)
        Promise.race([
            Promise.all([onVideoReady(), onWindowLoad()]),
            new Promise(resolve => setTimeout(resolve, 4000))
        ]).then(() => {
            // Small buffer for smoothness
            setTimeout(hideSplash, 500);
        });
    }

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });


    // --- Menu Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            menuItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });


    // --- Scroll Reveal Animation ---

    // NEW: Initialize Card Backgrounds (for Blur Effect)
    const initCardBackgrounds = () => {
        const items = document.querySelectorAll('.menu-item');
        items.forEach(item => {
            const img = item.querySelector('img');
            const imgContainer = item.querySelector('.menu-img');
            if (img && imgContainer) {
                // Set the variable for the ::before element
                imgContainer.style.setProperty('--card-bg', `url(${img.src})`);
            }
        });
    };
    initCardBackgrounds(); // Run on load

    // --- Scroll Reveal Animation (Optimized with Intersection Observer) ---
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    };

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Adjusted offset
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => revealObserver.observe(el));


    // --- Navbar Scroll Effect ---
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
            header.style.background = 'rgba(18, 18, 18, 0.98)';
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(18, 18, 18, 0.95)';
        }
    });

    // --- Premium Modal Interaction ---
    const modal = document.getElementById('product-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrice = document.getElementById('modal-price');
    const closeModalBtn = document.querySelector('.modal-close');
    const menuGrid = document.querySelector('.menu-grid');

    // 1. Abrir Modal al hacer clic en una tarjeta
    if (menuGrid) {
        menuGrid.addEventListener('click', (e) => {
            // Buscamos el contenedor padre .menu-item más cercano al clic
            const borderItem = e.target.closest('.menu-item');

            if (borderItem) {
                // Extraer datos
                const img = borderItem.querySelector('img').src;
                const title = borderItem.querySelector('h3').innerText;
                const desc = borderItem.querySelector('p').innerText;
                const price = borderItem.querySelector('.price').innerText;

                // Popular Modal
                modalImg.src = img;
                modalTitle.innerText = title;
                modalDesc.innerText = desc;
                modalPrice.innerText = price;

                // Set Fancy Background (Blur Logic)
                document.querySelector('.modal-image-wrapper').style.setProperty('--bg-image', `url(${img})`);

                // Mostrar (Flex para centrar)
                modal.style.display = "flex";
                document.body.style.overflow = "hidden"; // Bloquear scroll
            }
        });
    }

    // 2. Función para cerrar
    const closeModal = () => {
        if (modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    };

    // 3. Eventos de cierre
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    // Clic en el fondo oscuro
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && modal && modal.style.display === "flex") {
            closeModal();
        }
    });

    // --- Form Submission Logic (Backend Integration) ---
    // URL del Backend: Cambiar esta URL cuando despliegues el servidor (ej. en Render/Railway)
    const API_URL = 'https://neffarsebastian1.onrender.com/send-email';
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evitar recarga de página

            const submitBtn = reservationForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;

            // Estado de carga
            submitBtn.disabled = true;
            submitBtn.innerText = "Enviando...";

            // Obtener datos del formulario
            const formData = new FormData(reservationForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('http://localhost:3000/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    alert('¡Reserva enviada con éxito! Revisa tu correo.');
                    reservationForm.reset(); // Limpiar formulario
                } else {
                    alert('Hubo un problema al enviar la reserva: ' + (result.message || 'Error desconocido'));
                }

            } catch (error) {
                console.error('Error de red:', error);
                alert('No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo.');
            } finally {
                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }

});

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('spinnerContainer');
    const wheel = document.getElementById('spinnerWheel');
    const contactInfo = document.getElementById('contactInfo');

    const btnProjectes = document.getElementById('home');
    const btnAboutMe = document.getElementById('aboutme');
    const btnContact = document.getElementById('contact');

    // MODAL SLIDER
    const projectModal = document.getElementById('projectModal');
    const mediaWrapper = document.getElementById('modalMediaWrapper');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    const modalCounter = document.getElementById('modalCounter');

    let currentGallery = [];
    let currentIndex = 0;
    let isModalOpen = false;

    function renderSlide(index) {
        if (!currentGallery.length) return;
        const itemUrl = currentGallery[index];
        const isVideo = itemUrl.toLowerCase().endsWith('.mp4') || itemUrl.toLowerCase().endsWith('.webm');

        mediaWrapper.innerHTML = isVideo ?
            `<video src="${itemUrl}" autoplay muted loop playsinline></video>` :
            `<img src="${itemUrl}" alt="Detalle proyecto">`;

        if (modalCounter) {
            modalCounter.textContent = `${index + 1} / ${currentGallery.length}`;
        }

        if (modalPrev) {
            modalPrev.style.display = currentGallery.length > 1 ? 'flex' : 'none';
        }
        if (modalNext) {
            modalNext.style.display = currentGallery.length > 1 ? 'flex' : 'none';
        }
    }

    function openModal(imagesList) {
        currentGallery = imagesList;
        currentIndex = 0;
        isModalOpen = true;
        renderSlide(currentIndex);
        projectModal.classList.add('is-active');
        projectModal.setAttribute('aria-hidden', 'false');
        container.classList.add('is-hidden-by-modal');
    }

    function closeModal() {
        if (!isModalOpen) return;
        isModalOpen = false;
        projectModal.classList.remove('is-active');
        projectModal.setAttribute('aria-hidden', 'true');
        mediaWrapper.innerHTML = '';
        container.classList.remove('is-hidden-by-modal');
    }

    function nextSlide() {
        if (!currentGallery.length) return;
        currentIndex = (currentIndex + 1) % currentGallery.length;
        renderSlide(currentIndex);
    }

    function prevSlide() {
        if (!currentGallery.length) return;
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        renderSlide(currentIndex);
    }

    // Navegación del Header (siempre cierran el slide si estaba activo)
    btnProjectes.addEventListener('click', () => {
        closeModal();
        if (contactInfo) contactInfo.classList.remove('is-visible');
        container.classList.add('is-visible');
    });

    btnContact.addEventListener('click', () => {
        closeModal();
        container.classList.remove('is-visible');
        if (contactInfo) contactInfo.classList.add('is-visible');
    });

    btnAboutMe.addEventListener('click', () => {
        closeModal();
        container.classList.remove('is-visible');
        if (contactInfo) contactInfo.classList.remove('is-visible');
    });

    // Giro 3D continuo e inercia por scroll
    let currentAngle = 0;
    const baseSpeed = 0.25;
    let targetExtraSpeed = 0;
    const friction = 0.94;

    window.addEventListener('wheel', (e) => {
        if (container.classList.contains('is-visible') && !isModalOpen) {
            targetExtraSpeed += e.deltaY * 0.04;
        }
    }, { passive: true });

    function animate() {
        if (container.classList.contains('is-visible') && !isModalOpen) {
            targetExtraSpeed *= friction;
            currentAngle += (baseSpeed + targetExtraSpeed);
            wheel.style.setProperty('--current-angle', currentAngle);
        }
        requestAnimationFrame(animate);
    }
    animate();

    // Apertura al pulsar cards
    document.querySelectorAll('.spinner-wheel .card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const dataImages = card.getAttribute('data-images');
            if (dataImages) {
                const list = dataImages.split(',').map(s => s.trim()).filter(Boolean);
                openModal(list);
            } else {
                const media = card.querySelector('img, video');
                if (media) openModal([media.getAttribute('src')]);
            }
        });
    });

    if (modalNext) {
        modalNext.addEventListener('click', (e) => {
            e.stopPropagation();
            nextSlide();
        });
    }

    if (modalPrev) {
        modalPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            prevSlide();
        });
    }

    // Cerrar al pulsar el fondo desenfocado fuera de la imagen
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeModal();
            }
        });
    }

    // Teclado (Escape, flechas)
    window.addEventListener('keydown', (e) => {
        if (!isModalOpen) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });

    // Cursor interactivo
    const cursor = document.querySelector('.custom-cursor');
    window.addEventListener('mousemove', (e) => {
        if (cursor) {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        }
    });

    const addGrowListeners = () => {
        const interactiveElements = document.querySelectorAll(
            'header section, a, button, .contact-link, .card, .modal-circle-btn, .floating-theme-toggle'
        );
        interactiveElements.forEach(item => {
            item.addEventListener('mouseenter', () => cursor && cursor.classList.add('grow'));
            item.addEventListener('mouseleave', () => cursor && cursor.classList.remove('grow'));
        });
    };
    addGrowListeners();

    // Modo Claro / Oscuro
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('.icon') : null;

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) themeIcon.textContent = '';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            if (themeIcon) {
                themeIcon.textContent = isDark ? '' : '';
            }
        });
    }
});
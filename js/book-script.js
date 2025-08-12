class Book3D {
    constructor(containerId, id, spineTitle, cover, backText) {

        // Génération de l'html
        this.html(containerId, id, spineTitle, cover, backText);
        this.book = document.getElementById(id);
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.currentRotationX = 0;
        this.currentRotationY = 0;
        this.sensitivity = 0.5;

         this.init();
    }

    init() {
        // Animation initiale
        this.book.classList.add('initial-animation');

        // Supprimer l'animation après 4 secondes
        setTimeout(() => {
            this.book.classList.remove('initial-animation');
        }, 4000);

        // Événements de souris
        this.book.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));

        // Événements tactiles pour mobile
        this.book.addEventListener('touchstart', this.onTouchStart.bind(this));
        document.addEventListener('touchmove', this.onTouchMove.bind(this));
        document.addEventListener('touchend', this.onTouchEnd.bind(this));

        // Empêcher la sélection de texte
        this.book.addEventListener('selectstart', (e) => e.preventDefault());

        // Empêcher le menu contextuel
        this.book.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    html(containerId, id, title, cover, backText) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Aucune div trouvée avec cet id.');
            return;
        }
        container.innerHTML = `
        <div class="book" id="${id}">
            <div class="face front" style="background-image: url('${cover}')"></div>
            <div class="face back">${backText}</div>
            <div class="face spine">
                <div class="spine-text">${title}</div>
            </div>
            <div class="face top"></div>
            <div class="face bottom"></div>
            <div class="face right"></div>
        </div>`;
    }

    onMouseDown(e) {
        // Tourner uniquement si clic gauche (button === 0)
        if (e.button !== 0) return;

        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.book.style.transition = 'none';

        e.preventDefault();
    }

    onMouseMove(e) {
        if (!this.isDragging) return;

        e.preventDefault();

        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;

        this.currentRotationY += deltaX * this.sensitivity;
        this.currentRotationX -= deltaY * this.sensitivity;

        // Limiter la rotation sur l'axe X pour éviter les retournements étranges
        this.currentRotationX = Math.max(-45, Math.min(45, this.currentRotationX));

        this.updateTransform();

        this.startX = e.clientX;
        this.startY = e.clientY;
    }

    onMouseUp() {
        this.isDragging = false;
        this.book.style.transition = 'transform 0.3s ease-out';

        // Petite animation de rebond
        setTimeout(() => {
            this.book.style.transform += ' scale(1.02)';
            setTimeout(() => {
                this.book.style.transform = this.book.style.transform.replace(' scale(1.02)', '');
            }, 150);
        }, 50);
    }

    // Support tactile
    onTouchStart(e) {
        const touch = e.touches[0];
        this.onMouseDown(touch);
        e.preventDefault();
    }

    onTouchMove(e) {
        const touch = e.touches[0];
        this.onMouseMove(touch);
        e.preventDefault();
    }

    onTouchEnd(e) {
        this.onMouseUp();
        e.preventDefault();
    }

    updateTransform() {
        this.book.style.transform = `rotateY(${this.currentRotationY}deg) rotateX(${this.currentRotationX}deg)`;
    }

    // Méthode pour réinitialiser la rotation
    reset() {
        this.currentRotationX = 0;
        this.currentRotationY = 0;
        this.book.style.transition = 'transform 1s ease';
        this.updateTransform();
    }

    // Méthode pour faire tourner automatiquement
    autoRotate(speed = 1) {
        const rotate = () => {
            if (!this.isDragging) {
                this.currentRotationY += speed;
                this.updateTransform();
            }
            requestAnimationFrame(rotate);
        };
        rotate();
    }
}

// Initialiser le livre 3D au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    /*
    const book3D = new Book3D(
        "newBook", 
        "book", 
        "Les grands Crocodiliens", 
        "./img/book/cover.jpg", 
        "<p>Les grands Crocodiliens<p>" +
        "<p>Une invasion sanglante menace l'Humanité…<p>" +
        "Tangi Talarmin"
    );
    */

    // Ajouter des contrôles optionnels
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'r':
            case 'R':
                book3D.reset();
                break;
            case 'a':
            case 'A':
                book3D.autoRotate(0.5);
                break;
        }
    });
});

// Fonction utilitaire pour créer des effets de particules (optionnel)
function createParticles() {
    const particleCount = 50;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`;

        document.body.appendChild(particle);
        particles.push(particle);
    }

    // Ajouter l'animation CSS pour les particules
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Appeler la fonction de particules (optionnel)
createParticles();

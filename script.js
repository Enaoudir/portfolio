/* --------------------------------------------------------------------------
 * 1. NEURAL MESH CANVAS ANIMATION
 * -------------------------------------------------------------------------- */
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 70;
const maxDistance = 150;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#06b6d4';
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDistance) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(6, 182, 212, ${1 - dist / maxDistance * 0.8})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateCanvas);
}
animateCanvas();

/* --------------------------------------------------------------------------
 * 2. PROJECT FILTERING
 * -------------------------------------------------------------------------- */
function filterProjects(category) {
    const cards = document.querySelectorAll('.project-card');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

/* --------------------------------------------------------------------------
 * 3. VIDEO MODAL LIGHTBOX
 * -------------------------------------------------------------------------- */
function openVideoModal(videoUrl) {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-iframe');
    iframe.src = videoUrl;
    modal.classList.add('active');
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-iframe');
    iframe.src = '';
    modal.classList.remove('active');
}

/* --------------------------------------------------------------------------
 * 4. INTERACTIVE TERMINAL LOGIC
 * -------------------------------------------------------------------------- */
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');

const commands = {
    'help': 'Commandes disponibles:\n - skills : Affiche les compétences clés en IA\n - projects : Liste des projets récents\n - contact : Coordonnées directes\n - clear : Efface l\'écran de la console',
    'skills': 'Compétences Principales:\n [1] Deep Learning: PyTorch, TensorFlow, CUDA\n [2] LLM/NLP: RAG, Fine-Tuning (LoRA), LangChain, vLLM\n [3] Computer Vision: YOLOv9, OpenCV, TensorRT\n [4] MLOps: Kubernetes, Triton Server, MLflow, Docker',
    'projects': 'Projets Phares:\n -> NeuroRAG Enterprise (Système RAG 10M+ docs)\n -> VisionSentinel Edge (Analyse vidéo temps réel)\n -> AutoDeploy LLM Cluster (Infrastructures K8s GPU)',
    'contact': 'Contact Direct:\n Email: aboubacar.ridouane@example.com\n GitHub: github.com/aboubacar-ridouane\n LinkedIn: linkedin.com/in/aboubacar-ridouane',
    'clear': 'CLEAR'
};

terminalInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const inputVal = this.value.trim().toLowerCase();

        // Add command row to output
        const cmdRow = document.createElement('div');
        cmdRow.className = 'terminal-output';
        cmdRow.innerHTML = `<span class="prompt">guest@aboubacar-ai:~$</span> ${this.value}`;
        terminalBody.appendChild(cmdRow);

        // Output result
        if (inputVal === 'clear') {
            terminalBody.innerHTML = '';
        } else if (commands[inputVal]) {
            const resRow = document.createElement('div');
            resRow.className = 'terminal-output';
            resRow.style.color = 'var(--cyan-primary)';
            resRow.textContent = commands[inputVal];
            terminalBody.appendChild(resRow);
        } else if (inputVal !== '') {
            const errRow = document.createElement('div');
            errRow.className = 'terminal-output';
            errRow.style.color = '#ef4444';
            errRow.textContent = `Commande inconnue: '${inputVal}'. Tapez 'help' pour la liste.`;
            terminalBody.appendChild(errRow);
        }

        this.value = '';
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});
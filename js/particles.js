const book = document.querySelector(".book");
const nav = document.querySelector(".nav");
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y) {
    this.x = x;
    this.y = y;

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.radius = Math.random() * 3 + 3;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;

    this.life = 3000;
    this.elapsed = 0;
    }
    
    update(dt) {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.98;
    this.vy *= 0.98;
    this.rotation += this.rotationSpeed;
    this.elapsed += dt;
    }
    
    draw(ctx) {
    const progress = this.elapsed / this.life;
    const alpha = Math.max(1 - progress, 0);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = alpha;

    const spikes = 4;
    const outerRadius = this.radius;
    const innerRadius = outerRadius * 0.5;
    
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
        const r = (i % 2 === 0) ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) {
        ctx.moveTo(x, y);
        } else {
        ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(255, 200, 0, 1)";
    ctx.fill();
    ctx.restore();
    }
}

let particles = [];

let lastTime = 0;

function animate(time) {
    const dt = time - lastTime;
    lastTime = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
    p.update(dt);
    p.draw(ctx);
    });

    particles = particles.filter((p) => p.elapsed < p.life);

    if (particles.length > 0) {
    requestAnimationFrame(animate);
    }
}

function createParticles(x, y) {
    const count = Math.floor(Math.random() * 30) + 50;
    for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y));
    }

    lastTime = performance.now();
    requestAnimationFrame(animate);
}

book.addEventListener("click", (e) => {
  const page = e.target.closest(".page");
  if (!page) return;

  createParticles(e.clientX, e.clientY);

  page.classList.add("tap");
  setTimeout(() => page.classList.remove("tap"), 180);
});

nav.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (!link) return;

  createParticles(e.clientX, e.clientY);

  link.classList.add("tap");
  setTimeout(() => link.classList.remove("tap"), 180);
});
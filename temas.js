
const canvas = document.getElementById("particulas-menu");
const ctx = canvas.getContext("2d");

const reducirMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

let ancho = 0;
let alto = 0;
let puntos = [];
let frame = null;

const cursor = { x: -1000, y: -1000 };

function prepararCanvas() {
    const escala = Math.min(window.devicePixelRatio || 1, 2);

    ancho = window.innerWidth;
    alto = window.innerHeight;

    canvas.width = ancho * escala;
    canvas.height = alto * escala;

    ctx.setTransform(escala, 0, 0, escala, 0, 0);

    const cantidad = Math.min(
        75,
        Math.max(28, Math.floor((ancho * alto) / 16000))
    );

    puntos = Array.from({ length: cantidad }, () => ({
        x: Math.random() * ancho,
        y: Math.random() * alto,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radio: Math.random() * 1.5 + 0.5
    }));

    iniciar();
}

function dibujar() {
    ctx.clearRect(0, 0, ancho, alto);

    for (const p of puntos) {
        if (!reducirMovimiento.matches) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > ancho) p.vx *= -1;
            if (p.y < 0 || p.y > alto) p.vy *= -1;

            const dx = p.x - cursor.x;
            const dy = p.y - cursor.y;
            const distancia = Math.hypot(dx, dy);

            if (distancia > 0 && distancia < 100) {
                p.x += (dx / distancia) * 0.2;
                p.y += (dy / distancia) * 0.2;
            }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(125, 220, 255, 0.8)";
        ctx.fill();
    }

    for (let i = 0; i < puntos.length; i++) {
        for (let j = i + 1; j < puntos.length; j++) {
            const a = puntos[i];
            const b = puntos[j];
            const distancia = Math.hypot(a.x - b.x, a.y - b.y);

            if (distancia < 105) {
                const opacidad = (1 - distancia / 105) * 0.24;

                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(0, 220, 255, ${opacidad})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();
            }
        }
    }

    if (!reducirMovimiento.matches) {
        frame = requestAnimationFrame(dibujar);
    }
}

function iniciar() {
    if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
    }

    dibujar();
}

window.addEventListener("resize", prepararCanvas);

window.addEventListener("pointermove", (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
}, { passive: true });

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        if (frame !== null) {
            cancelAnimationFrame(frame);
            frame = null;
        }
    } else {
        iniciar();
    }
});

prepararCanvas();







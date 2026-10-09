
const canvas = document.getElementById("particulas");
const contexto = canvas.getContext("2d");

const movimientoReducido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

let ancho = 0;
let alto = 0;
let particulas = [];
let animacionId = null;

const cursor = {
    x: -1000,
    y: -1000
};

function ajustarCanvas() {
    const escala = Math.min(window.devicePixelRatio || 1, 2);

    ancho = window.innerWidth;
    alto = window.innerHeight;

    canvas.width = ancho * escala;
    canvas.height = alto * escala;
    canvas.style.width = `${ancho}px`;
    canvas.style.height = `${alto}px`;

    contexto.setTransform(escala, 0, 0, escala, 0, 0);

    const cantidad = Math.min(
        90,
        Math.max(30, Math.floor((ancho * alto) / 14000))
    );

    particulas = Array.from({ length: cantidad }, () => ({
        x: Math.random() * ancho,
        y: Math.random() * alto,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radio: Math.random() * 1.5 + 0.5
    }));

    dibujar();
}

function dibujar() {
    contexto.clearRect(0, 0, ancho, alto);

    for (const p of particulas) {
        if (!movimientoReducido.matches) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > ancho) p.vx *= -1;
            if (p.y < 0 || p.y > alto) p.vy *= -1;
        }

        const dx = p.x - cursor.x;
        const dy = p.y - cursor.y;
        const distanciaCursor = Math.sqrt(dx * dx + dy * dy);

        if (distanciaCursor < 130 && !movimientoReducido.matches) {
            p.x += dx / distanciaCursor * 0.35;
            p.y += dy / distanciaCursor * 0.35;
        }

        contexto.beginPath();
        contexto.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
        contexto.fillStyle = "rgba(120, 225, 255, 0.8)";
        contexto.fill();
    }

    for (let i = 0; i < particulas.length; i++) {
        for (let j = i + 1; j < particulas.length; j++) {
            const a = particulas[i];
            const b = particulas[j];

            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distancia = Math.sqrt(dx * dx + dy * dy);

            if (distancia < 115) {
                const opacidad = (1 - distancia / 115) * 0.28;

                contexto.beginPath();
                contexto.moveTo(a.x, a.y);
                contexto.lineTo(b.x, b.y);
                contexto.strokeStyle =
                    `rgba(0, 210, 255, ${opacidad})`;
                contexto.lineWidth = 0.7;
                contexto.stroke();
            }
        }
    }

    if (!movimientoReducido.matches) {
        animacionId = requestAnimationFrame(dibujar);
    }
}

function iniciarAnimacion() {
    if (animacionId !== null) {
        cancelAnimationFrame(animacionId);
        animacionId = null;
    }

    dibujar();
}

window.addEventListener("resize", ajustarCanvas);

window.addEventListener("pointermove", (evento) => {
    cursor.x = evento.clientX;
    cursor.y = evento.clientY;
}, { passive: true });

window.addEventListener("pointerleave", () => {
    cursor.x = -1000;
    cursor.y = -1000;
});

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        if (animacionId !== null) {
            cancelAnimationFrame(animacionId);
            animacionId = null;
        }
    } else {
        iniciarAnimacion();
    }
});

ajustarCanvas();



const musica = document.getElementById("musicaEspacial");
const botonMusica = document.getElementById("botonMusica");
const volumenMusica = document.getElementById("volumenMusica");

if (musica && botonMusica && volumenMusica) {
    musica.volume = Number(volumenMusica.value);

    botonMusica.addEventListener("click", async () => {
        if (musica.paused) {
            try {
                await musica.play();
                botonMusica.textContent = "⏸ Pausar música";
            } catch (error) {
                botonMusica.textContent = "♫ Intentar reproducir";
                console.error("No se pudo reproducir el audio:", error);
            }
        } else {
            musica.pause();
            botonMusica.textContent = "♫ Activar música";
        }
    });

    volumenMusica.addEventListener("input", () => {
        musica.volume = Number(volumenMusica.value);
    });

    musica.addEventListener("ended", () => {
        botonMusica.textContent = "♫ Activar música";
    });
}

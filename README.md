# VibeBox — prototipo web

Proyecto académico de transformación digital. Landing page + demo interactiva de una
aplicación conceptual de "caja sorpresa digital personalizada".

## Cómo ejecutarlo

Opción A: doble clic en `index.html`.
Opción B (recomendada en VS Code): extensión **Live Server** → clic derecho en
`index.html` → *Open with Live Server*.

No hay backend, base de datos, API, autenticación ni IA. Toda la personalización
está simulada en `script.js`.

## Estructura

```
/
├── index.html      Estructura y contenido
├── style.css       Estilos, paleta y animaciones
├── script.js       Carrusel, demo interactiva, scroll, modal
├── assets/         (opcional) imágenes propias
└── README.md
```

## Sobre las imágenes

El prototipo **no depende de ninguna imagen externa**: las ilustraciones son SVG,
degradados CSS y emojis. Así nada se rompe si un servicio deja de funcionar.

Si quieres sustituirlas por imágenes propias:

1. Guarda los archivos en `assets/` (por ejemplo `assets/slide-1.jpg`).
2. En `index.html`, dentro de cada `<div class="slide__art">`, reemplaza el bloque
   `<div class="slide__emoji">…</div>` por
   `<img src="assets/slide-1.jpg" alt="Descripción">`.
3. En `style.css` puedes añadir `.slide__art img{width:100%;height:100%;object-fit:cover;border-radius:18px}`.

Tamaños sugeridos: slides 1200×700 px, ilustración de la caja 600×600 px.

## Dónde tocar el contenido de la demo

En `script.js`, el objeto `CONTENIDO` guarda las sorpresas de cada categoría y
`RAREZAS` define las probabilidades de cada nivel. Puedes añadir o cambiar
elementos sin tocar nada más.

## Compatibilidad

Probado en resoluciones de móvil, tablet, laptop y escritorio. Respeta
`prefers-reduced-motion` y mantiene foco visible por teclado.

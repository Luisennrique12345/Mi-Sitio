/* ===========================================================
   VibeBox — lógica del prototipo
   Todo simulado en el navegador: sin backend, sin API, sin IA.
   =========================================================== */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ========== 1. HEADER + MENÚ MÓVIL ========== */
  const header = $('#header');
  const nav    = $('#nav');
  const burger = $('#burger');

  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  nav.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ========== 2. CARRUSEL ========== */
  const track  = $('#track');
  const slides = $$('.slide', track);
  const dotsEl = $('#dots');
  let index = 0, timer = null;
  const DELAY = 6000;

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', 'Tarjeta ' + (i + 1));
    b.addEventListener('click', () => { go(i); restart(); });
    dotsEl.appendChild(b);
  });
  const dots = $$('button', dotsEl);

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, n) => d.classList.toggle('is-active', n === index));
    slides.forEach((s, n) => s.setAttribute('aria-hidden', String(n !== index)));
  }
  const next = () => go(index + 1);
  const prev = () => go(index - 1);
  function start()   { if (!reduceMotion) timer = setInterval(next, DELAY); }
  function stop()    { clearInterval(timer); }
  function restart() { stop(); start(); }

  $('#nextSlide').addEventListener('click', () => { next(); restart(); });
  $('#prevSlide').addEventListener('click', () => { prev(); restart(); });

  const carousel = $('#carousel');
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

  // Swipe táctil
  let x0 = null, y0 = null;
  carousel.addEventListener('touchstart', e => {
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; stop();
  }, { passive: true });
  carousel.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? next() : prev();
    x0 = y0 = null; restart();
  });

  // Teclado
  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { next(); restart(); }
    if (e.key === 'ArrowLeft')  { prev(); restart(); }
  });

  go(0); start();

  /* ========== 3. DEMO INTERACTIVA ========== */
  const CAT = {
    juegos:       { emoji: '🎮', nombre: 'Videojuegos' },
    musica:       { emoji: '🎵', nombre: 'Música' },
    cine:         { emoji: '🎬', nombre: 'Películas' },
    libros:       { emoji: '📚', nombre: 'Libros' },
    comida:       { emoji: '🍔', nombre: 'Gastronomía' },
    viajes:       { emoji: '🌎', nombre: 'Viajes' },
    curiosidades: { emoji: '🧠', nombre: 'Curiosidades' },
    arte:         { emoji: '🎨', nombre: 'Arte' }
  };

  // Contenido simulado. Sustituible por cualquier otro catálogo.
  const CONTENIDO = {
    juegos: [
      { t: 'Un indie de 3 horas', d: 'Un juego corto de exploración submarina donde no hay enemigos, solo mapa que completar.' },
      { t: 'Joya retro rescatada', d: 'Un clásico de puzles de los noventa que se juega mejor hoy que entonces.' },
      { t: 'Cooperativo de sofá', d: 'Para dos personas, un mando cada una y cuarenta minutos de caos coordinado.' }
    ],
    musica: [
      { t: 'Un disco entero, sin saltar', d: 'Cuarenta minutos pensados para escucharse en orden. Empieza lento y no avisa cuándo sube.' },
      { t: 'La escena que no conocías', d: 'Tres artistas de la misma ciudad que se producen entre ellos.' },
      { t: 'Versión que supera al original', d: 'Una canción que ya conoces, tocada con otros instrumentos y otra intención.' }
    ],
    cine: [
      { t: 'Ópera prima de culto', d: 'Primera película de una directora que después se hizo famosa por otra cosa.' },
      { t: 'Serie de seis capítulos', d: 'Empieza y termina. Sin temporadas pendientes ni finales colgados.' },
      { t: 'Documental sin narrador', d: 'Solo cámara y silencio. Dura menos de lo que crees.' }
    ],
    libros: [
      { t: 'Novela gráfica de una sentada', d: 'Ciento veinte páginas dibujadas que cuentan más que muchas novelas largas.' },
      { t: 'Ensayo breve y discutible', d: 'Una idea sostenida durante ochenta páginas con la que no vas a estar de acuerdo del todo.' },
      { t: 'Relato para el transporte', d: 'Cuentos de diez minutos, uno por trayecto.' }
    ],
    comida: [
      { t: 'Receta de cuatro ingredientes', d: 'Un plato de cocina del sur de Italia que solo necesita paciencia y una sartén.' },
      { t: 'La técnica que cambia todo', d: 'Un gesto de treinta segundos que mejora cualquier salteado que hagas.' },
      { t: 'Desayuno de otro país', d: 'Lo que se come al despertar a diez mil kilómetros de aquí.' }
    ],
    viajes: [
      { t: 'Ciudad que nadie menciona', d: 'Está a dos horas de una capital famosa y cuesta la mitad.' },
      { t: 'Ruta de un día', d: 'Un recorrido a pie con tres paradas y una vista al final.' },
      { t: 'Viaje en temporada rara', d: 'El mismo destino, otro mes: menos gente y otra luz.' }
    ],
    curiosidades: [
      { t: 'El dato que vas a repetir hoy', d: 'Algo sobre el sueño de los animales marinos que cuesta creer la primera vez.' },
      { t: 'Un error histórico útil', d: 'Un invento que salió mal y terminó resolviendo otro problema.' },
      { t: 'Por qué pasa eso', d: 'La explicación de un fenómeno cotidiano que nunca te detuviste a mirar.' }
    ],
    arte: [
      { t: 'Ilustradora en activo', d: 'Trabaja solo con dos colores y una trama de puntos.' },
      { t: 'Movimiento de tres años', d: 'Duró poco, influyó mucho y casi nadie lo nombra.' },
      { t: 'Una pieza para mirar despacio', d: 'Tiene un detalle en la esquina que cambia todo el cuadro.' }
    ]
  };

  const RAREZAS = [
    { n: '⚪ Común',        p: 40, c: '#C9C6D6' },
    { n: '🟢 Poco común',   p: 27, c: '#4ADE80' },
    { n: '🔵 Rara',         p: 18, c: '#60A5FA' },
    { n: '🟣 Épica',        p: 11, c: '#C084FC' },
    { n: '🟡 Legendaria',   p:  4, c: '#FFB020' }
  ];

  const seleccion = new Set();
  const chipsEl   = $('#chips');
  const createBtn = $('#createBtn');
  const selCount  = $('#selCount');
  const stages    = $$('.demo__stage');
  const stepsEl   = $$('#demoSteps li');
  const loader    = $('#loader');
  const loaderTxt = $('#loaderText');
  const ready     = $('#ready');
  const bigBox    = $('#bigBox');
  const rnd = arr => arr[Math.floor(Math.random() * arr.length)];

  chipsEl.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const cat = chip.dataset.cat;
    if (seleccion.has(cat)) { seleccion.delete(cat); chip.classList.remove('is-on'); }
    else { seleccion.add(cat); chip.classList.add('is-on'); }
    chip.setAttribute('aria-pressed', String(seleccion.has(cat)));
    selCount.textContent = seleccion.size === 1 ? '1 seleccionada' : seleccion.size + ' seleccionadas';
    createBtn.disabled = seleccion.size === 0;
  });

  function showStage(n) {
    stages.forEach(s => s.classList.toggle('is-visible', Number(s.dataset.stage) === n));
    stepsEl.forEach(li => {
      const s = Number(li.dataset.step);
      li.classList.toggle('is-active', s === n);
      li.classList.toggle('is-done', s < n);
    });
  }

  const MENSAJES = [
    'Leyendo tus gustos…',
    'Cruzando categorías…',
    'Buscando algo que no esperes…',
    'Sellando la caja…'
  ];

  createBtn.addEventListener('click', () => {
    showStage(2);
    loader.hidden = false;
    ready.hidden = true;
    let i = 0;
    loaderTxt.textContent = MENSAJES[0];
    const msgTimer = setInterval(() => {
      i = (i + 1) % MENSAJES.length;
      loaderTxt.textContent = MENSAJES[i];
    }, 700);

    setTimeout(() => {
      clearInterval(msgTimer);
      loader.hidden = true;
      ready.hidden = false;
      bigBox.classList.remove('is-open');
      $('#readyTags').textContent = 'Preparada con: ' +
        Array.from(seleccion).map(c => CAT[c].emoji + ' ' + CAT[c].nombre).join(' · ');
    }, reduceMotion ? 300 : 2600);
  });

  function elegirRareza() {
    let r = Math.random() * 100;
    for (const rar of RAREZAS) { if ((r -= rar.p) <= 0) return rar; }
    return RAREZAS[0];
  }

  function generarSorpresa() {
    const cats = Array.from(seleccion);
    const principal = rnd(cats);
    const item = rnd(CONTENIDO[principal]);
    const otras = cats.filter(c => c !== principal);
    const secundaria = otras.length ? rnd(otras) : null;

    const emojis = secundaria
      ? CAT[principal].emoji + CAT[secundaria].emoji
      : CAT[principal].emoji;

    const rareza = elegirRareza();
    const match = 74 + Math.floor(Math.random() * 25); // 74–98 %

    const why = secundaria
      ? `Elegido por tu interés en ${CAT[principal].nombre.toLowerCase()}, con un guiño a ${CAT[secundaria].nombre.toLowerCase()}.`
      : `Elegido por tu interés en ${CAT[principal].nombre.toLowerCase()}. Añade más categorías para recibir combinaciones.`;

    $('#revealEmoji').textContent = emojis;
    $('#revealTitle').textContent = item.t;
    $('#revealText').textContent  = item.d;
    $('#revealWhy').textContent   = why;
    $('#matchVal').textContent    = match + '%';

    const rarEl = $('#rarity');
    rarEl.textContent = rareza.n;
    rarEl.style.color = rareza.c;

    $$('.rate__btn').forEach(b => b.classList.remove('is-picked'));
    $('#rateFeedback').hidden = true;
  }

  $('#openBtn').addEventListener('click', () => {
    bigBox.classList.add('is-open');
    setTimeout(() => { generarSorpresa(); showStage(3); }, reduceMotion ? 50 : 650);
  });

  $('#rate').addEventListener('click', e => {
    const b = e.target.closest('.rate__btn');
    if (!b) return;
    $$('.rate__btn').forEach(x => x.classList.remove('is-picked'));
    b.classList.add('is-picked');
    const msgs = {
      love: 'Anotado. Verás más cosas de esta línea en tus próximas cajas.',
      ok:   'Anotado. Mantendremos la categoría, pero cambiaremos el tono.',
      no:   'Anotado. Este tipo de contenido bajará de prioridad.'
    };
    const fb = $('#rateFeedback');
    fb.textContent = msgs[b.dataset.rate];
    fb.hidden = false;
  });

  $('#againBtn').addEventListener('click', () => {
    showStage(2);
    loader.hidden = true;
    ready.hidden = false;
    bigBox.classList.remove('is-open');
  });

  $('#resetBtn').addEventListener('click', () => {
    seleccion.clear();
    $$('.chip').forEach(c => { c.classList.remove('is-on'); c.setAttribute('aria-pressed', 'false'); });
    selCount.textContent = '0 seleccionadas';
    createBtn.disabled = true;
    showStage(1);
  });

  /* ========== 4. MODAL "DESCARGAR" ========== */
  const modal = $('#modal');
  let lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.modal__x', modal).focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  $$('[data-open-modal]').forEach(b => b.addEventListener('click', openModal));
  $$('[data-close-modal]').forEach(b => b.addEventListener('click', closeModal));
  // Mostrar el modal automáticamente al entrar a la página
setTimeout(() => {
  openModal();
}, 300);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  // Enlaces legales simulados
  $$('[data-legal]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const t = $('#modalTitle');
    t.textContent = a.dataset.legal === 'privacidad'
      ? 'Política de privacidad'
      : 'Términos y condiciones';
    $('.modal__card p', modal).textContent =
      'Este prototipo no recoge, almacena ni envía datos personales. Todo lo que ocurre en la demo se queda en tu navegador.';
    openModal();
  }));

  /* ========== 5. SCROLL: dock, volver arriba, header ========== */
  const dock  = $('#sidedock');
  const toTop = $('#toTop');

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('is-stuck', y > 30);
    dock.classList.toggle('is-visible', y > 700);
    toTop.classList.toggle('is-visible', y > 900);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ========== 6. SCROLLSPY ========== */
  const navLinks = $$('.nav a');
  const targets  = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && targets.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        navLinks.forEach(a =>
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(t => spy.observe(t));
  }

  /* ========== 7. APARICIÓN DE SECCIONES ========== */
  const revealables = $$('.sec-head, .cat, .pillar, .reward, .col, .loop, .rar, .final__inner, .hero__copy, .hero__phone');
  if ('IntersectionObserver' in window && !reduceMotion) {
    revealables.forEach((el, i) => {
      el.classList.add('will-reveal');
      el.style.transitionDelay = (i % 6) * 60 + 'ms';
    });
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); obs.unobserve(en.target); }
      });
    }, { threshold: .15 });
    revealables.forEach(el => io.observe(el));
  }

  /* ========== 8. CONTADORES ========== */
  const counters = $$('.count');
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const end = Number(el.dataset.count);
        if (reduceMotion) { el.textContent = end; obs.unobserve(el); return; }
        const dur = 1100;
        const t0 = performance.now();
        (function tick(now) {
          const p = Math.min((now - t0) / dur, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
        obs.unobserve(el);
      });
    }, { threshold: .6 });
    counters.forEach(c => co.observe(c));
  }

  /* ========== 9. ACCESIBILIDAD DE LOS CHIPS ========== */
  $$('.chip').forEach(c => { c.setAttribute('aria-pressed', 'false'); c.type = 'button'; });
})();

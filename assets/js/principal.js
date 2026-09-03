/* ===========================================================
   KAFFA CAFÉ — Ejemplo del plan Profesional
   1. Menú móvil
   2. Resaltado de la sección activa en el menú
   3. Comparador antes / después
   4. Carrusel de testimonios
   5. Fecha mínima del formulario y año del pie
   =========================================================== */
(function () {
  'use strict';

  /* ---------- 1. Menú móvil ---------- */
  var boton = document.getElementById('hamburguesa');
  var menu  = document.getElementById('menu');

  function cerrarMenu() {
    menu.removeAttribute('data-abierto');
    boton.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('sin-scroll');
  }

  if (boton && menu) {
    boton.addEventListener('click', function () {
      var abierto = menu.hasAttribute('data-abierto');
      if (abierto) {
        cerrarMenu();
      } else {
        menu.setAttribute('data-abierto', '');
        boton.setAttribute('aria-expanded', 'true');
        document.documentElement.classList.add('sin-scroll');
      }
    });

    // Al tocar un enlace se cierra solo.
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) cerrarMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.hasAttribute('data-abierto')) {
        cerrarMenu();
        boton.focus();
      }
    });
  }

  /* ---------- 2. Sección activa en el menú ---------- */
  var enlaces = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var secciones = enlaces
    .map(function (a) { return document.getElementById(a.getAttribute('data-nav')); })
    .filter(Boolean);

  function marcar(id) {
    enlaces.forEach(function (a) {
      if (a.getAttribute('data-nav') === id) {
        a.setAttribute('aria-current', 'true');
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  if (secciones.length) {
    // Estado inicial: la primera sección queda marcada desde que carga la
    // página, sin esperar a que el visitante haga scroll.
    marcar(secciones[0].id);

    if ('IntersectionObserver' in window) {
      var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) marcar(entrada.target.id);
        });
      }, { rootMargin: '-45% 0px -50% 0px' });

      secciones.forEach(function (s) { observador.observe(s); });
    }
  }

  /* ---------- 3. Comparador antes / después ---------- */
  document.querySelectorAll('.comparador').forEach(function (comp) {
    var control = comp.querySelector('.comparador__control');
    if (!control) return;

    function pintar() {
      comp.style.setProperty('--pos', control.value + '%');
    }

    control.addEventListener('input', pintar);
    pintar();
  });

  /* ---------- 4. Carrusel de testimonios ---------- */
  var pista = document.getElementById('pista');

  if (pista) {
    var slides = Array.prototype.slice.call(pista.querySelectorAll('.testimonio'));
    var puntos = document.getElementById('puntos');
    var actual = 0;

    // Los puntos se generan según cuántos testimonios haya en el HTML.
    slides.forEach(function (_, i) {
      var p = document.createElement('button');
      p.type = 'button';
      p.setAttribute('role', 'tab');
      p.setAttribute('aria-label', 'Testimonio ' + (i + 1));
      p.addEventListener('click', function () { mostrar(i); });
      puntos.appendChild(p);
    });

    var listaPuntos = Array.prototype.slice.call(puntos.children);

    function mostrar(i) {
      actual = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        if (n === actual) {
          s.setAttribute('data-activo', '');
        } else {
          s.removeAttribute('data-activo');
        }
      });
      listaPuntos.forEach(function (p, n) {
        p.setAttribute('aria-selected', n === actual ? 'true' : 'false');
      });
    }

    document.getElementById('anterior').addEventListener('click', function () { mostrar(actual - 1); });
    document.getElementById('siguiente').addEventListener('click', function () { mostrar(actual + 1); });

    // Flechas del teclado cuando el carrusel tiene el foco dentro.
    document.getElementById('carrusel').addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { mostrar(actual - 1); }
      if (e.key === 'ArrowRight') { mostrar(actual + 1); }
    });

    mostrar(0);
  }

  /* ---------- 5. WhatsApp según el contexto ----------
     El botón flotante acompaña al visitante por toda la página, así que el
     mensaje que lleva escrito cambia según la sección que esté leyendo.
     La etiqueta para lectores de pantalla NO cambia a propósito: describe el
     botón, y reescribirla en cada scroll haría que se anunciara sin parar. */
  var WHATSAPP = '50661612746';

  function enlaceWA(texto) {
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);
  }

  var flotante = document.querySelector('.flotante');

  if (flotante) {
    var GENERAL = 'Hola Kaffa, buenas. Quisiera información.';
    var POR_SECCION = {
      servicios:   'Hola Kaffa, quisiera información sobre lo que ofrecen.',
      portafolio:  'Hola Kaffa, vi las fotos del café y quisiera información.',
      reservar:    'Hola Kaffa, quiero reservar una mesa o un taller.'
    };
    var conId = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
    var ultimo = '';

    function pintarFlotante() {
      var y = window.scrollY + 140, activa = null;
      conId.forEach(function (s) { if (s.offsetTop <= y) activa = s; });
      var texto = (activa && POR_SECCION[activa.id]) || GENERAL;
      if (texto === ultimo) return;   // no se reescribe el href en cada scroll
      ultimo = texto;
      flotante.href = enlaceWA(texto);
    }

    window.addEventListener('scroll', pintarFlotante, { passive: true });
    pintarFlotante();
  }

  /* ---------- Código de reserva ----------
     Se genera uno por visita y acompaña al pedido en los tres lados: el envío
     del formulario, el mensaje de WhatsApp y la página de gracias. Así, cuando
     el cliente escribe, Kaffa ya sabe de qué reserva habla.
     Se omiten 0/O y 1/I porque el código se dicta por teléfono. */
  var codigo = document.getElementById('codigo');
  var LETRAS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var CLAVE_CODIGO = 'kaffa-codigo-reserva';

  function generarCodigo() {
    var h = new Date();
    var dia = String(h.getDate()).padStart(2, '0') + String(h.getMonth() + 1).padStart(2, '0');
    var azar = '';
    for (var i = 0; i < 4; i++) azar += LETRAS[Math.floor(Math.random() * LETRAS.length)];
    return 'KF-' + dia + '-' + azar;
  }

  if (codigo) {
    // Se guarda en la sesión para que no cambie si recarga a medio llenar,
    // y para que /gracias/ pueda mostrárselo después de enviar.
    var guardado = '';
    try { guardado = sessionStorage.getItem(CLAVE_CODIGO) || ''; } catch (e) {}
    if (!guardado) {
      guardado = generarCodigo();
      try { sessionStorage.setItem(CLAVE_CODIGO, guardado); } catch (e) {}
    }
    codigo.value = guardado;
  }

  function textoCodigo() {
    return codigo && codigo.value && codigo.value !== '—' ? ' (reserva ' + codigo.value + ')' : '';
  }

  // El enlace de WhatsApp del formulario recoge lo que ya escogió en "motivo",
  // para que no tenga que repetirlo en el chat.
  var chat = document.getElementById('chatReserva');
  var motivo = document.getElementById('motivo');

  if (chat && motivo) {
    var POR_MOTIVO = {
      'Mesa':                      'Hola Kaffa, quiero reservar una mesa.',
      'Cata guiada':               'Hola Kaffa, quiero reservar una cata guiada.',
      'Taller de Vandola':         'Hola Kaffa, quiero reservar un taller de Vandola.',
      'Pedido de café en grano':   'Hola Kaffa, quiero hacer un pedido de café en grano.',
      'Evento privado':            'Hola Kaffa, quiero consultar por un evento privado.'
    };

    function pintarChat() {
      var base = POR_MOTIVO[motivo.value] || 'Hola Kaffa, quiero reservar una mesa o un taller.';
      chat.href = enlaceWA(base.replace(/\.$/, '') + textoCodigo() + '.');
    }
    motivo.addEventListener('change', pintarChat);
    pintarChat();
  }

  /* ---------- 6. Formulario y pie ---------- */
  // No se pueden pedir reservas para ayer.
  var fecha = document.getElementById('fecha');
  if (fecha) {
    var hoy = new Date();
    var mes = String(hoy.getMonth() + 1).padStart(2, '0');
    var dia = String(hoy.getDate()).padStart(2, '0');
    fecha.min = hoy.getFullYear() + '-' + mes + '-' + dia;
  }

  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();

})();

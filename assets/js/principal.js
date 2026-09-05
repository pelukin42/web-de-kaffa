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
      reservar:    'Hola Kaffa, quiero reservar una mesa.',
      'menu-impreso': 'Hola Kaffa, vi el menú y quisiera hacer una consulta.'
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
     Nace cuando hay una reserva de verdad: al enviar el formulario o al abrir
     el chat de WhatsApp. Antes de eso no existe, porque antes no hay reserva.

     Contra choques entre dos clientes simultáneos: el código lleva el día y el
     mes más cinco caracteres sacados de crypto.getRandomValues, que es
     aleatoriedad de verdad y no Math.random. Son 32^5 combinaciones por día,
     unos 33 millones; para el volumen de un café el choque es despreciable.
     Se omiten 0/O y 1/I porque el código se dicta por teléfono. */
  var codigo = document.getElementById('codigo');
  var forma  = document.getElementById('formaReserva');
  var LETRAS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var CLAVE_CODIGO = 'kaffa-codigo-reserva';

  function azar(n) {
    var salida = '', i;
    if (window.crypto && window.crypto.getRandomValues) {
      var bytes = new Uint8Array(n);
      window.crypto.getRandomValues(bytes);
      for (i = 0; i < n; i++) salida += LETRAS[bytes[i] % LETRAS.length];
    } else {
      for (i = 0; i < n; i++) salida += LETRAS[Math.floor(Math.random() * LETRAS.length)];
    }
    return salida;
  }

  // Se guarda en la sesión para que el mismo visitante no genere dos códigos
  // distintos si envía el formulario y además escribe por WhatsApp.
  function codigoReserva() {
    var c = '';
    try { c = sessionStorage.getItem(CLAVE_CODIGO) || ''; } catch (e) {}
    if (!c) {
      var h = new Date();
      c = 'KF-' + String(h.getDate()).padStart(2, '0') +
                  String(h.getMonth() + 1).padStart(2, '0') + '-' + azar(5);
      try { sessionStorage.setItem(CLAVE_CODIGO, c); } catch (e) {}
    }
    return c;
  }

  /* La descripción corta de la reserva: motivo, cuándo y cuántos. Va junto al
     código para que Kaffa entienda la solicitud de un vistazo, y para que el
     cliente vea en /gracias/ qué fue lo que pidió. */
  var resumen = document.getElementById('resumen');
  var DIAS  = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
               'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'];
  var CLAVE_RESUMEN = 'kaffa-resumen-reserva';

  // Con las partes y no con new Date(cadena): esa forma la interpreta como UTC
  // y en Costa Rica (UTC−6) devuelve el día anterior.
  function fechaLarga(valor) {
    var p = valor.split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return DIAS[d.getDay()] + ' ' + d.getDate() + ' de ' + MESES[d.getMonth()];
  }

  function valor(id) {
    var el = document.getElementById(id);
    return el && el.value ? el.value.trim() : '';
  }

  function resumenReserva() {
    var partes = [];
    var motivo = valor('motivo');
    var fecha  = valor('fecha');
    var hora   = valor('hora');
    var gente  = valor('personas');

    if (motivo) partes.push(motivo);
    if (fecha)  partes.push(fechaLarga(fecha) + (hora ? ', ' + hora : ''));
    else if (hora) partes.push(hora);
    if (gente)  partes.push(gente + (gente === '1' ? ' persona' : ' personas'));

    return partes.join(' · ');
  }

  if (forma && codigo) {
    forma.addEventListener('submit', function () {
      codigo.value = codigoReserva();
      var texto = resumenReserva();
      if (resumen) resumen.value = texto;
      // /gracias/ lo lee de aquí para mostrárselo al cliente.
      try { sessionStorage.setItem(CLAVE_RESUMEN, texto); } catch (e) {}
    });
  }

  // El enlace de WhatsApp del formulario recoge lo que ya escogió en "motivo",
  // para que no tenga que repetirlo en el chat.
  var chat = document.getElementById('chatReserva');
  var motivo = document.getElementById('motivo');

  if (chat && motivo) {
    var POR_MOTIVO = {
      'Mesa':                      'Hola Kaffa, quiero reservar una mesa.',
      'Grupo grande':              'Hola Kaffa, quiero reservar para un grupo grande.',
      'Evento privado':            'Hola Kaffa, quiero consultar por un evento privado.',
      'Pedido de café en grano':   'Hola Kaffa, quiero hacer un pedido de café en grano.'
    };

    function pintarChat() {
      var base = POR_MOTIVO[motivo.value] || 'Hola Kaffa, quiero reservar una mesa.';
      var detalle = resumenReserva();
      var texto = base.replace(/\.$/, '');
      // Si ya llenó fecha, hora o personas, el chat abre con todo eso puesto.
      if (detalle && detalle !== motivo.value) texto += '.\n\nDetalle: ' + detalle;
      else texto += '.';
      chat.href = enlaceWA(texto + '\n\nReserva ' + codigoReserva() + '.');
    }
    // Se arma al hacer clic para no crear un código a quien solo mira la página.
    chat.addEventListener('click', pintarChat);
    motivo.addEventListener('change', function () {
      if (chat.href.indexOf('reserva') !== -1) pintarChat();
    });
  }

  /* ---------- Qué se sirve a esta hora ----------
     La portada dice que aquí se desayuna, se almuerza y se toma café. Esto
     dice cuál de las tres está pasando en este momento, con la hora de Costa
     Rica (UTC−6, sin horario de verano) para que dé igual desde dónde miren.
     Horario: lunes a sábado 8–20, domingo 8–19.
     El desayuno se sirve hasta las 11:45, así que aquí se cuentan minutos
     y no solo horas. */
  var ahora = document.getElementById('ahora');

  if (ahora) {
    var d = new Date();
    var cr = new Date(d.getTime() + (d.getTimezoneOffset() - 360) * 60000);
    var minuto = cr.getHours() * 60 + cr.getMinutes();
    var cierra = (cr.getDay() === 0 ? 19 : 20) * 60;
    var texto;

    if (minuto < 8 * 60 || minuto >= cierra) {
      texto = 'Cerrado ahora · abrimos a las 8 a. m.';
    } else if (minuto < 11 * 60 + 45) {
      texto = 'Ahora se está sirviendo el desayuno';
    } else if (minuto < 15 * 60) {
      texto = 'Ahora se está sirviendo el almuerzo';
    } else {
      texto = 'Ahora: café recién colado y repostería';
    }

    document.getElementById('ahoraTexto').textContent = texto;
    ahora.hidden = false;
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

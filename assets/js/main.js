/* ===========================================================
   KAFFA CAFÉ — comportamiento del sitio
   Sin dependencias. Todo corre en el navegador del visitante.
   =========================================================== */
(function () {
  'use strict';

  var WHATSAPP = '50661612746';
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Colones ---------- */
  function colones(n) {
    return '₡' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  /* ---------- Hora de Costa Rica (UTC-6, sin horario de verano) ---------- */
  function ahoraCR() {
    var d = new Date();
    return new Date(d.getTime() + d.getTimezoneOffset() * 60000 - 6 * 3600000);
  }

  /* =========================================================
     1. Logo: usa el PNG oficial si existe; si no, el vectorial
     ========================================================= */
  (function logo() {
    var png = $('#logoPng'), svg = $('#logoSvg');
    if (!png || !svg) return;
    // Ojo: en SVG el atributo `hidden` no se refleja como propiedad, hay que quitarlo.
    function alVector() { png.remove(); svg.removeAttribute('hidden'); }
    if (png.complete) { if (!png.naturalWidth) alVector(); }
    else { png.addEventListener('error', alVector); }
  }());

  /* =========================================================
     2. Navegación
     ========================================================= */
  (function navegacion() {
    var nav = $('#nav'), ham = $('#hamburguesa'), menu = $('#menu');
    var enlaces = $$('#menu a[href^="#"]');
    var secciones = enlaces.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);

    /* El botón flotante de WhatsApp cambia el mensaje según la sección que
       se esté leyendo: en la carta pregunta por precios, en la tienda arranca
       un pedido, en Visítanos reserva mesa. Si la sección no está en la lista
       se usa el mensaje general.
       La etiqueta para lectores de pantalla NO cambia a propósito: describe el
       botón, y cambiarla en cada scroll haría que se anunciara sin parar. */
    var flotante = $('#flotante');
    var MENSAJE_GENERAL = 'Hola Kaffa, buenas. Quisiera información.';
    var MENSAJES = {
      vandola:      'Hola Kaffa, me interesa la Vandola. ¿Me cuentan cómo funciona y cuánto vale?',
      carta:        'Hola Kaffa, ¿me confirman los precios y el plato del día?',
      competencias: 'Hola Kaffa, quiero información del Campeonato Nacional de Vandola.',
      tienda:       'Hola Kaffa, quiero hacer un pedido de café para llevar.',
      visitanos:    'Hola Kaffa, quiero reservar una mesa.'
    };
    var ultimoMensaje = '';

    function pintarFlotante(id) {
      if (!flotante) return;
      var texto = MENSAJES[id] || MENSAJE_GENERAL;
      if (texto === ultimoMensaje) return;   // no se reescribe el href en cada scroll
      ultimoMensaje = texto;
      flotante.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);
    }

    function alScroll() {
      nav.classList.toggle('esta-fija', window.scrollY > 40);
      var y = window.scrollY + 140, activa = null;
      secciones.forEach(function (s) { if (s.offsetTop <= y) activa = s; });
      enlaces.forEach(function (a) {
        a.classList.toggle('activo', !!activa && a.getAttribute('href') === '#' + activa.id);
      });
      pintarFlotante(activa && activa.id);
    }
    window.addEventListener('scroll', alScroll, { passive: true });
    alScroll();

    function cerrar() { nav.classList.remove('abierto'); ham.setAttribute('aria-expanded', 'false'); }
    ham.addEventListener('click', function () {
      var abierto = nav.classList.toggle('abierto');
      ham.setAttribute('aria-expanded', String(abierto));
      ham.setAttribute('aria-label', abierto ? 'Cerrar el menú' : 'Abrir el menú');
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) cerrar(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });
  }());

  /* =========================================================
     3. ¿Abierto ahora?
     ========================================================= */
  (function estado() {
    var caja = $('#estado'), texto = $('#estadoTexto');
    if (!caja) return;

    // día 0 = domingo. [apertura, cierre] en horas.
    var HORARIO = { 0: [8, 19], 1: [8, 20], 2: [8, 20], 3: [8, 20], 4: [8, 20], 5: [8, 20], 6: [8, 20] };

    function reloj(h) {
      var sufijo = h < 12 ? 'a. m.' : 'p. m.';
      var hh = h % 12 === 0 ? 12 : h % 12;
      return hh + ':00 ' + sufijo;
    }

    function pintar() {
      var cr = ahoraCR();
      var dia = cr.getDay();
      var minutos = cr.getHours() * 60 + cr.getMinutes();
      var franja = HORARIO[dia];
      var abre = franja[0] * 60, cierra = franja[1] * 60;

      if (minutos >= abre && minutos < cierra) {
        caja.classList.remove('cerrado');
        texto.textContent = 'Abierto ahora · cerramos a las ' + reloj(franja[1]);
      } else {
        caja.classList.add('cerrado');
        if (minutos < abre) {
          texto.textContent = 'Cerrado · abrimos hoy a las ' + reloj(franja[0]);
        } else {
          var manana = HORARIO[(dia + 1) % 7];
          texto.textContent = 'Cerrado · abrimos mañana a las ' + reloj(manana[0]);
        }
      }

      // Resalta la fila del día en la tabla de horarios
      $$('#horario > div').forEach(function (fila) {
        fila.classList.toggle('hoy', Number(fila.dataset.dia) === dia);
      });
    }

    pintar();
    setInterval(pintar, 60000);
  }());

  /* =========================================================
     4. Pestañas de la carta
     ========================================================= */
  (function carta() {
    var pestanas = $$('.pestana');
    if (!pestanas.length) return;

    function abrir(p) {
      pestanas.forEach(function (otra) {
        var activa = otra === p;
        otra.setAttribute('aria-selected', String(activa));
        var panel = document.getElementById(otra.getAttribute('aria-controls'));
        if (panel) panel.hidden = !activa;
      });
    }

    pestanas.forEach(function (p, i) {
      p.addEventListener('click', function () { abrir(p); });
      p.addEventListener('keydown', function (e) {
        var salto = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!salto) return;
        e.preventDefault();
        var sig = pestanas[(i + salto + pestanas.length) % pestanas.length];
        sig.focus(); abrir(sig);
      });
    });
  }());

  /* =========================================================
     5. Cuenta regresiva del campeonato
     ========================================================= */
  (function campeonato() {
    var caja = $('#cuenta');
    if (!caja) return;
    var meta = new Date(caja.dataset.fecha).getTime();
    var pie = $('#cuentaPie');
    var campos = { d: $('#cDias'), h: $('#cHoras'), m: $('#cMin'), s: $('#cSeg') };

    function dos(n) { return n < 10 ? '0' + n : String(n); }

    function tic() {
      var falta = meta - Date.now();
      if (falta <= 0) {
        campos.d.textContent = campos.h.textContent = campos.m.textContent = campos.s.textContent = '00';
        if (pie) pie.textContent = 'El campeonato ya arrancó';
        clearInterval(reloj);
        return;
      }
      var s = Math.floor(falta / 1000);
      campos.d.textContent = String(Math.floor(s / 86400));
      campos.h.textContent = dos(Math.floor(s / 3600) % 24);
      campos.m.textContent = dos(Math.floor(s / 60) % 60);
      campos.s.textContent = dos(s % 60);
    }

    tic();
    var reloj = setInterval(tic, 1000);
  }());

  /* =========================================================
     6. Tienda y carrito
     ========================================================= */
  (function tienda() {
    var LLAVE = 'kaffa-pedido';
    var pedido = [];

    try { pedido = JSON.parse(localStorage.getItem(LLAVE)) || []; } catch (e) { pedido = []; }

    var lista   = $('#listaCarrito');
    var totalEl = $('#totalCarrito');
    var enlaceWA = $('#pedirWhatsApp');
    var cajon   = $('#carrito');
    var telon   = $('#telon');
    var conteos = [$('#conteoCarrito'), $('#conteoCarrito2')].filter(Boolean);

    function guardar() {
      try { localStorage.setItem(LLAVE, JSON.stringify(pedido)); } catch (e) { /* modo privado */ }
    }

    /* --- Precio visible de cada tarjeta --- */
    function precioDe(tarjeta) {
      var elegido = tarjeta.querySelector('.ficha[data-precio][aria-pressed="true"]');
      return elegido ? Number(elegido.dataset.precio) : 0;
    }

    function variantesDe(tarjeta) {
      return $$('.fichas', tarjeta).map(function (grupo) {
        var f = grupo.querySelector('.ficha[aria-pressed="true"]');
        return f ? f.dataset.valor : null;
      }).filter(Boolean);
    }

    function refrescarPrecio(tarjeta) {
      var vista = tarjeta.querySelector('[data-precio-vista]');
      if (vista) vista.textContent = colones(precioDe(tarjeta));
    }

    $$('[data-producto]').forEach(function (tarjeta) {
      $$('.fichas', tarjeta).forEach(function (grupo) {
        grupo.addEventListener('click', function (e) {
          var ficha = e.target.closest('.ficha');
          if (!ficha) return;
          $$('.ficha', grupo).forEach(function (f) { f.setAttribute('aria-pressed', String(f === ficha)); });
          refrescarPrecio(tarjeta);
        });
      });

      var boton = tarjeta.querySelector('[data-agregar]');
      if (boton) boton.addEventListener('click', function () {
        agregar({
          nombre: tarjeta.dataset.nombre,
          variantes: variantesDe(tarjeta),
          precio: precioDe(tarjeta)
        });
        boton.textContent = 'Agregado';
        setTimeout(function () { boton.textContent = 'Agregar'; }, 1200);
      });

      refrescarPrecio(tarjeta);
    });

    /* --- Operaciones del pedido --- */
    function agregar(art) {
      var id = art.nombre + '|' + art.variantes.join('|');
      var ya = pedido.filter(function (l) { return l.id === id; })[0];
      if (ya) ya.cant += 1;
      else pedido.push({ id: id, nombre: art.nombre, variantes: art.variantes, precio: art.precio, cant: 1 });
      pintar();
      abrirCajon();
    }

    function cambiar(id, delta) {
      var l = pedido.filter(function (x) { return x.id === id; })[0];
      if (!l) return;
      l.cant += delta;
      if (l.cant < 1) pedido = pedido.filter(function (x) { return x.id !== id; });
      pintar();
    }

    function quitar(id) {
      pedido = pedido.filter(function (x) { return x.id !== id; });
      pintar();
    }

    function total() {
      return pedido.reduce(function (s, l) { return s + l.precio * l.cant; }, 0);
    }

    /* --- Entrega y regalo ---
       Se guarda aparte del pedido para que al volver no haya que repetirlo. */
    var LLAVE_ENTREGA = LLAVE + '-entrega';
    var cajaEntrega   = $('#entrega');
    var campoRecoger  = $('#campoRecoger');
    var campoZona     = $('#campoZona');
    var zonaEtiqueta  = $('#zonaEtiqueta');
    var zona          = $('#zona');
    var diaRecoge     = $('#diaRecoge');
    var esRegalo      = $('#esRegalo');
    var campoDedic    = $('#campoDedicatoria');
    var dedicatoria   = $('#dedicatoria');
    var radios        = $$('input[name="entrega"]');

    var ETIQUETAS = {
      recoger:    'Recoger en el café',
      gam:        'Envío dentro del GAM',
      encomienda: 'Encomienda al resto del país'
    };
    // Cada modo pide un dato distinto; encomienda necesita provincia y cantón.
    var CAMPO_ZONA = {
      gam:        { etiqueta: 'Distrito o barrio',  ejemplo: 'Moravia, San Vicente' },
      encomienda: { etiqueta: 'Provincia y cantón', ejemplo: 'Puntarenas, Esparza' }
    };

    var DIAS  = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
                 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'];

    // Se arma la fecha con las partes, no con new Date(cadena): esa forma la
    // interpreta como UTC y en Costa Rica (UTC−6) devolvía el día anterior.
    function fechaLarga(valor) {
      var p = valor.split('-');
      var d = new Date(+p[0], +p[1] - 1, +p[2]);
      return DIAS[d.getDay()] + ' ' + d.getDate() + ' de ' + MESES[d.getMonth()];
    }

    function modoEntrega() {
      var marcado = radios.filter(function (r) { return r.checked; })[0];
      return marcado ? marcado.value : 'recoger';
    }

    function guardarEntrega() {
      try {
        localStorage.setItem(LLAVE_ENTREGA, JSON.stringify({
          modo: modoEntrega(),
          dia: diaRecoge.value,
          zona: zona.value,
          regalo: esRegalo.checked,
          dedicatoria: dedicatoria.value
        }));
      } catch (e) { /* modo privado */ }
    }

    function pintarEntrega() {
      var modo = modoEntrega();
      var conf = CAMPO_ZONA[modo];

      campoRecoger.hidden = modo !== 'recoger';
      campoZona.hidden    = !conf;
      if (conf) {
        zonaEtiqueta.textContent = conf.etiqueta;
        zona.placeholder = conf.ejemplo;
      }
      campoDedic.hidden = !esRegalo.checked;
    }

    function resumenEntrega() {
      var modo = modoEntrega();
      var t = '\nEntrega: ' + ETIQUETAS[modo] + '\n';

      if (modo === 'recoger' && diaRecoge.value) {
        t += 'Pasa el: ' + fechaLarga(diaRecoge.value) + '\n';
      }
      if (CAMPO_ZONA[modo]) {
        if (zona.value.trim()) t += 'Zona: ' + zona.value.trim() + '\n';
        t += 'Envío: pendiente de cotizar\n';
      }
      if (esRegalo.checked) {
        t += '\nEs para regalo.\n';
        if (dedicatoria.value.trim()) t += 'Dedicatoria: "' + dedicatoria.value.trim() + '"\n';
      }
      return t;
    }

    function mensaje() {
      if (!pedido.length) return 'Hola Kaffa, buenas.';
      var t = 'Hola Kaffa, quiero hacer este pedido:\n\n';
      pedido.forEach(function (l) {
        t += '• ' + l.cant + ' × ' + l.nombre;
        if (l.variantes.length) t += ' (' + l.variantes.join(', ') + ')';
        t += ' — ' + colones(l.precio * l.cant) + '\n';
      });
      t += '\nTotal estimado: ' + colones(total()) + '\n';
      t += resumenEntrega();
      t += '\nMi nombre es: ';
      return t;
    }

    function refrescarEnlace() {
      enlaceWA.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(mensaje());
    }

    (function arrancarEntrega() {
      // No se puede pedir que se lo guarden para ayer.
      var hoy = ahoraCR();
      diaRecoge.min = hoy.getFullYear() + '-' +
        String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
        String(hoy.getDate()).padStart(2, '0');

      try {
        var g = JSON.parse(localStorage.getItem(LLAVE_ENTREGA)) || {};
        radios.forEach(function (r) { r.checked = r.value === (g.modo || 'recoger'); });
        diaRecoge.value   = g.dia || '';
        zona.value        = g.zona || '';
        esRegalo.checked  = !!g.regalo;
        dedicatoria.value = g.dedicatoria || '';
      } catch (e) { /* modo privado */ }

      pintarEntrega();

      [].concat(radios, [diaRecoge, zona, esRegalo, dedicatoria]).forEach(function (el) {
        el.addEventListener('change', function () { pintarEntrega(); guardarEntrega(); refrescarEnlace(); });
        el.addEventListener('input',  function () { guardarEntrega(); refrescarEnlace(); });
      });
    }());

    function pintar() {
      guardar();

      var unidades = pedido.reduce(function (s, l) { return s + l.cant; }, 0);
      conteos.forEach(function (c) {
        c.textContent = String(unidades);
        c.classList.toggle('hay', unidades > 0);
      });

      if (!pedido.length) {
        lista.innerHTML = '<p class="carrito__vacio">Todavía no ha agregado nada.<br>Escoja su café o su Vandola en la tienda.</p>';
      } else {
        lista.innerHTML = pedido.map(function (l) {
          return '<div class="linea">' +
            '<h3>' + l.nombre + '</h3>' +
            '<span class="linea__precio">' + colones(l.precio * l.cant) + '</span>' +
            '<small>' + (l.variantes.join(' · ') || '&nbsp;') + '</small>' +
            '<div class="linea__ctrl">' +
              '<button type="button" data-menos="' + l.id + '" aria-label="Quitar uno">−</button>' +
              '<span>' + l.cant + '</span>' +
              '<button type="button" data-mas="' + l.id + '" aria-label="Agregar uno">+</button>' +
              '<button type="button" class="linea__quitar" data-fuera="' + l.id + '">Quitar</button>' +
            '</div>' +
          '</div>';
        }).join('');
      }

      // Las opciones de entrega no pintan nada si todavía no hay qué entregar.
      cajaEntrega.hidden = !pedido.length;

      totalEl.textContent = colones(total());
      refrescarEnlace();
    }

    lista.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.mas)   cambiar(b.dataset.mas, 1);
      if (b.dataset.menos) cambiar(b.dataset.menos, -1);
      if (b.dataset.fuera) quitar(b.dataset.fuera);
    });

    /* --- Cajón --- */
    function abrirCajon() {
      cajon.classList.add('abierto');
      cajon.setAttribute('aria-hidden', 'false');
      telon.hidden = false;
      document.documentElement.classList.add('sin-scroll');
      requestAnimationFrame(function () { telon.classList.add('abierto'); });
    }
    function cerrarCajon() {
      cajon.classList.remove('abierto');
      cajon.setAttribute('aria-hidden', 'true');
      telon.classList.remove('abierto');
      document.documentElement.classList.remove('sin-scroll');
      setTimeout(function () { telon.hidden = true; }, 320);
    }

    [$('#abrirCarrito'), $('#abrirCarrito2')].forEach(function (b) {
      if (b) b.addEventListener('click', abrirCajon);
    });
    $('#cerrarCarrito').addEventListener('click', cerrarCajon);
    telon.addEventListener('click', cerrarCajon);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && cajon.classList.contains('abierto')) cerrarCajon();
    });

    pintar();
  }());

  /* =========================================================
     7. Visor de la galería
     ========================================================= */
  (function galeria() {
    var visor = $('#visor');
    if (!visor) return;
    var img = $('#visorImg'), pie = $('#visorPie');
    var piezas = $$('.pieza');
    var indice = 0, ultimoFoco = null;

    function mostrar(i) {
      indice = (i + piezas.length) % piezas.length;
      var p = piezas[indice];
      img.src = p.dataset.visor;
      img.alt = p.querySelector('img').alt;
      pie.textContent = p.dataset.pie || '';
    }

    function abrir(i) {
      ultimoFoco = document.activeElement;
      mostrar(i);
      visor.classList.add('abierto');
      $('#visorCerrar').focus();
    }
    function cerrar() {
      visor.classList.remove('abierto');
      if (ultimoFoco) ultimoFoco.focus();
    }

    piezas.forEach(function (p, i) { p.addEventListener('click', function () { abrir(i); }); });
    $('#visorCerrar').addEventListener('click', cerrar);
    $('#visorAnt').addEventListener('click', function () { mostrar(indice - 1); });
    $('#visorSig').addEventListener('click', function () { mostrar(indice + 1); });
    visor.addEventListener('click', function (e) { if (e.target === visor) cerrar(); });

    document.addEventListener('keydown', function (e) {
      if (!visor.classList.contains('abierto')) return;
      if (e.key === 'Escape') cerrar();
      if (e.key === 'ArrowLeft') mostrar(indice - 1);
      if (e.key === 'ArrowRight') mostrar(indice + 1);
    });
  }());

  /* =========================================================
     8. Aparición al hacer scroll
     ========================================================= */
  (function aparecer() {
    var elementos = $$('.aparece');
    if (!('IntersectionObserver' in window)) {
      elementos.forEach(function (el) { el.classList.add('dentro'); });
      return;
    }
    var ojo = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('dentro'); ojo.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -70px 0px', threshold: 0.08 });
    elementos.forEach(function (el) { ojo.observe(el); });
  }());

  /* =========================================================
     9. Botón flotante de WhatsApp
     ========================================================= */
  (function flotante() {
    var b = $('#flotante');
    if (!b) return;
    function ver() { b.classList.toggle('visible', window.scrollY > 500); }
    window.addEventListener('scroll', ver, { passive: true });
    ver();
  }());

  /* =========================================================
     10. Año del pie
     ========================================================= */
  (function anio() {
    var el = $('#anio');
    if (el) el.textContent = String(ahoraCR().getFullYear());
  }());

}());

# Kaffa Café — sitio web

Sitio estático (HTML + CSS + JS, sin dependencias ni compilación). Se abre con doble clic
en `index.html` o se sube tal cual a cualquier hosting.

```
index.html              Toda la página
assets/css/styles.css   Sistema visual completo
assets/css/aviso.css    Solo el rótulo de demostración (se borra al entregar)
assets/js/main.js       Horario, pestañas, galería, cuenta regresiva y carrito
assets/img/*.svg        Ilustraciones y logo vectorial
assets/video/           Vacía: aquí van los videos si se quieren locales
esencial/               Ejemplo del plan Esencial ($200), para comparar
profesional/            Ejemplo del plan Profesional ($400–450), para comparar
```

## Las tres versiones, para enseñárselas juntas

| | Esencial | Profesional | Completa |
|---|---|---|---|
| Ruta | `/esencial/` | `/profesional/` | `/` |
| Secciones | 1 | 3 ampliadas | 9 |
| Menú de navegación | ninguno | 3 enlaces | 7 enlaces |
| Servicios | 4 | 10 | 6 productos + 49 platos |
| Galería | 8 fotos | hasta 25 + antes/después | 6 + visor ampliado |
| Testimonios | — | sí, lista para activar | — |
| Formulario | contacto simple | reservas con fecha y hora | — (todo por WhatsApp) |
| Carta / tienda / carrito | — | — | sí |
| Archivos / líneas | 2 / 670 | 3 / 1.235 | 3 / 2.740 |

Las tres llevan arriba una **barra dorada** que dice de qué plan son y enlaza a las otras
dos, para que Don Minor salte entre ellas sin necesidad de tres direcciones.

### Cómo se quita el rótulo al entregar

En `esencial/` y `profesional/` basta con borrar el `<div class="aviso">` del HTML.

En el sitio principal es distinto, porque su barra de navegación es `position: fixed`
pegada al tope y el rótulo tiene que correrla hacia abajo. Para no ensuciar `styles.css`,
todo ese ajuste vive aparte en `assets/css/aviso.css`. Se quita borrando **dos líneas**
de `index.html`:

1. el `<link rel="stylesheet" href="assets/css/aviso.css">` del `<head>`
2. el `<div class="aviso"> ... </div>` que está justo después del enlace "Saltar al contenido"

`styles.css` no se toca, así que el sitio vuelve exactamente a como estaba.

## La carpeta `esencial/`

Es la **misma marca con el alcance del plan Esencial**, hecha para ponerla al lado de la
versión completa y que la diferencia se vea sola. Se publica en `/esencial/`.

Lleva exactamente lo que ofrece ese plan: una sola sección, 4 servicios con foto y
descripción, galería de 8 fotos, WhatsApp y redes, información de contacto, formulario simple
y SEO técnico básico. **No** lleva menú de navegación, carta, tienda, carrito, cuenta
regresiva, letrero de "Abierto ahora", visor de fotos ni ficha Schema.org.

Son 2 archivos y 670 líneas, contra 3 archivos y 2.740 del sitio completo.

Dos cosas al entregarla o al publicarla:

1. La barra dorada de arriba (`<div class="aviso">` en `esencial/index.html`) es el rótulo
   que la identifica como ejemplo. Si alguna vez se entrega de verdad, se borra ese bloque.
2. El formulario usa **Netlify Forms**: funciona solo al publicar en Netlify, con
   *Forms* habilitado en el panel del sitio. Abierto en local no envía nada.

## La carpeta `profesional/`

El escalón intermedio. Se publica en `/profesional/` y lleva exactamente lo que ofrece
ese plan: **3 secciones ampliadas** (Inicio, Servicios, Galería) con su menú de navegación,
**10 servicios** con foto y descripción, **antes y después** arrastrable, galería preparada
para **hasta 25 fotos**, **testimonios listos para activar**, **formulario de reserva con
fecha y hora**, y SEO con metadatos y un encabezado por sección.

Sigue **sin** carta, tienda, carrito, cuenta regresiva, letrero de "Abierto ahora" ni ficha
Schema.org: eso es lo que separa este plan del sitio completo.

Cuatro cosas al entregarla:

1. La barra dorada de arriba (`<div class="aviso">`) es el rótulo de ejemplo. Se borra.
2. **Los testimonios son de relleno, no son reseñas reales.** La sección está construida y
   funcionando, pero el texto dice explícitamente que hay que reemplazarlo. Para activarla:
   se cambia cada `<blockquote>` y su `<cite>` por el testimonio y el nombre reales, y se
   borra la clase `testimonios--ejemplo` del `<section>` (eso quita el recuadro amarillo).
   Si no se van a poner testimonios, se borra la sección completa.
3. **El antes y después** funciona con mouse, con el dedo y con las flechas del teclado.
   Hoy compara ilustraciones (finca → taza, grano → molido); con fotos reales es donde
   entra el par que Don Minor quiera mostrar.
4. La galería trae 12 fotos porque son las ilustraciones de relleno que existen. Para
   llegar a las 25 del plan se copia un `<figure>` dentro de `<div class="galeria">`.

El formulario de reserva también es de Netlify Forms, con la misma condición que el otro:
solo envía una vez publicado. La fecha mínima se ajusta sola al día de hoy, así que nadie
puede pedir una reserva para ayer.

Para verlo en local con servidor (recomendado, porque `file://` bloquea algunas cosas):

```bash
python -m http.server 5177 --directory "C:\Users\JMMendez\OneDrive - DOLE FOOD COMPANY INC\Desktop\Projects\Web de Kaffa"
```

Luego abrir `http://localhost:5177`.

---

## Lo primero que hay que decirle a Don Minor

**El dominio `kaffacafe.com` ya no es de Kaffa.** Hoy resuelve a un sitio basura llamado
"Raja Botak". Los enlaces que quedan en Google, en TripAdvisor y en los directorios de café
mandan a la gente a ese sitio. Verificado el 1.º de setiembre de 2026 abriendo el dominio.

Eso significa dos cosas: que Kaffa lleva tiempo sin sitio propio, y que el sitio nuevo hay
que amarrarlo a un dominio recuperado o nuevo (`kaffacafe.cr`, por ejemplo).

---

## Datos reales que ya están en el sitio

Todo esto se confirmó contra fuentes públicas antes de escribirlo:

| Dato | Valor |
|---|---|
| Dirección | 250 m sur del Banco de Costa Rica, Calle 153, San Isidro de Coronado, San José |
| Teléfono | 2292-3552 |
| WhatsApp | 6161-2746 |
| Horario | Lunes a sábado 8:00 a. m. – 8:00 p. m. · Domingo 8:00 a. m. – 7:00 p. m. |
| Instagram | [@kaffacafeoficial](https://www.instagram.com/kaffacafeoficial/) (~12 K seguidores) |
| Facebook | facebook.com/kaffacafecr |
| Delivery | Uber Eats, DiDi Food, Express |
| Fundación | 2003, por Minor Alfaro; en 2004 pasó a solo café de origen |
| Vandola | Creada por Minor Alfaro; cerámica hecha a mano por alfareros de tradición precolombina; se exporta a Alemania, China y Estados Unidos |

La cita de la sección Vandola («Los países productores de café no tenían métodos de infusión
propios») es una declaración real de Minor Alfaro publicada por *El Financiero*, y va citada
con su fuente.

**No se puso el correo `info@kaffacafe.com`** a propósito: como el dominio está tomado, ese
buzón lo más probable es que ya no llegue a Kaffa. Si Don Minor tiene un correo vivo, se agrega.

---

## Lo que hay que pedirle a Don Minor para cerrar

1. **El logo en PNG o SVG con fondo transparente.** Se guarda como `assets/img/logo.png`
   y el sitio lo toma solo, sin tocar código. Mientras tanto se dibuja una versión vectorial
   del logo que está en `index.html`.
2. **Fotos reales.** Reemplazar los archivos de `assets/img/` conservando el nombre
   (`barra`, `fachada`, `taza`, `reposteria`, `cafetal`, `vandola-servicio`) o cambiar la ruta
   en el `<img>` y en el `data-visor` de cada tarjeta de la galería. Sirven `.jpg` y `.webp`.
3. **Videos.** Hoy las tres tarjetas de video abren el Instagram de Kaffa. Si quiere que
   se reproduzcan dentro de la página, se dejan los `.mp4` en `assets/video/` y se cambia
   el `<a class="video">` por un reproductor.
4. **Precios de la carta y de la tienda.** Los de la tienda son de referencia y están marcados
   como tales en la página; hay que sustituirlos por la lista oficial. Se editan en el atributo
   `data-precio` de cada botón de opción, en la sección `<!-- TIENDA -->`.
5. **Datos del campeonato.** La fecha, el número de edición, el cupo y la fecha de cierre
   son de ejemplo. La cuenta regresiva sale del atributo
   `data-fecha="2026-11-14T09:00:00-06:00"` en `<div class="cuenta">`; cambiando esa fecha
   se recalcula sola. En "Ediciones anteriores" no se pusieron nombres de campeones para
   no inventar datos de personas reales: se llenan cuando Don Minor los dé.

---

## Los mensajes de WhatsApp

Ningún enlace de WhatsApp abre el chat en blanco: todos llevan escrito de antemano un
mensaje acorde al lugar desde donde se tocó. Los 20 enlaces de las tres versiones están
cubiertos.

En el sitio principal y en la Profesional, **el botón flotante cambia el mensaje según la
sección que el visitante esté leyendo**, porque ese botón lo acompaña por toda la página:

| Sección | Mensaje que lleva |
|---|---|
| Portada / historia / galería | «Hola Kaffa, buenas. Quisiera información.» |
| La Vandola | «…me interesa la Vandola. ¿Me cuentan cómo funciona y cuánto vale?» |
| Carta | «…¿me confirman los precios y el plato del día?» |
| Competencias | «…quiero información del Campeonato Nacional de Vandola.» |
| Tienda | «…quiero hacer un pedido de café para llevar.» |
| Visítanos | «…quiero reservar una mesa.» |

Se editan en el objeto `MENSAJES` de `assets/js/main.js` (dentro de `navegacion()`) y en
`POR_SECCION` de `profesional/main.js`. La clave de cada línea es el `id` de la sección.

En la Profesional, además, el enlace «Escríbanos por WhatsApp» del formulario recoge lo que
el visitante ya escogió en *motivo*: si marcó «Taller de Vandola», el chat abre diciendo que
quiere reservar un taller de Vandola.

La **etiqueta para lectores de pantalla del botón flotante no cambia** a propósito: describe
el botón, y reescribirla en cada scroll haría que se anunciara sin parar.

En la Esencial los mensajes son fijos, no cambian con el scroll: esa versión no lleva
JavaScript, y ese es justamente uno de los límites del plan.

## Cómo funciona la tienda

No hay pasarela de pago ni servidor. El visitante escoge presentación y molienda, agrega al
pedido, y el botón verde arma un mensaje de WhatsApp con todo el detalle y el total, dirigido
al 6161-2746. Kaffa confirma disponibilidad, envío y monto exacto por ese mismo chat.

El pedido se guarda en el navegador del visitante (`localStorage`), así que no se pierde si
cierra la pestaña.

Para agregar un producto se copia un bloque `<article class="producto" ...>` completo. Reglas:

- `data-nombre` es el nombre que sale en el mensaje de WhatsApp.
- Cada `<div class="fichas" data-grupo="...">` es un grupo de opciones.
- **Solo uno** de los grupos lleva `data-precio` en sus botones: ese es el que fija el precio.
- El botón que arranca seleccionado lleva `aria-pressed="true"`.

---

## Detalles que ya están resueltos

- El letrero "Abierto ahora / Cerrado" se calcula con la hora de Costa Rica (UTC−6),
  sin importar dónde esté el visitante, y resalta el día de hoy en la tabla de horarios.
- Ficha de negocio en formato Schema.org para que Google muestre dirección y horario.
- Responsive hasta 375 px, foco visible con teclado, y respeta `prefers-reduced-motion`.
- Hoja de estilos para imprimir la carta.

## Pendiente para producción

- Dominio y hosting.
- Sustituir el `<link rel="canonical">` por el dominio definitivo.
- Cambiar `og:image` por una foto real (hoy apunta a una ilustración).

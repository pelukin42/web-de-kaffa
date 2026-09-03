# Kaffa Café — sitio web

Sitio estático (HTML + CSS + JS, sin dependencias ni compilación). Se abre con doble clic
en `index.html` o se sube tal cual a cualquier hosting.

```
index.html              EL SITIO REAL (plan Profesional)
assets/css/estilos.css  Su hoja de estilos
assets/js/principal.js  Su JavaScript
assets/img/logo.png     Logo oficial de Kaffa (negro sobre transparencia)
assets/img/og.png       Imagen de vista previa al compartir el enlace
assets/img/*.svg        Ilustraciones de relleno
amedida/                Demostración del plan A Medida, con noindex
esencial/               Demostración del plan Esencial, con noindex
```

## Qué vive en cada ruta

| Ruta | Qué es |
|---|---|
| `/` | **El sitio real.** Es la versión del plan Profesional, que es lo que Kaffa contrató. |
| `/amedida/` | Demostración del plan A Medida. Sirve de vitrina para venderles la migración. |
| `/esencial/` | Demostración del plan Esencial. |

Las dos demostraciones llevan `<meta name="robots" content="noindex, nofollow">` para que
Google no las indexe: son copias casi idénticas del sitio real y le competirían en los
resultados. No están enlazadas desde ninguna parte, así que solo llega quien tenga la
dirección.

**El dominio es `kaffacafecr.com`.** Está puesto en el `canonical`, el `og:url` y el
`og:image` de las tres.

## El logo

`assets/img/logo.png` es el logo oficial, negro sobre fondo transparente. Como la barra de
navegación es azul noche, el CSS lo invierte (`filter: invert(1)`) para que salga blanco.
Al ser negro puro el invertido da blanco limpio, sin grises sucios.

Si algún día se pone sobre fondo claro, hay que quitarle ese filtro.

`assets/img/og.png` (1200×630) es la imagen que sale al compartir el enlace por WhatsApp o
Facebook: el logo centrado sobre el crema de la marca. Se generó a partir del logo, porque
esas dos redes no muestran vista previa con archivos `.svg`.

## La carpeta `esencial/`

Es la **misma marca con el alcance del plan Esencial**, hecha para ponerla al lado de la
versión completa y que la diferencia se vea sola. Se publica en `/esencial/`.

Lleva exactamente lo que ofrece ese plan: una sola sección, 4 servicios con foto y
descripción, galería de 8 fotos, WhatsApp y redes, información de contacto, formulario simple
y SEO técnico básico. **No** lleva menú de navegación, carta, tienda, carrito, cuenta
regresiva, letrero de "Abierto ahora", visor de fotos ni ficha Schema.org.

Son 2 archivos, contra los 3 de la demostración A Medida.

El formulario usa **Netlify Forms**. Ver más abajo la nota sobre la detección.

## El sitio real (la raíz)

Es la versión del plan Profesional, que es lo que Kaffa contrató. Lleva exactamente lo que ofrece
ese plan: **3 secciones ampliadas** (Inicio, Servicios, Galería) con su menú de navegación,
**10 servicios** con foto y descripción, **antes y después** arrastrable, galería preparada
para **hasta 25 fotos**, **testimonios listos para activar**, **formulario de reserva con
fecha y hora**, y SEO con metadatos y un encabezado por sección.

Sigue **sin** carta, tienda, carrito, cuenta regresiva, letrero de "Abierto ahora" ni ficha
Schema.org: eso es lo que separa este plan del sitio completo.

Tres cosas pendientes en él:

1. **Los testimonios son de relleno, no son reseñas reales.** La sección está construida y
   funcionando, pero el texto dice explícitamente que hay que reemplazarlo. Para activarla:
   se cambia cada `<blockquote>` y su `<cite>` por el testimonio y el nombre reales, y se
   borra la clase `testimonios--ejemplo` del `<section>` (eso quita el recuadro amarillo).
   Si no se van a poner testimonios, se borra la sección completa.
2. **El antes y después** funciona con mouse, con el dedo y con las flechas del teclado.
   Hoy compara ilustraciones (finca → taza, grano → molido); con fotos reales es donde
   entra el par que Don Minor quiera mostrar.
3. La galería trae 12 fotos porque son las ilustraciones de relleno que existen. Para
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

## El dominio viejo sigue perdido

**`kaffacafe.com` ya no es de Kaffa.** Hoy lo usa "Raja Botak", una tostadora de café
indonesia con tienda propia. El registro es de 2011 y vence en 2027, con última modificación
del 17 de junio de 2026: nunca se liberó, cambió de manos — casi seguro en la subasta de
dominios vencidos de GoDaddy.

Recuperarlo no es realista: quien lo tiene está haciendo negocio con él, y "Kaffa" es la
región de Etiopía de donde viene el café, así que el nombre es casi genérico en el rubro.

Por eso se compró **`kaffacafecr.com`**, que además comunica mejor para un café de Coronado.

Lo que sí urge, y no depende del dominio: **los enlaces viejos.** Google, TripAdvisor y los
directorios de café siguen mandando gente a `kaffacafe.com`, o sea al negocio indonesio.
Hay que actualizar la ficha de Google Business Profile (es el punto número uno para SEO
local), TripAdvisor, los directorios, y la biografía de Instagram y Facebook — esas dos las
controla Kaffa y se cambian en un minuto.

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

1. **Fotos reales.** Reemplazar los archivos de `assets/img/` conservando el nombre
   (`barra`, `fachada`, `taza`, `reposteria`, `cafetal`, `vandola-servicio`) o cambiar la ruta
   en el `<img>` y en el `data-visor` de cada tarjeta de la galería. Sirven `.jpg` y `.webp`.
2. **Videos.** Hoy las tres tarjetas de video abren el Instagram de Kaffa. Si quiere que
   se reproduzcan dentro de la página, se dejan los `.mp4` en `assets/video/` y se cambia
   el `<a class="video">` por un reproductor.
3. **Precios de la carta y de la tienda.** Los de la tienda son de referencia y están marcados
   como tales en la página; hay que sustituirlos por la lista oficial. Se editan en el atributo
   `data-precio` de cada botón de opción, en la sección `<!-- TIENDA -->`.
4. **Datos del campeonato.** La fecha, el número de edición, el cupo y la fecha de cierre
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

Se editan en el objeto `MENSAJES` de `amedida/main.js` (dentro de `navegacion()`) y en
`POR_SECCION` de `assets/js/principal.js`. La clave de cada línea es el `id` de la sección.

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

Antes de enviar, el carrito pregunta **cómo quiere recibirlo** y según la respuesta pide el
dato que hace falta:

| Opción | Qué pide | Qué sale en el mensaje |
|---|---|---|
| Recoger en el café | Qué día pasa | `Pasa el: sábado 5 de setiembre` |
| Envío dentro del GAM | Distrito o barrio | `Zona: … / Envío: pendiente de cotizar` |
| Encomienda al resto del país | Provincia y cantón | `Zona: … / Envío: pendiente de cotizar` |

Y una casilla de **«Es para regalo»** con dedicatoria opcional, que también viaja en el
mensaje. Todo esto existe para que Kaffa reciba el pedido completo de una vez y no tenga
que preguntar por chat a dónde va y cuándo.

El pedido y las opciones de entrega se guardan en el navegador del visitante
(`localStorage`), así que no se pierden si cierra la pestaña.

### Las apps de reparto

En la sección de la Carta hay un bloque listo para **Uber Eats y DiDi Food**, pero está
comentado en `index.html` porque **faltan las dos URL**. Hay que pedírselas a Don Minor
(se sacan desde cada app con "Compartir"). Para activarlo se quitan los marcadores de
comentario y se pega cada dirección en su `href`. No hay que inventarlas: una URL
equivocada manda a la gente al restaurante de otro.

Va en la Carta y no en la Tienda a propósito: esas apps reparten comida y bebida
preparada para hoy. Una Vandola es cerámica frágil y un kilo de grano a provincia va por
encomienda, no por DiDi.

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

- **Dominio propio.** Ya comprado: `kaffacafecr.com`. Falta apuntarlo en Netlify
  (Domain management) y que el certificado se emita.
- **Una foto real para `og:image`.** Hoy es el logo sobre el crema de la marca, que
  funciona pero no vende. Una foto buena del local o de una Vandola sirve mejor.

---

## Los formularios (Netlify Forms)

Hay dos: `reserva` en el sitio real y `contacto` en la demostración Esencial. Los dos
mandan a `/gracias/` al enviarse, que es una página propia en vez de la genérica de Netlify.

Para que funcionen hacen falta **tres cosas**, y si falta cualquiera el envío termina en un
404 de Netlify:

1. En el HTML: `data-netlify="true"`, un `<input type="hidden" name="form-name">` con el
   nombre del formulario, y el honeypot. **Esto ya está.**
2. En Netlify: **Site configuration → Forms → Form detection → Enable.** Viene apagado por
   defecto en los sitios nuevos.
3. **Un despliegue posterior a activar la detección.** Netlify escanea el HTML en el momento
   de publicar, así que no basta con encender el ajuste: hay que volver a desplegar para que
   encuentre los formularios.

Una vez detectados aparecen listados en esa misma pantalla, y ahí llegan los envíos.
El plan gratuito admite 100 al mes entre los dos.

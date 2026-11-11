# Plan Técnico - Spec 001: Invitación Digital Interactiva de Matrimonio (Valeria & Ramiro)

## 1. Archivos y responsabilidades

| Archivo | Acción | Responsabilidad única | RF cubiertos |
| :--- | :--- | :--- | :--- |
| `src/config/weddingData.js` | Crear / Actualizar | Fuente única de datos de la boda: textos en español de la tarjeta oficial, horarios, recintos, opciones de menú y rutas de activos locales (`/assets/bg-floral-original.jpg`, `venue-ceremony.jpg`, `venue-restaurant.jpg`, `wedding-song.mp3`). | RF-2, RF-3, RF-4, RF-7 |
| `src/logic/weddingLogic.js` | Crear / Actualizar | Funciones puras de dominio desacopladas del DOM: cálculo de cuenta regresiva determinista, validación de formulario RSVP y cálculo de porcentaje de raspado de píxeles. | RF-4, RF-5, RF-6 |
| `tests/weddingLogic.test.js` | Crear / Actualizar | Suite de pruebas unitarias automatizadas con el runner nativo `node --test` validando casos felices y casos límite de toda la lógica pura. | RF-4, RF-5, RF-6 |
| `src/index.css` | Crear / Actualizar | Regla utilitaria `.calligraphy-safe` (*Zero Clipping Rule*: `#9E7B3B`, `line-height: 1.55`, `overflow: visible`, `px-4`, `z-index: 20`) y clases de perspectiva 3D para apertura del sobre hacia la izquierda (`rotateY(-165deg)`, `2200ms`, `cubic-bezier(0.22, 1, 0.36, 1)`). | RF-1, RF-2 |
| `src/components/EnvelopeIntroOverlay.jsx` | Crear / Actualizar | Sobre vertical a pantalla completa (`100vw x 100dvh`, `fixed inset-0 z-50`) con apertura vertical hacia la izquierda y sello de lacre centrado con únicamente el monograma `"V & R"` (sin fecha debajo). | RF-1 |
| `src/components/ScratchCardCanvas.jsx` | Crear / Actualizar | Lienzo interactivo HTML5 `<canvas>` para *"Lluvia de Sobres"* con soporte táctil/puntero y revelación automática al alcanzar o superar el 45% de área raspada. | RF-5 |
| `src/components/RsvpRestaurantModal.jsx` | Crear / Actualizar | Ventana modal accesible para confirmar asistencia al restaurante, cupos (`1` a `6`), plato elegido y notas dietarias, conectada a `validateRsvpSubmission`. | RF-6 |
| `src/App.jsx` | Crear / Actualizar | Orquestador principal de la tarjeta sobre el fondo `/assets/bg-floral-original.jpg`, reproductor de audio con botón mute/unmute, sección Hero, cuenta regresiva, recintos con *placeholders* resilientes, cronograma, código de vestimenta y cierre sin botones flotantes de configuración. | RF-1..RF-7 |

---

## 2. Dominio y funciones puras de lógica (`src/logic/weddingLogic.js`)

Todas las funciones son 100% puras (sin acceso a `window`, `document`, `localStorage` ni `new Date()` implícito sin parámetro):

1. `calculateCountdown(targetIsoDate, currentDate)`
   - **Entrada**: `targetIsoDate` (`string | Date`, ej. `'2026-12-11T16:00:00-05:00'`), `currentDate` (`string | Date`).
   - **Salida**: `{ days: number, hours: number, minutes: number, seconds: number, isPast: boolean }`.
   - **Comportamiento**: Si `currentDate >= targetIsoDate` o alguna fecha es inválida, retorna `{ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }`.
   - **RF cubiertos**: `RF-4`.

2. `validateRsvpSubmission(payload)`
   - **Entrada**: Objeto `{ fullName, attending, wishesMessage }` (y opcionalmente campos legados si existieran).
   - **Salida**: `{ isValid: boolean, errors: string[], normalizedPayload: object | null }`.
   - **Comportamiento**: Valida nombre mínimo de 3 caracteres y estado de asistencia (`'yes' | 'no'`), con `wishesMessage` opcional y sin exigir menú, restricciones alimentarias ni `guestCount`. Retorna mensajes de error en español.
   - **RF cubiertos**: `RF-6`.

3. `calculateScratchPercentage(pixelData, alphaThreshold = 128)`
   - **Entrada**: `pixelData` (`Uint8ClampedArray | number[]` de canales RGBA) y umbral de transparencia `alphaThreshold`.
   - **Salida**: Entero entre `0` y `100` representando el porcentaje de píxeles transparentes.
   - **RF cubiertos**: `RF-5`.

---

## 3. Algoritmos en pseudocódigo

### 3.1 Cálculo determinista de cuenta regresiva
```text
FUNCIÓN calculateCountdown(targetIsoDate, currentDate):
  targetMs <- convertirATimestamp(targetIsoDate)
  currentMs <- convertirATimestamp(currentDate)

  SI targetMs es NaN O currentMs es NaN O currentMs >= targetMs ENTONCES:
    RETORNAR { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }

  diffSeconds <- PISO((targetMs - currentMs) / 1000)
  days <- PISO(diffSeconds / 86400)
  hours <- PISO((diffSeconds MOD 86400) / 3600)
  minutes <- PISO((diffSeconds MOD 3600) / 60)
  seconds <- diffSeconds MOD 60

  RETORNAR { days, hours, minutes, seconds, isPast: false }
```

### 3.2 Validación de confirmación RSVP para el restaurante
```text
FUNCIÓN validateRsvpSubmission(payload):
  SI payload no es un objeto válido ENTONCES:
    RETORNAR { isValid: false, errors: ["Los datos del formulario son inválidos."], normalizedPayload: null }

  errors <- []
  fullName <- recortarEspacios(payload.fullName)
  attending <- payload.attending ('yes' o 'no')
  guestCount <- Entero(payload.guestCount)
  selectedDish <- recortarEspacios(payload.selectedDish)

  SI longitud(fullName) < 3 ENTONCES:
    AGREGAR "Por favor ingresa tu nombre y apellido completos." A errors

  SI attending != 'yes' Y attending != 'no' ENTONCES:
    AGREGAR "Por favor selecciona si podrás acompañarnos." A errors

  SI attending == 'yes' ENTONCES:
    SI guestCount < 1 O guestCount > 6 ENTONCES:
      AGREGAR "El número de cupos confirmados debe estar entre 1 y 6." A errors
    SI selectedDish está vacío ENTONCES:
      AGREGAR "Por favor selecciona una preferencia de plato para el restaurante." A errors

  SI longitud(errors) > 0 ENTONCES:
    RETORNAR { isValid: false, errors, normalizedPayload: null }

  RETORNAR {
    isValid: true,
    errors: [],
    normalizedPayload: {
      fullName,
      attending,
      guestCount: SI attending == 'yes' ENTONCES guestCount SINO 0,
      selectedDish: SI attending == 'yes' ENTONCES selectedDish SINO 'none',
      dietaryNotes: recortarEspacios(payload.dietaryNotes),
      wishesMessage: recortarEspacios(payload.wishesMessage)
    }
  }
```

### 3.3 Cálculo de porcentaje raspado en `<canvas>`
```text
FUNCIÓN calculateScratchPercentage(pixelData, alphaThreshold = 128):
  SI pixelData es nulo O longitud(pixelData) < 4 ENTONCES:
    RETORNAR 0

  totalPixels <- PISO(longitud(pixelData) / 4)
  transparentCount <- 0

  PARA i <- 3 HASTA longitud(pixelData) - 1 CON PASO 4 HACER:
    SI pixelData[i] < alphaThreshold ENTONCES:
      transparentCount <- transparentCount + 1

  RETORNAR REDONDEAR((transparentCount / totalPixels) * 100)
```

---

## 4. Integración en la interfaz (UI) y Reglas Visuales

1. **Sobre Vertical y Sello de Lacre (`EnvelopeIntroOverlay.jsx`)**:
   - Contenedor raíz `fixed inset-0 z-50 w-screen h-[100dvh] overflow-hidden`.
   - Solapa con `transform-origin: left center` y clase `.envelope-flap-left` que al activarse aplica `transform: rotateY(-165deg)` durante `2200ms` con curva `cubic-bezier(0.22, 1, 0.36, 1)`.
   - Botón del sello de lacre centrado vertical y horizontalmente, mostrando únicamente `{monogram}` (`"V & R"`) dentro del círculo interior en relieve sin fecha inferior.

2. **Cero Recorte Tipográfico (`Zero Clipping Rule`)**:
   - Todo título en fuente `Great Vibes` (*Valeria Albus Sánchez*, *Ramiro Ballestas Molina*, *Santa Marta, Colombia*, encabezados de sección) utiliza `.calligraphy-safe` con color sólido `#9E7B3B`, `line-height: 1.55`, `overflow: visible`, `px-4` y `z-index: 20`.
   - Prohibido el uso de `background-clip: text`, `text-transparent` o contenedores padres con `overflow-hidden` sobre textos caligráficos.

3. **Fondo Floral Original y Placeholders de Recintos (`App.jsx`)**:
   - Fondo fijo/repetido cargando `/assets/bg-floral-original.jpg` (configurado en `src/config/weddingData.js`).
   - Las tarjetas de Ceremonia y Restaurante intentan cargar `/assets/venue-ceremony.jpg` y `/assets/venue-restaurant.jpg`; si la imagen aún no existe (`onError`), conmutan limpiamente a un marco *placeholder* estilizado en tonos marfil y dorado sin mostrar iconos de imagen rota ni errores en consola.

4. **Ausencia de UI Flotante de Configuración**:
   - Solo existe el botón flotante de control de audio (silenciar/activar música) en la esquina superior derecha tras abrir el sobre. No se incluye ningún botón o cajón de configuración SDD.

---

## 5. Decisiones técnicas justificadas

- **Decisión 1: Separar la lógica de negocio en funciones puras (`src/logic/weddingLogic.js`) recibiendo `currentDate` y `pixelData` como argumentos.**
  - *Por qué*: Cumple los Principios 3 y 4 de `docs/constitution.md`, permitiendo ejecutar `node --test` en milisegundos sin emular el DOM ni depender del reloj del sistema.
  - *Alternativa descartada*: Calcular la cuenta regresiva o validar el formulario directamente dentro de `useEffect`/`useState` en los componentes React (acopla la lógica a la UI e impide pruebas unitarias puras).

- **Decisión 2: Aplicar color dorado sólido (`#9E7B3B`) con `line-height: 1.55`, `overflow: visible` y `px-4` en lugar de degradados CSS con `background-clip: text`.**
  - *Por qué*: Cumple el Principio 7 (*Zero Clipping Rule*). En navegadores móviles (Safari iOS / Chrome Android), `background-clip: text` recorta la caja de glifos en fuentes caligráficas con trazos largos como `Great Vibes` (cortando la "V" de Valeria o la "S" de Santa Marta).
  - *Alternativa descartada*: Usar `bg-clip-text text-transparent` con degradado metálico.

- **Decisión 3: Centralizar todos los datos y rutas en `src/config/weddingData.js` sin cajones de configuración en pantalla.**
  - *Por qué*: Mantiene la invitación limpia y lista para compartir con invitados reales en modo previsualización, permitiendo que cualquier cambio futuro de lugar, hora o foto se realice editando un único archivo.
  - *Alternativa descartada*: Incluir un panel lateral o modal de edición en vivo en la interfaz.

---

## 6. Estrategia de pruebas (`node --test` + Chrome DevTools)

### 6.1 Tests unitarios (`node --test tests/weddingLogic.test.js`)
- **Test 1 (`RF-4`)**: `calculateCountdown` calcula exactamente días, horas, minutos y segundos restantes antes del `2026-12-11T16:00:00-05:00`.
- **Test 2 (`RF-4` caso límite)**: `calculateCountdown` retorna ceros e `isPast: true` cuando la fecha actual es igual o posterior al evento o inválida.
- **Test 3 (`RF-6` caso feliz)**: `validateRsvpSubmission` aprueba y normaliza una confirmación válida con acompañantes (`1..6`) y plato seleccionado.
- **Test 4 (`RF-6` errores y caso límite)**: `validateRsvpSubmission` rechaza nombres vacíos, cupos fuera de rango o falta de plato cuando `attending === 'yes'`, y permite omitir plato cuando `attending === 'no'`.
- **Test 5 (`RF-5`)**: `calculateScratchPercentage` calcula el porcentaje exacto de píxeles con canal alfa por debajo del umbral en un buffer RGBA.

### 6.2 Verificación visual e interactiva (MCP `chrome-devtools`)
1. Levantar servidor de desarrollo y abrir en viewport móvil de `375 px` de ancho.
2. Verificar `RF-1`: Sobre vertical a pantalla completa (`100vw x 100dvh`) con sello `"V & R"` centrado sin fecha debajo y apertura suave hacia la izquierda al hacer clic.
3. Verificar `RF-2` y `RF-3`: Títulos caligráficos completos sin recortes sobre `/assets/bg-floral-original.jpg`.
4. Verificar `RF-4`, `RF-5`, `RF-6`, `RF-7`: Placeholders limpios en recintos, raspado de `<canvas>`, validación del modal RSVP, ausencia de botones de configuración y consola con `0` errores.

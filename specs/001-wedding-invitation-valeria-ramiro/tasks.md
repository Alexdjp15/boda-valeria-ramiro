# Tareas de Implementación - Spec 001: Invitación Digital Interactiva de Matrimonio (Valeria & Ramiro)
Regla: Máximo 20-30 min por tarea, en orden estricto de dependencia. Implementar UNA sola tarea a la vez aplicando TDD (test en rojo -> código -> test en verde -> parar).

- [x] **T1. Centralizar datos oficiales de la boda y rutas de activos locales en `src/config/weddingData.js`.** Cubre: `RF-2`, `RF-3`, `RF-7`
  - **Archivos**: `src/config/weddingData.js`
  - **Hecho cuando**: `weddingData` exporta todos los textos exactos en español de la tarjeta oficial (*JHON ALBUS & ELIZABETH SÁNCHEZ*, *Valeria Albus Sánchez & Ramiro Ballestas Molina*, homenaje póstumo, fecha *11 de Diciembre de 2026*, cita bíblica *Cant. 8:6, 7*, *Santa Marta, Colombia*), opciones de menú del restaurante y la ruta del fondo floral principal `/assets/bg-floral-original.jpg`, sin incluir variables para paneles de configuración flotantes.

- [x] **T2. Implementar y validar funciones puras de dominio en `src/logic/weddingLogic.js` mediante TDD (`node --test`).** Cubre: `RF-4`, `RF-5`, `RF-6`, `RNF-2`
  - **Archivos**: `tests/weddingLogic.test.js`, `src/logic/weddingLogic.js`
  - **Hecho cuando**: `tests/weddingLogic.test.js` cubre los casos felices y casos límite de `calculateCountdown`, `validateRsvpSubmission` y `calculateScratchPercentage`, y la ejecución de `node --test tests/weddingLogic.test.js` finaliza 100% en verde (`0` fallos).

- [x] **T3. Implementar el sobre vertical a pantalla completa (`100vw x 100dvh`) con apertura hacia la izquierda y sello `"V & R"` centrado.** Cubre: `RF-1`, `RNF-1`
  - **Archivos**: `src/index.css`, `src/components/EnvelopeIntroOverlay.jsx`
  - **Hecho cuando**: El componente ocupa `100vw x 100dvh` (`fixed inset-0 z-50`), aplica `.envelope-flap-left` con `transform-origin: left center` y `rotateY(-165deg)` en `2200ms` (`cubic-bezier(0.22, 1, 0.36, 1)`), y el botón del sello de lacre está estrictamente centrado mostrando únicamente el monograma `"V & R"` sin fecha debajo.

- [x] **T4. Construir el lienzo interactivo `<canvas>` para *"Lluvia de Sobres"* y el modal RSVP para el restaurante.** Cubre: `RF-5`, `RF-6`
  - **Archivos**: `src/components/ScratchCardCanvas.jsx`, `src/components/RsvpRestaurantModal.jsx`
  - **Hecho cuando**: `ScratchCardCanvas.jsx` calcula el porcentaje raspado con `calculateScratchPercentage` y revela automáticamente el mensaje al alcanzar o superar el `45%`; `RsvpRestaurantModal.jsx` valida los datos con `validateRsvpSubmission`, bloquea envíos incompletos con mensajes en español y permite confirmar asistencia y plato del restaurante.

- [x] **T5. Orquestar la tarjeta principal en `src/App.jsx` aplicando la regla *Zero Clipping*, fondo floral original, *placeholders* de recintos y verificación móvil (`375 px`).** Cubre: `RF-1`, `RF-2`, `RF-3`, `RF-4`, `RF-7`, `RNF-1`, `RNF-3`
  - **Archivos**: `src/index.css`, `src/App.jsx`
  - **Hecho cuando**: Todos los títulos caligráficos (`Great Vibes`) usan `.calligraphy-safe` (`#9E7B3B`, `line-height: 1.55`, `overflow: visible`, `px-4`, `z-index: 20`) sin recortes sobre `/assets/bg-floral-original.jpg`, las tarjetas de Ceremonia y Restaurante muestran marcos *placeholder* limpios cuando faltan las fotos, no existe ningún botón flotante de configuración, `npm run build` compila sin errores y la vista móvil (`375 px`) en Chrome DevTools presenta `0` errores de consola.

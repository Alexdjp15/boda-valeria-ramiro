# AGENTS.md - [NOMBRE_DEL_PROYECTO]
[Breve descripción en 1-2 frases: qué hace este software, para quién es y cuál es su objetivo principal.]

## Stack y estructura
- **Stack dinámico**: Definido para este proyecto en `docs/constitution.md` y detallado en el `plan.md` activo.
- **Estructura SDD**: `docs/constitution.md` (principios), `specs/NNN-*/` (`spec.md`, `plan.md`, `tasks.md`), `tests/` (pruebas automatizadas).
- **Arnés agéntico**: `.agents/skills/` (habilidades modulares), `.agents/commands/` (comandos `/sdd-*`), `.agents/agents/` (sistema multiagente).

## Comandos
- Ejecutar entorno local: `[definir comando dev, ej. npm run dev o abrir index.html]`
- Ejecutar tests: `node --test`
- Linter / Build: `[definir comando lint / build si aplica]`

## Convenciones y Reglas SDD
- **Regla de oro**: Lee `docs/constitution.md` y la spec activa (`specs/NNN-*/`) antes de tocar cualquier archivo de código.
- Código e identificadores en inglés; textos de interfaz, comentarios, commits y documentación en español.
- Mantén toda la lógica de negocio en funciones puras, desacopladas de la interfaz (DOM/UI) y del almacenamiento.

## Memoria
- Al empezar cada sesión, lee `MEMORY.md` para conocer el estado del proyecto y las decisiones tomadas.
- Al terminar una tarea o fase SDD, actualiza `MEMORY.md`: estado actual, decisiones (con su porqué) y errores a evitar.
- Mantenlo breve (máximo ~50 líneas): resume o elimina lo obsoleto. Nunca guardes claves ni datos sensibles.

## Forma de trabajar y Límites
- Haz solo lo que pide la tarea activa: cambios pequeños y enfocados; no reescribas lo que ya funciona.
- **Siempre**: respetar `docs/constitution.md`, aplicar TDD (tests primero) y actualizar `MEMORY.md` al terminar cada tarea.
- **Pregunta antes**: añadir dependencias nuevas, crear archivos no previstos en `plan.md` o cambiar esquemas de datos.
- **Nunca**: implementar requisitos que no estén en la `spec.md` aprobada ni dar una tarea por terminada con tests en rojo.

## Verificación
- Ejecuta `node --test` tras cada cambio en la lógica y comprueba que todos los tests pasen en verde.
- Después de cada cambio visual o de flujo, verifica con el MCP de **Chrome DevTools**: abre la web, prueba la funcionalidad, revisa la consola sin errores y comprueba la vista móvil (`375 px` de ancho).

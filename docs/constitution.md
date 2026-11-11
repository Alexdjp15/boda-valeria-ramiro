# Constitución del Proyecto
Principios innegociables. Toda spec, plan y tarea debe cumplirlos sin excepción.

1. **Simplicidad primero**: Stack mínimo acordado (React 18 + Vite + Tailwind CSS + Node.js native test runner `node --test`). Prohibido instalar librerías o dependencias pesadas no aprobadas en el plan.
2. **La spec manda**: Nada se implementa si no está en la spec activa (`specs/NNN-*/spec.md`). Si falta una decisión o hay ambigüedad, se para y se pregunta.
3. **Lógica separada de interfaz**: Los cálculos, validaciones y reglas de dominio (`src/logic/`) son funciones puras (sin DOM, UI ni almacenamiento directo) que reciben el estado o la fecha actual como parámetro.
4. **Tests como puerta**: Toda lógica se prueba con `node --test` siguiendo TDD (test en rojo primero, luego código). Prohibido avanzar con tests en rojo.
5. **Los datos del usuario son sagrados**: Cualquier persistencia o payload RSVP debe mantener compatibilidad hacia atrás y manejar fechas siempre en zona horaria local (`America/Bogota`).
6. **Idioma**: Código, identificadores, componentes, variables y comentarios 100% en inglés; interfaz de usuario (UI), especificaciones y documentación 100% en español.
7. **Cero recorte tipográfico (Zero Clipping Rule)**: Prohibido usar `background-clip: text` o `overflow-hidden` en tipografías caligráficas (`Great Vibes`, `Alex Brush`, `Cormorant Garamond`). Usar siempre color sólido dorado (`#9E7B3B`), `overflow: visible`, `line-height: 1.55` y `padding-inline` generoso.

---
name: mcp-orchestration
description: Úsala cuando necesites consultar documentación actualizada de librerías externas con Context7 o verificar visualmente la interfaz y consola del navegador con Chrome DevTools.
---

# Orquestación de Servidores MCP en Antigravity

## 1. Uso del MCP `context7` (Documentación en tiempo real)
- **Cuándo usarlo**: En la fase de Planificación (`/sdd-plan`) o Implementación (`/sdd-implement`) siempre que el proyecto utilice un framework, librería o API externa (React, Vite, Tailwind, Supabase, etc.).
- **Regla**: No adivines métodos ni configuraciones basándote en memoria de entrenamiento si la librería ha cambiado recientemente; consulta primero `context7` para obtener la sintaxis oficial vigente.

## 2. Uso del MCP `chrome-devtools` (QA Visual y Consola)
- **Cuándo usarlo**: Al implementar tareas que modifiquen la interfaz (`UI/DOM/CSS`) y obligatoriamente durante la fase `/sdd-validate`.
- **Protocolo de verificación en 5 pasos**:
  1. Abre la URL local o el archivo `index.html` en Chrome mediante el MCP.
  2. Ejecuta las interacciones definidas en los `RF-x` de la spec activa (formularios, botones, estados).
  3. Inspecciona la consola del navegador (`Console`) y verifica que existan `0 errores` y `0 excepciones no controladas`.
  4. Ajusta el viewport a tamaño móvil (`375 px` de ancho) y toma una captura para comprobar que no haya solapamientos ni scroll horizontal.
  5. Reporta al usuario qué comprobaste exactamente y el resultado.

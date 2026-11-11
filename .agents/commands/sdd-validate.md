---
description: SDD - Valida la spec RF por RF (node --test + Chrome DevTools)
agent: build
---
Recorre `specs/$1/spec.md` requisito por requisito (`RF-x` y `RNF-x`).
1. Para cada requisito de lógica, indica qué test lo cubre y el resultado de ejecutarlo con `node --test`.
2. Los requisitos de interfaz que no se puedan testear con `node --test`, verifícalos con el MCP de Chrome DevTools (consola sin errores + vista móvil de `375 px`).
3. Si algún requisito no está cubierto o falla, dilo claramente. NO arregles nada todavía.
4. Comprueba los criterios de finalización y dame un veredicto final: ¿la spec está cumplida?

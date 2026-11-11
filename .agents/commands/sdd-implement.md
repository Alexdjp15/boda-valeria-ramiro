---
description: SDD - Implementa UNA tarea con TDD (uso: /sdd-implement 001-nombre T1)
agent: build
---
Implementa SOLO la tarea `$2` de `specs/$1/tasks.md`, siguiendo `specs/$1/plan.md`, `docs/constitution.md` y las skills `sdd` y `domain-guardrails`.
1. Escribe primero los tests en `tests/` y comprueba que fallan (rojo).
2. Escribe el código necesario hasta que pasen (verde).
3. Ejecuta `node --test` y muéstrame el resultado por consola.
4. Si la tarea incluye cambios visuales, verifícalos con el MCP de Chrome DevTools (incluida la vista móvil de `375 px`).
5. Marca `$2` como hecha (`[x]`) en `specs/$1/tasks.md`, actualiza `MEMORY.md` e indica qué `RF-x` cubre.
Después PÁRATE. No empieces la siguiente tarea.

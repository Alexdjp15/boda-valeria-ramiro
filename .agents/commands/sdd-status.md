---
description: SDD - Muestra en qué fase estamos y el siguiente comando exacto a ejecutar
agent: plan
---
Lee `specs/$1/` (`spec.md`, `plan.md` y `tasks.md`, los que existan) y `MEMORY.md`.
Dime en pocas líneas:
1. En qué fase del flujo SDD está esta spec y su estado actual.
2. Tareas hechas y pendientes (`x` de `y`).
3. El siguiente paso exacto, con el comando `/sdd-*` que debo ejecutar.
No modifiques ningún archivo.

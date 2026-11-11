---
description: SDD - Divide el plan en tareas pequeñas y verificables
agent: plan
---
A partir de `specs/$1/spec.md` y `specs/$1/plan.md`, genera `specs/$1/tasks.md` siguiendo el formato de la skill `sdd`:
- Tareas pequeñas (máx. 20-30 min cada una), en orden de dependencia.
- Cada una con los `RF-x` que cubre y una línea `Hecho cuando:` verificable.
- Formato de lista con checkboxes (`- [ ]`).
- Intenta que no sean más de 10 tareas: si salen más, propón cómo dividir la spec.

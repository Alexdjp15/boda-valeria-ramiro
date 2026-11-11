# Habilidades del Agente (`.agents/skills/`)

Este directorio almacena las **Agent Skills** del proyecto. A diferencia de `AGENTS.md` (que se lee siempre), las skills son modulares: el agente solo carga sus instrucciones completas cuando la tarea lo requiere o cuando las invocas con `@nombre-skill` o `/skills`.

## Skills incluidas de serie en esta plantilla
1. `sdd` (`.agents/skills/sdd/SKILL.md`): Reglas completas del flujo Spec-Driven Development, sintaxis EARS y plantillas.
2. `domain-guardrails` (`.agents/skills/domain-guardrails/SKILL.md`): Prevención de errores de zona horaria (UTC vs Local), pureza de funciones y migración segura de datos.
3. `mcp-orchestration` (`.agents/skills/mcp-orchestration/SKILL.md`): Protocolo para usar los MCPs de `context7` y `chrome-devtools`.

## Cómo instalar el Starter Pack de Skills externas
Ejecuta el script incluido en `scripts/install-skills.ps1` (Windows) o `scripts/install-skills.sh` (Linux/macOS), o corre estos comandos en la terminal:

```bash
npx skills add vercel-labs/agent-skills
npx skills add https://github.com/anthropics/skills --skill frontend-design
```

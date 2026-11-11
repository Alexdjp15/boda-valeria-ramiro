# Guía de Uso: `plantilla-base-web` v2 (SDD + Multiagente + Skills + MCPs en Antigravity)

Esta plantilla es el molde maestro para iniciar cualquier proyecto de software bajo **Spec-Driven Development (SDD)** e **Ingeniería de Arneses (Harness Engineering)** en **Antigravity** u **OpenCode**.

---

## Paso 1: Clonar e Inicializar un Nuevo Proyecto

1. Copia el contenido de `plantilla-base-web` a la carpeta de tu nuevo proyecto e inicializa Git:
   ```bash
   git init
   ```
2. Instala las **Agent Skills** externas recomendadas ejecutando el script según tu sistema:
   - **Windows (PowerShell)**: `./scripts/install-skills.ps1`
   - **Linux / macOS / Git Bash**: `bash ./scripts/install-skills.sh`
3. Configura tus servidores **MCP** en `mcp_config.json` (o en la configuración MCP de Antigravity):
   - Reemplaza `<TU_APIKEY_DE_CONTEXT7>` por tu clave de Context7 (Upstash).
   - El servidor `chrome-devtools` funciona automáticamente mediante `npx -y chrome-devtools-mcp@latest`.
4. Abre el proyecto en **Antigravity** y ejecuta el comando de arranque:
   ```text
   /init-project Nombre de mi app: qué hace y qué stack quiero usar
   ```
   *(O usa `/sdd-constitution` para definir directamente los 6 principios innegociables en `docs/constitution.md`)*.

---

## Paso 2: Ciclo de Vida SDD Paso a Paso (Mediante Comandos)

Cuando quieras construir una nueva funcionalidad, ejecuta los comandos en orden sin saltarte las aprobaciones:

| Orden | Comando | Fase SDD | Qué hace el agente |
| :--- | :--- | :--- | :--- |
| **1** | `/sdd-constitution` | Constitución | Define o revisa los 6 principios innegociables en `docs/constitution.md`. |
| **2** | `/sdd-spec 001-nombre <idea>` | Especificación | Te hace hasta 5 preguntas (de una en una) y genera `specs/001-nombre/spec.md` en notación EARS. |
| **3** | `/sdd-clarify 001-nombre` | Clarificación | Revisa `spec.md` como un auditor QA buscando ambigüedades, contradicciones o casos límite. |
| **4** | `/sdd-plan 001-nombre` | Planificación | Genera `specs/001-nombre/plan.md` con arquitectura, funciones puras, pseudocódigo y estrategia de tests. |
| **5** | `/sdd-tasks 001-nombre` | Tareas | Desglosa el plan en `specs/001-nombre/tasks.md` (máx. 10 tareas de 20-30 min con criterio `Hecho cuando:`). |
| **6** | `/sdd-implement 001-nombre T1` | Implementación | Implementa **solo la tarea T1** usando TDD (`node --test` en rojo -> código -> verde) y para. |
| **7** | `/sdd-validate 001-nombre` | Validación | Audita cada `RF-x` con `node --test` y abre la app con el MCP de **Chrome DevTools** (consola + móvil 375 px). |
| **Extra** | `/sdd-change 001-nombre <cambio>` | Mantenimiento | Actualiza primero `spec.md` mostrando el diff antes de propagar cambios al plan y al código. |
| **Extra** | `/sdd-status 001-nombre` | Estado | Muestra en qué fase estás, cuántas tareas llevas (`x` de `y`) y qué comando ejecutar a continuación. |

---

## Paso 3: Cómo usar el Sistema Multiagente Autónomo

Si prefieres que el agente coordine las 7 fases delegando automáticamente en subagentes especializados con permisos restringidos:

1. Selecciona el agente **`@coordinator`** (o invócalo al inicio del mensaje).
2. Escribe tu petición:
   ```text
   @coordinator Quiero añadir [descripción de la funcionalidad]. Sigue el flujo SDD completo.
   ```
3. El coordinador llamará por turnos a:
   - **`@planner`**: Solo tiene permiso para escribir dentro de `specs/**`.
   - **`@reviewer`**: Solo lectura y ejecución de `node --test` y `git diff`.
   - **`@implementer`**: Ejecuta una tarea a la vez con TDD y verificación en Chrome DevTools.

### Truco Avanzado: Auditoría Paralela con Triple `@reviewer`
Al finalizar una especificación importante, lanza este prompt para auditar en paralelo sin saturar la ventana de contexto:
```text
Lanza en paralelo tres @reviewer sobre la spec 001-nombre, cada uno con un foco distinto:
1. Constitución y reglas de dominio (skill domain-guardrails).
2. Interfaz: accesibilidad, consola limpia y vista móvil (375 px) con el MCP de Chrome DevTools.
3. Tests: qué RF están cubiertos por node --test y cuáles faltan.
Cuando terminen los tres, unifica sus hallazgos en un único informe sin duplicados con un veredicto final.
```

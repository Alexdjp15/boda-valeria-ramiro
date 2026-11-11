#!/usr/bin/env bash
# Script de instalación de Agent Skills para Antigravity / OpenCode (Linux / macOS / Git Bash)
set -e

echo "Instalando paquete base de Agent Skills (Vercel Labs)..."
npx -y skills add vercel-labs/agent-skills

echo "Instalando skill de diseño Frontend profesional (Anthropic)..."
npx -y skills add https://github.com/anthropics/skills --skill frontend-design

echo "¡Skills externas instaladas correctamente! Verifica el directorio .agents/skills/"

# Script de instalación de Agent Skills para Antigravity / OpenCode (Windows PowerShell)
Write-Host "Instalando paquete base de Agent Skills (Vercel Labs)..." -ForegroundColor Cyan
npx -y skills add vercel-labs/agent-skills

Write-Host "Instalando skill de diseño Frontend profesional (Anthropic)..." -ForegroundColor Cyan
npx -y skills add https://github.com/anthropics/skills --skill frontend-design

Write-Host "¡Skills externas instaladas correctamente! Verifica el directorio .agents/skills/" -ForegroundColor Green

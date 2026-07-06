# Git Workflow

Mantener permanentemente este flujo.

1. **feature branch**: Desarrollar la funcionalidad.
2. **staging**: Pruebas en entorno de integración.
3. **QA**: Aseguramiento de calidad.
4. **merge a master**: Fusión tras aprobación.
5. **push**: Enviar a origen automáticamente al finalizar el Sprint.
6. **deploy**: Vercel despliega master.
7. **validación producción**: Verificar la URL final de producción.

_Excepción_: Solo si el Sprint es un Hotfix crítico autorizado podrá hacerse directamente sobre master.

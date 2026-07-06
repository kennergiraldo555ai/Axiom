# AXIOM Workspace Architecture

## El Problema del Contexto

El contexto del Workspace debe obtenerse siempre mediante `WorkspaceContextService`. Nunca obtener el `workspaceId` manualmente o pasarlo desde el cliente cuando no es estrictamente necesario.

## Reglas

1. Usa `requireWorkspace()` en Server Actions.
2. El frontend no debe enviar el `workspaceId` si el servidor puede inferirlo del contexto del usuario.

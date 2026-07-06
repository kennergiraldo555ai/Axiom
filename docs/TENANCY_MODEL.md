# Tenancy Model

AXIOM usa un modelo de Multi-Tenancy donde:

1. **User**: Representa a la persona física (vinculado a Supabase Auth UUID).
2. **Workspace**: Representa a la empresa u organización.
3. **Membership**: Tabla pivote que define el rol (OWNER, ADMIN, MEMBER) del User en el Workspace.

**Regla de Oro**: Ningún modelo del negocio (Prospect, Lead, etc.) debe pertenecer directamente a un User, siempre pertenecen a un Workspace.

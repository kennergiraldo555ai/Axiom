# Domain-Driven Design (DDD) Rules

La aplicación se divide en Módulos (ej. Growth, CRM). Cada módulo tiene:

1. **Domain**: Entidades puras y Repositorios (Interfaces).
2. **Application**: Use Cases. Solo los Use Cases orquestan la lógica de negocio.
3. **Infrastructure**: Implementación de repositorios (Prisma).
4. **Presentation**: Server Actions y UI.

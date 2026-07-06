# Server Action Rules

1. Las Server Actions (`presentation/actions.ts`) deben ser _delgadas_. Su única responsabilidad es extraer la sesión, llamar al Use Case y devolver el resultado o manejar errores.
2. No incluir reglas de negocio en las Server Actions.
3. Toda entrada debe ser validada con Zod antes de procesarse.

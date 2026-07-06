# AXIOM Project Permanent Guidelines

## Filosofía de Diseño Permanente

Toda interfaz futura deberá transmitir las siguientes sensaciones: Profesional, Elegante, Moderna, Tecnológica, Minimalista, Muy limpia, Rápida, Premium.
Nunca deberá sentirse como un dashboard genérico. El usuario debe percibir inmediatamente que está utilizando un software de alta calidad.

## Lineamientos Visuales Permanentes

Aplicar en todas las pantallas del proyecto:

- Dark Mode como único modo durante el MVP.
- Tipografía única: Inter.
- Paleta principal basada en morados y azules. Acentos únicamente donde realmente aporten jerarquía.
- Bordes redondeados consistentes.
- Espaciado basado en múltiplos de 8 px.
- Sombras muy suaves, alto contraste, mucho espacio en blanco.
- Iconografía consistente (Lucide).
- Animaciones discretas.
- Skeletons antes que spinners.
- Jerarquía visual muy clara.

Inspiración: Linear, Stripe, Raycast, Notion, Vercel, Apple. No copiar interfaces, tomar principios.

## Reutilización

Antes de crear un componente nuevo: Buscar si ya existe uno reutilizable en `src/modules/_shared/components/`.
Si puede extenderse: Extiéndelo. No dupliques componentes, estilos o lógica.

## Experiencia de Usuario (UX)

Toda interacción debe sentirse inmediata.
Priorizar: Skeletons, Transiciones suaves, Feedback instantáneo, Estados vacíos útiles, Errores explicativos, Acciones claras.
Nunca dejar al usuario preguntándose qué ocurrió.

## Revisión Obligatoria (Fin de Sprint)

Antes de cerrar cualquier Sprint con interfaz gráfica, realiza tres revisiones adicionales y documéntalas en `walkthrough.md`:

1. UX Review (Claridad, Flujo, Jerarquía, Consistencia, Accesibilidad, Velocidad percibida)
2. Design Review (Espaciado, Tipografía, Colores, Contraste, Componentes, Responsive, Microinteracciones)
3. Performance Review (Server Components, Client Components, Bundle, Renders, Lazy Loading, Streaming, Optimización)
4. Product Review (¿Qué sensación transmite? ¿Qué tan cerca de Enterprise? ¿Qué parece MVP? ¿Qué parece terminado? ¿Qué mejoraría Linear/Stripe?)

## Despliegue Obligatorio (Fin de Sprint)

Al finalizar el Sprint:

1. Ejecutar: `pnpm lint`, `pnpm typecheck`, `pnpm build`
2. Realizar commit y Push a master.
3. Esperar el despliegue automático de Vercel y verificar la aplicación en producción.
4. Entregar la URL pública definitiva y confirmar que el flujo principal funciona correctamente.
   Solo entonces podrá darse por finalizado el Sprint.

## Reglas de Producto y Nomenclatura Permanente

1. **AXIOM no es un Dashboard:** Es un motor de inteligencia comercial. Cada pantalla debe responder preguntas clave de negocio (ej. "¿A quién debería venderle?", "¿Cuál es el siguiente negocio al que debo venderle?").
2. **Jerarquía Visual Estricta:** Los datos de negocio importan más que los técnicos. El Score, Prioridad, y Acciones Recomendadas deben ser protagonistas por encima de IDs, direcciones o hashes.
3. **La IA es Protagonista:** El análisis de IA no puede ser texto plano. Debe estructurarse claramente en: Resumen, Fortalezas, Problemas, Oportunidades, Servicios recomendados, Prioridad, Probabilidad de cierre, Próximo paso.
4. **Nomenclatura (Cero Barberías):** Prohibido usar "Barberías" en código (salvo ejemplos locales). Todo se llama: `Business`, `Prospect`, `Lead`, `Opportunity`, `Industry`, `Business Category`, `Solution`, `Service Recommendation`.
5. **Navegación Impecable:** El usuario nunca debe sentirse perdido. Siempre debe haber visible: Estado actual, Próximo paso, Acción principal y Acción secundaria.

## Reglas Growth 1.0 y Arquitectura Escalable

1. **Gestión del Estado:** Uso de Zustand permitido ÚNICAMENTE para estado visual temporal (paneles, filtros, drag&drop). NUNCA para almacenar datos de negocio. Toda la data del CRM viene del servidor usando Server Actions y `useOptimistic`.
2. **Localización (ES UI / EN Code):** La interfaz debe estar 100% en español (Ej: Embudo, Cliente potencial, Configuración). El código debe estar 100% en inglés (Ej: Pipeline, Lead, Settings).
3. **UX Enterprise:** Cada pantalla debe ser premium y responder: ¿Qué hace?, ¿Por qué es útil? y ¿Qué debo hacer después?. Menos tablas, más visualización y contexto útil.
4. **IA First:** El diseño siempre debe contemplar cómo la IA (Agentes, RAG, Summaries) puede mejorar la experiencia, incluso si se implementa después.
5. **Componentes:** Buscar -> Extender -> Reutilizar. Solo crear componentes nuevos si es absolutamente necesario.
6. **Escalabilidad:** Diseñar el sistema anticipando integraciones futuras con WhatsApp, Email, LinkedIn, MCP, Multiagentes y Embeddings. Cero refactors masivos.
7. **Filosofía AXIOM:** Cada nueva funcionalidad debe responder afirmativamente a: "¿Esto ayuda realmente al usuario a vender más?".

## Protocolo Obligatorio de Entrega

Al finalizar CUALQUIER Sprint, Hotfix, Refactor, Feature o Corrección, SIEMPRE debes ejecutar este flujo completo de manera automática:

1. Resolver completamente la tarea.
2. Corregir cualquier error encontrado.
3. Ejecutar pnpm lint, pnpm typecheck, pnpm build.
4. Realizar pruebas funcionales.
5. git add . && git commit (usando Conventional Commits).
6. git push origin master automáticamente.
7. Esperar despliegue de Vercel y verificar URL en producción.
8. Entregar el Informe Final Obligatorio estructurado.
   No mientas sobre haber hecho commit, push o verificación si hubo un problema técnico.

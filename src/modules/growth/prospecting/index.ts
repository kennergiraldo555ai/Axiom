export * from "./domain/entities/prospect.entity";
export * from "./domain/dtos/prospect-query.dto";
export * from "./domain/repositories/prospect.repository";
export * from "./domain/services/prospect.service";

export * from "./application/validators/prospect.validator";
export * from "./application/use-cases/search-prospects.use-case";
export * from "./application/use-cases/analyze-prospect.use-case";
export * from "./application/use-cases/query-prospects.use-case";

export * from "./infrastructure/repositories/prisma-prospect.repository";

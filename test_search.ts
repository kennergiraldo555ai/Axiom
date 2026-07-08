import { PrismaClient } from "@prisma/client";
import { SearchProspectsUseCase } from "./src/modules/growth/prospecting/application/use-cases/search-prospects.use-case";
import { PrismaProspectRepository } from "./src/modules/growth/prospecting/infrastructure/repositories/prisma-prospect.repository";

const prisma = new PrismaClient();
const repo = new PrismaProspectRepository();
const useCase = new SearchProspectsUseCase(repo);

async function run() {
  try {
    const workspace = await prisma.workspace.findFirst();
    if (!workspace) throw new Error("No workspace");

    console.log("Testing with workspace:", workspace.id);
    const result = await useCase.execute({
      workspaceId: workspace.id,
      query: "Restaurantes en Madrid, Espa�a",
      location: { lat: 40.4168, lng: -3.7038 },
    });

    console.log("Success:", result.length);
  } catch (err) {
    console.error("FAILED!", err);
  } finally {
    await prisma.$disconnect();
  }
}

run();

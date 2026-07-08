import { PrismaProspectRepository } from "C:/Users/kenne/Desktop/Axiom/src/modules/growth/prospecting/infrastructure/repositories/prisma-prospect.repository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const repo = new PrismaProspectRepository();

async function run() {
  try {
    let workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: "Test Workspace",
          slug: "test-workspace-" + Date.now(),
        },
      });
    }

    console.warn("Using workspace:", workspace.id);

    const prospect = await repo.save({
      workspaceId: workspace.id,
      placeId: "test_place_" + Date.now(),
      name: "Test Prospect",
      address: null,
      phone: null,
      website: null,
      rating: null,
      userRatingsCount: null,
      priceLevel: null,
      businessStatus: null,
      googleUrl: null,
      lat: null,
      lng: null,
      categoryId: null,
      cityId: null,
      email: null,
      metadata: { provider: "test" },
      analysisStatus: "PENDING",
      qualityScore: null,
      scoreRationale: null,
      signals: null,
      opportunities: null,
      analyzedAt: null,
      analyzedByModel: null,
      messageDraft: null,
      messageDraftModel: null,
      messageDraftAt: null,
      messageEdited: null,
      userNotes: null,
      convertedToLeadId: null,
      deletedAt: null,
    });
    console.warn("Success:", prospect.id);
  } catch (error) {
    console.error("Test failed with error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

run();

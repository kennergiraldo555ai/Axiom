import { searchProspectsAction } from "@/modules/growth/prospecting/presentation/actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await searchProspectsAction("Barberias en Pereira, Colombia", {
      lat: 4.8133,
      lng: -75.6961,
    });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return NextResponse.json({ error: String(error), stack: (error as Error).stack });
  }
}

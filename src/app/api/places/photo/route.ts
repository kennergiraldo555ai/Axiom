import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Missing id", { status: 400 });
  }

  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    return new NextResponse("Missing API key", { status: 500 });
  }

  return NextResponse.redirect(
    `https://places.googleapis.com/v1/${id}/media?maxHeightPx=400&maxWidthPx=400&key=${key}`,
  );
}

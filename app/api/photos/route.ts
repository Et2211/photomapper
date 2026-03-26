import { NextResponse } from "next/server";

import { getPhotos } from "@/lib/photos";

export const GET = async () => {
  try {
    const photos = await getPhotos();
    return NextResponse.json(photos);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch photos" },
      { status: 500 }
    );
  }
};

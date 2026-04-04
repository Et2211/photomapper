import { type NextRequest, NextResponse } from "next/server";

import { getPhotos, getPhotosByUsername } from "@/lib/photos";

export const GET = async (request: NextRequest) => {
  try {
    const username = request.nextUrl.searchParams.get("username");
    const photos = username ? await getPhotosByUsername(username) : await getPhotos();
    return NextResponse.json(photos);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch photos" },
      { status: 500 }
    );
  }
};

import { HttpResponse, http } from "msw";

import type { Photo } from "@/types";

export const mockPhotos: Photo[] = [
  {
    id: "1",
    user_id: "user-1",
    username: "testuser",
    photo_name: "Test Photo",
    lat: 34.05,
    lng: -118.24,
    url: "https://picsum.photos/seed/test/400/400",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: null,
    username: "anotheruser",
    photo_name: "Another Photo",
    lat: 40.71,
    lng: -74.0,
    url: "https://picsum.photos/seed/test2/400/400",
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
];

export const handlers = [
  http.get("http://localhost/api/photos", () => HttpResponse.json(mockPhotos)),
  http.post("http://localhost/api/upload", () => HttpResponse.json(mockPhotos[0])),
];

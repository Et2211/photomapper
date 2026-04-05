export interface Photo {
  id: string;
  user_id: string | null;
  username: string;
  photo_name: string;
  lat: number;
  lng: number;
  url: string;
  created_at: string;
}

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  updated_at: string;
}

export interface UploadPayload {
  username: string;
  photoName: string;
  lat: number;
  lng: number;
  imageData: string;
  fileName: string;
}

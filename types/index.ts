export interface Photo {
  id: string;
  username: string;
  photo_name: string;
  lat: number;
  lng: number;
  url: string;
  created_at: string;
}

export interface UploadPayload {
  username: string;
  photoName: string;
  lat: number;
  lng: number;
  imageData: string; // base64 data URL
  fileName: string;
}

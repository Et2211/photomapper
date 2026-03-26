import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase, isConfigured } from '@/lib/supabase';
import { insertPhoto } from '@/lib/photos';

const uploadSchema = z.object({
  username: z.string().min(1).max(50),
  photoName: z.string().min(1).max(100),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  imageData: z.string().startsWith('data:image/'),
  fileName: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = uploadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (!isConfigured || !supabase) {
      return NextResponse.json(
        { error: 'Storage not configured. Please add Supabase environment variables.' },
        { status: 503 }
      );
    }

    const { username, photoName, lat, lng, imageData, fileName } = parsed.data;

    // Convert base64 to buffer for Supabase Storage
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const safeFileName = fileName.replace(/[^a-z0-9.]/gi, '_');
    const storageKey = `photos/${Date.now()}-${safeFileName}.jpg`;

    const { error: storageError } = await supabase.storage
      .from('photomapper')
      .upload(storageKey, buffer, { contentType: 'image/jpeg', upsert: false });

    if (storageError) throw storageError;

    const { data: { publicUrl } } = supabase.storage
      .from('photomapper')
      .getPublicUrl(storageKey);

    const photo = await insertPhoto({ username, photo_name: photoName, lat, lng, url: publicUrl });

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

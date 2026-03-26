'use client';

import { useState, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { useAppDispatch } from '@/store';
import { setUploadOpen } from '@/store/uiSlice';
import { useUploadPhotoMutation } from '@/store/photosApi';
import { resizeImage } from '@/lib/image';

const MapView = dynamic(() => import('@/components/Map/MapView'), { ssr: false });

const schema = z.object({
  username: z.string().min(1, 'Username is required').max(50),
  photoName: z.string().min(1, 'Photo name is required').max(100),
});

type FormData = z.infer<typeof schema>;

export default function UploadModal() {
  const dispatch = useAppDispatch();
  const [uploadPhoto, { isLoading }] = useUploadPhotoMutation();
  const [pickedLocation, setPickedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleClose = () => {
    reset();
    setPickedLocation(null);
    setImageData(null);
    setImagePreview(null);
    setImageFile(null);
    setSubmitError(null);
    dispatch(setUploadOpen(false));
  };

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    try {
      const resized = await resizeImage(file);
      setImageData(resized);
      setImagePreview(resized);
    } catch {
      setSubmitError('Failed to process image. Please try another file.');
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    if (!pickedLocation) {
      setSubmitError('Please click the map to select a location.');
      return;
    }
    if (!imageData || !imageFile) {
      setSubmitError('Please select an image.');
      return;
    }
    setSubmitError(null);
    try {
      await uploadPhoto({
        username: data.username,
        photoName: data.photoName,
        lat: pickedLocation.lat,
        lng: pickedLocation.lng,
        imageData,
        fileName: imageFile.name,
      }).unwrap();
      handleClose();
    } catch {
      setSubmitError('Upload failed. Make sure Supabase is configured and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white rounded-t-xl">
          <h2 className="text-lg font-semibold">Add Photo</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              {...register('username')}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your_username"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          {/* Photo Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo Name</label>
            <input
              {...register('photoName')}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What's this a photo of?"
            />
            {errors.photoName && <p className="text-red-500 text-xs mt-1">{errors.photoName.message}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
              ) : (
                <p className="text-gray-400 text-sm py-4">Click to select an image</p>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          {/* Location Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location{' '}
              {pickedLocation ? (
                <span className="text-green-600 font-normal text-xs">
                  ({pickedLocation.lat.toFixed(4)}, {pickedLocation.lng.toFixed(4)})
                </span>
              ) : (
                <span className="text-gray-400 font-normal text-xs">— click the map to set</span>
              )}
            </label>
            <div className="h-48 rounded-lg overflow-hidden border">
              <MapView
                photos={[]}
                pickingLocation
                onLocationPick={(lat, lng) => setPickedLocation({ lat, lng })}
                pickedLocation={pickedLocation}
              />
            </div>
          </div>

          {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg px-4 py-2.5 font-medium text-sm transition-colors"
          >
            {isLoading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </form>
      </div>
    </div>
  );
}

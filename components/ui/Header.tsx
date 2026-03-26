'use client';

import { useAppDispatch } from '@/store';
import { setUploadOpen } from '@/store/uiSlice';
import { useGetPhotosQuery } from '@/store/photosApi';

export default function Header() {
  const dispatch = useAppDispatch();
  const { refetch } = useGetPhotosQuery();

  return (
    <header className="h-14 bg-gray-900 text-white flex items-center justify-between px-4 shrink-0">
      <span className="text-lg font-bold tracking-tight">Photomapper</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => refetch()}
          className="text-sm px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          Refresh
        </button>
        <button
          onClick={() => dispatch(setUploadOpen(true))}
          className="text-sm px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 transition-colors font-medium"
        >
          + Add Photo
        </button>
      </div>
    </header>
  );
}

"use client";

import { createClient } from "@/lib/supabase-browser";
import { useAppDispatch, useAppSelector } from "@/store";
import { useGetPhotosQuery } from "@/store/photosApi";
import { setAuthOpen, setUploadOpen } from "@/store/uiSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const { refetch } = useGetPhotosQuery();
  const user = useAppSelector((state) => state.auth.user);
  const supabase = createClient();

  const handleAddPhoto = () => {
    if (user) {
      dispatch(setUploadOpen(true));
    } else {
      dispatch(setAuthOpen(true));
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="h-14 bg-gray-900 text-white flex items-center justify-between px-4 shrink-0">
      <span className="text-lg font-bold tracking-tight">Photomapper</span>
      <div className="flex items-center gap-2">
        {user && (
          <span className="text-xs text-gray-400 hidden sm:block truncate max-w-[160px]">
            {user.email}
          </span>
        )}
        <button
          onClick={() => refetch()}
          className="text-sm px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          Refresh
        </button>
        {user ? (
          <>
            <button
              onClick={() => dispatch(setUploadOpen(true))}
              className="text-sm px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 transition-colors font-medium"
            >
              + Add Photo
            </button>
            <button
              onClick={handleSignOut}
              className="text-sm px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleAddPhoto}
              className="text-sm px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 transition-colors font-medium"
            >
              + Add Photo
            </button>
            <button
              onClick={() => dispatch(setAuthOpen(true))}
              className="text-sm px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Log in
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

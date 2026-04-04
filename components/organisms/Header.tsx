"use client";

import Link from "next/link";

import Button from "@/components/atoms/Button";
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
          <>
            <span className="text-xs text-gray-400 hidden sm:block truncate max-w-[160px]">{user.email}</span>
            <Link href="/profile" className="hidden sm:block text-xs text-gray-300 hover:text-white transition-colors">
              Profile
            </Link>
          </>
        )}
        <Button onClick={() => refetch()}>Refresh</Button>
        {user ? (
          <>
            <Button variant="primary" onClick={() => dispatch(setUploadOpen(true))}>
              + Add Photo
            </Button>
            <Button onClick={handleSignOut}>Sign out</Button>
          </>
        ) : (
          <>
            <Button variant="primary" onClick={handleAddPhoto}>
              + Add Photo
            </Button>
            <Button onClick={() => dispatch(setAuthOpen(true))}>Log in</Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


import DeleteConfirmModal from "@/components/molecules/DeleteConfirmModal";
import EditPhotoModal from "@/components/molecules/EditPhotoModal";
import BottomNav from "@/components/organisms/BottomNav";
import Header from "@/components/organisms/Header";
import ProfileFeed from "@/components/organisms/ProfileFeed";
import ProfileHeader from "@/components/organisms/ProfileHeader";
import ProfileMap from "@/components/organisms/ProfileMap";
import { useAppSelector } from "@/store";
import type { Photo } from "@/types";

const ProfilePage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const profileView = useAppSelector((state) => state.ui.profileView);
  const router = useRouter();

  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [deletingPhoto, setDeletingPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    if (user === null) {
      router.replace("/");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-dvh">
      <Header />
      <ProfileHeader />
      <div className="flex-1 overflow-hidden">
        {profileView === "map" ? <ProfileMap /> : <ProfileFeed onEdit={setEditingPhoto} onDelete={setDeletingPhoto} />}
      </div>
      <BottomNav />
      <EditPhotoModal isOpen={editingPhoto !== null} photo={editingPhoto} onClose={() => setEditingPhoto(null)} />
      <DeleteConfirmModal
        isOpen={deletingPhoto !== null}
        photo={deletingPhoto}
        onClose={() => setDeletingPhoto(null)}
      />
    </div>
  );
};

export default ProfilePage;

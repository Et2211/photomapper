"use client";

import { useState } from "react";

import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import EditProfileModal from "@/components/molecules/EditProfileModal";
import ViewToggle from "@/components/molecules/ViewToggle";
import { useAppSelector } from "@/store";
import { useGetUserPhotosQuery } from "@/store/photosApi";

const ProfileHeader = () => {
  const user = useAppSelector((state) => state.auth.user);
  const displayName = useAppSelector((state) => state.auth.displayName);
  const avatarUrl = useAppSelector((state) => state.auth.avatarUrl);
  const username = user?.email ?? "";
  const shownName = displayName ?? username;
  const { data: photos = [] } = useGetUserPhotosQuery(username, { skip: !username });

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {avatarUrl && <Avatar src={avatarUrl} alt={shownName} size="sm" circle />}
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate max-w-[200px]">{shownName}</p>
            <p className="text-xs text-gray-400">
              {photos.length} {photos.length === 1 ? "photo" : "photos"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" onClick={() => setIsEditingProfile(true)}>
            Edit profile
          </Button>
          <ViewToggle />
        </div>
      </div>
      <EditProfileModal
        isOpen={isEditingProfile}
        currentDisplayName={displayName}
        onClose={() => setIsEditingProfile(false)}
      />
    </>
  );
};

export default ProfileHeader;

"use client";

import ViewToggle from "@/components/molecules/ViewToggle";
import { useAppSelector } from "@/store";
import { useGetUserPhotosQuery } from "@/store/photosApi";


const ProfileHeader = () => {
  const user = useAppSelector((state) => state.auth.user);
  const username = user?.email ?? "";
  const { data: photos = [] } = useGetUserPhotosQuery(username, { skip: !username });

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shrink-0">
      <div>
        <p className="font-semibold text-gray-900 text-sm truncate max-w-[200px]">{username}</p>
        <p className="text-xs text-gray-400">
          {photos.length} {photos.length === 1 ? "photo" : "photos"}
        </p>
      </div>
      <ViewToggle />
    </div>
  );
};

export default ProfileHeader;

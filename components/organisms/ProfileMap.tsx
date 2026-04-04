"use client";

import dynamic from "next/dynamic";

import Spinner from "@/components/atoms/Spinner";
import { useAppSelector } from "@/store";
import { useGetUserPhotosQuery } from "@/store/photosApi";


const MapCanvas = dynamic(() => import("@/components/molecules/MapCanvas"), { ssr: false });

const ProfileMap = () => {
  const user = useAppSelector((state) => state.auth.user);
  const username = user?.email ?? "";
  const { data: photos = [], isLoading } = useGetUserPhotosQuery(username, { skip: !username });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return <MapCanvas photos={photos} />;
};

export default ProfileMap;

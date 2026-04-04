"use client";

import dynamic from "next/dynamic";

import AuthModal from "@/components/Auth/AuthModal";
import PhotoFeed from "@/components/Feed/PhotoFeed";
import BottomNav from "@/components/ui/BottomNav";
import Header from "@/components/ui/Header";
import UploadModal from "@/components/Upload/UploadModal";
import { useAppSelector } from "@/store";
import { useGetPhotosQuery } from "@/store/photosApi";

const MapView = dynamic(() => import("@/components/Map/MapView"), { ssr: false });

const Home = () => {
  const { data: photos = [] } = useGetPhotosQuery();
  const { mobileTab, isUploadOpen, isAuthOpen } = useAppSelector((state) => state.ui);

  return (
    <div className="flex flex-col h-dvh">
      <Header />

      {/* Desktop: side-by-side feed + map */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <aside className="w-72 border-r flex flex-col overflow-hidden">
          <PhotoFeed />
        </aside>
        <main className="flex-1">
          <MapView photos={photos} />
        </main>
      </div>

      {/* Mobile: toggled by bottom nav */}
      <div className="flex md:hidden flex-1 overflow-hidden">
        {mobileTab === "feed" ? (
          <div className="flex-1 overflow-hidden">
            <PhotoFeed />
          </div>
        ) : (
          <div className="flex-1">
            <MapView photos={photos} />
          </div>
        )}
      </div>

      <BottomNav />

      {isUploadOpen && <UploadModal />}
      {isAuthOpen && <AuthModal />}
    </div>
  );
};

export default Home;

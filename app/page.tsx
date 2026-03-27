"use client";

import AuthModal from "@/components/organisms/AuthModal";
import BottomNav from "@/components/organisms/BottomNav";
import Header from "@/components/organisms/Header";
import MapView from "@/components/organisms/MapView";
import PhotoFeed from "@/components/organisms/PhotoFeed";
import UploadModal from "@/components/organisms/UploadModal";
import { useAppSelector } from "@/store";

const Home = () => {
  const { mobileTab, isUploadOpen, isAuthOpen } = useAppSelector((state) => state.ui);

  return (
    <div className="flex flex-col h-screen">
      <Header />

      {/* Desktop: side-by-side feed + map */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <aside className="w-72 border-r flex flex-col overflow-hidden">
          <PhotoFeed />
        </aside>
        <main className="flex-1">
          <MapView />
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
            <MapView />
          </div>
        )}
      </div>

      <BottomNav />

      <UploadModal isOpen={isUploadOpen} />
      <AuthModal isOpen={isAuthOpen} />
    </div>
  );
};

export default Home;

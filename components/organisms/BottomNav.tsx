"use client";

import { usePathname, useRouter } from "next/navigation";

import NavTab from "@/components/molecules/NavTab";
import { useAppDispatch, useAppSelector } from "@/store";
import { setMobileTab } from "@/store/uiSlice";

const BottomNav = () => {
  const dispatch = useAppDispatch();
  const mobileTab = useAppSelector((state) => state.ui.mobileTab);
  const pathname = usePathname();
  const router = useRouter();
  const onProfile = pathname === "/profile";

  return (
    <nav className="bg-gray-900 text-white md:hidden shrink-0 border-t border-gray-700 pb-[env(safe-area-inset-bottom)]">
      <div className="h-16 flex">
        <NavTab
          label="Map"
          active={!onProfile && mobileTab === "map"}
          onClick={() => {
            router.push("/");
            dispatch(setMobileTab("map"));
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </NavTab>
        <NavTab
          label="Feed"
          active={!onProfile && mobileTab === "feed"}
          onClick={() => {
            router.push("/");
            dispatch(setMobileTab("feed"));
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </NavTab>
        <NavTab label="Profile" active={onProfile} onClick={() => router.push("/profile")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </NavTab>
      </div>
    </nav>
  );
};

export default BottomNav;

import type { ReactNode } from "react";

interface NavTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

const NavTab = ({ label, active, onClick, children }: NavTabProps) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center gap-1 text-xs transition-colors ${
      active ? "text-blue-400" : "text-gray-400 hover:text-gray-200"
    }`}
  >
    {children}
    {label}
  </button>
);

export default NavTab;

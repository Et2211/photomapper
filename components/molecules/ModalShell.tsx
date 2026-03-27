import type { ReactNode } from "react";

interface ModalShellProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: "sm" | "lg";
  scrollable?: boolean;
}

const maxWidthMap = { sm: "max-w-sm", lg: "max-w-lg" };

const ModalShell = ({
  title,
  onClose,
  children,
  maxWidth = "sm",
  scrollable = false,
}: ModalShellProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div
      className={`bg-white rounded-xl shadow-2xl w-full ${maxWidthMap[maxWidth]} ${
        scrollable ? "max-h-[90vh] overflow-y-auto" : ""
      }`}
    >
      <div
        className={`flex items-center justify-between p-4 border-b ${
          scrollable ? "sticky top-0 bg-white rounded-t-xl" : ""
        }`}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center"
        >
          &times;
        </button>
      </div>
      {children}
    </div>
  </div>
);

export default ModalShell;

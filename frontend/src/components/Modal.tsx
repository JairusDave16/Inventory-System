import React, { ReactNode } from "react";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: "sm" | "md" | "lg";
}

export const Modal = ({ title, children, onClose, size = "md" }: ModalProps) => {
  const sizeClass =
    size === "sm"
      ? "max-w-sm"
      : size === "lg"
      ? "max-w-3xl"
      : "max-w-xl";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl w-full ${sizeClass} mx-4 overflow-hidden`}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

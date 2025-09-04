// src/components/Modal.tsx
import React, { ReactNode } from "react";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: "sm" | "md" | "lg";
}

export const Modal = ({ title, children, onClose, size = "md" }: ModalProps) => {
  const sizeClass =
    size === "sm" ? "modal-sm" : size === "lg" ? "modal-lg" : "modal-md";

  return (
    <div className="modal show d-block">
      <div className={`modal-dialog ${sizeClass}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h5>{title}</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

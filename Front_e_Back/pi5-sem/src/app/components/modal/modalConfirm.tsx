// components/ModalConfirm.tsx
import React from "react";
import styles from "./ModalConfirm.module.css";

interface ModalConfirmProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  message?: string;
}

export default function ModalConfirm({
  isOpen,
  onCancel,
  onConfirm,
  message = "Deseja realmente sair?"
}: ModalConfirmProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <p>{message}</p>
        <div className={styles.buttons}>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancelar</button>
          <button className={styles.confirmBtn} onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}

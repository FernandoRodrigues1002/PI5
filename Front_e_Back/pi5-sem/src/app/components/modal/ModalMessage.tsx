import React from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import styles from "./ModalMessage.module.css";

type Props = {
    show: boolean;
    onClose: () => void;
    success: boolean;
    message: string;
};

export default function ModalMessage({ show, onClose, success, message }: Props) {
    if (!show) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.messageContainer}>
                    {success ? (
                        <FaCheckCircle className={styles.successIcon} />
                    ) : (
                        <FaExclamationCircle className={styles.errorIcon} />
                    )}
                    <p className={styles.messageText}>{message}</p>
                </div>

                <button onClick={onClose} className={styles.closeButton}>
                    Fechar
                </button>
            </div>

        </div>
    );
}

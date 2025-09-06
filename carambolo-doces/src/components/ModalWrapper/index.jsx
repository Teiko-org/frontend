import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

function ModalWrapper({ isOpen, onClose, children, className = "" }) {
  const modalRef = useRef(null);

  // Prevenir scroll do body quando modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Compensar scrollbar
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  // Fechar modal com ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Fechar modal ao clicar no backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Renderizar via portal para evitar problemas de z-index
  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      ref={modalRef}
    >
      {/* Backdrop com z-index alto */}
      <div className="absolute inset-0 bg-black bg-opacity-60" />
      
      {/* Conteúdo do modal */}
      <div className={`relative z-[100000] max-w-4xl w-full max-h-[90vh] overflow-y-auto ${className}`}>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default ModalWrapper;

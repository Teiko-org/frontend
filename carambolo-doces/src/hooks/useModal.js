import { useState, useCallback, useEffect } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const openModal = useCallback((data = null) => {
    setModalData(data);
    setIsOpen(true);
    
    // Prevenir scroll do body quando modal estiver aberto
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalData(null);
    
    // Restaurar scroll do body
    document.body.style.overflow = 'unset';
  }, []);

  // Cleanup quando componente for desmontado
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Prevenir que o modal seja fechado por cliques acidentais
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }, [closeModal]);

  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
    handleBackdropClick
  };
};

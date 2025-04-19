import React from 'react';

export default function ModalBaseForm({ isOpen, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-[#FFFFFF] rounded-md shadow-xl p-6 w-[90%] max-w-[600px] relative border border-[#d6a87c]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 text-xl font-bold hover:scale-105"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

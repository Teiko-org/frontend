import React from 'react';

export default function ModalBase({ isOpen, onClose, children, width = '689px', height = '271px' }) {
  // if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="p-[2px] rounded-xl"
        style={{
          background: 'linear-gradient(180deg, #A47032 0%, #D4B076 100%)',
          width,
          height,
          boxSizing: 'border-box',
        }}
      >
        <div
          className="rounded-xl text-white shadow-lg p-6 relative w-full h-full"
          style={{
            background: 'linear-gradient(180deg, #103464 0%, #30344F 100%)',
          }}
        >

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl font-bold hover:scale-105"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              background: 'linear-gradient(180deg, #A47032 0%, #D4B076 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
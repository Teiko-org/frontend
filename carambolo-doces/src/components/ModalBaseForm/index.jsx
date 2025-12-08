import React from 'react';

export default function ModalBaseForm({ isOpen, onClose, title, children }) {
  // if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white shadow-xl relative border border-[#d6a87c] min-w-[803px] min-h-[150px] flex flex-col rounded overflow-hidden">
        {/* HEADER */}
        <div className="bg-bgHome text-blue px-6 py-3 rounded-t overflow-hidden relative z-10">
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-red text-xl font-bold hover:scale-105 z-20"
          >
            ✕
          </button>
          <h2 className="text-lg font-bold whitespace-nowrap">{title}</h2>
        </div>
          <div
            className="h-[2px] flex-shrink-0"
            style={{
              background: 'linear-gradient(0deg, #A47032 0%, #D4B076 100%)',
            }}
          ></div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-bgNativeHome rounded-b">
          {children}
        </div>
      </div>
    </div>
  );
}

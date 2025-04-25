import React from 'react';

export default function ModalBaseForm({ isOpen, onClose, title, children }) {
  // if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white shadow-xl relative border border-[#d6a87c] min-w-[803px] min-h-[150px] flex flex-col rounded">
        {/* HEADER */}
        <div className="bg-bgHome text-blue px-6 py-3 rounded-t">
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-red-500 text-xl font-bold hover:scale-105"
          >
            ✕
          </button>
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
          <div
            className="h-[2px]"
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

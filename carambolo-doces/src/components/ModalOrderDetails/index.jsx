import React from 'react';

export default function ModalOrderDetails({ onClose, children }) {

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-white shadow-xl relative border border-[#d6a87c] min-w-[803px] min-h-[150px] flex flex-col rounded rounded-t-3xl">
                <header className="bg-gradient-blue px-6 py-3 rounded-t-3xl">

                    <h1 className="text-3xl font-bold text-gold">Número do Pedido: 9999999</h1>
                    <h1 className="text-2xl font-thin text-white">Bolo de Cenoura c/ cobertura de Chocolate</h1>

                    <button
                        onClick={onClose}
                        className="text-red text-3xl font-bold hover:scale-105"
                    >
                        ✕
                    </button>

                </header>
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

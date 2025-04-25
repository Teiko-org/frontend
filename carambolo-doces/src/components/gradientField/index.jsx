import React from 'react';

export default function CampoComGradiente({ children }) {
  return (
    <div className="p-[1px] rounded bg-gradient-to-b from-[#A47032] to-[#D4B076]">
      {children}
    </div>
  );
}

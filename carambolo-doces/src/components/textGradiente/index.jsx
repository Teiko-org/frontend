import React from 'react';

export default function TextGradiante({ children }) {
  return (
    <span
      style={{
        background: 'linear-gradient(180deg, #A47032 0%, #D4B076 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  );
}

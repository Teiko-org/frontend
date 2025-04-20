import React, { useState } from 'react';
import ModalBaseForm from '../ModalBaseForm';
import Button from '../Button';

export default function ModalAdicionais({ isOpen, onClose, onSave }) {
  const [addons, setAddons] = useState({
    cherry: true,
    glitter: true,
    pearl: true,
    bows: false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setAddons((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSave = () => {
    onSave(addons);
    onClose();
  };

  return (
    <ModalBaseForm isOpen={isOpen} onClose={onClose} title="ADICIONAIS">
      <div className="flex flex-wrap gap-6 mb-4 mt-7">
        {[
          { label: 'CEREJA', name: 'cherry' },
          { label: 'GLITTER', name: 'glitter' },
          { label: 'PEROLADO', name: 'pearl' },
          { label: 'LACINHOS', name: 'bows' },
        ].map((item) => (
          <label
            key={item.name}
            className="flex items-center gap-2 text-[#1d1d1d] text-sm font-semibold cursor-pointer"
          >
            <input
              type="checkbox"
              name={item.name}
              checked={addons[item.name]}
              onChange={handleCheckboxChange}
              className="sr-only"
            />
            <span
              className="w-5 h-5 rounded-sm p-[1px]"
              style={{
                background: 'linear-gradient(180deg, #A47032 0%, #D4B076 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                className="w-full h-full rounded-[1px] flex items-center justify-center"
                style={{
                  background: addons[item.name]
                    ? 'linear-gradient(180deg, #A47032 0%, #D4B076 100%)'
                    : '#fff',
                  transition: 'all 0.2s ease',
                }}
              >
                {addons[item.name] && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
            </span>
            {item.label}
          </label>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Button
          text="Salvar"
          onClick={handleSave}
          bgColor="bg-gradient-to-l from-gold to-darkGold"
          fontSize="text-sm"
          textColor="text-blue"
          borderColor="border-gold"
        />
      </div>
    </ModalBaseForm>
  );
}
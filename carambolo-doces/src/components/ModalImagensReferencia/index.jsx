import React, { useState, useEffect } from "react";
import { FaFileAlt, FaTrash } from "react-icons/fa";
import Button from "../Button";
import ModalBaseForm from "../ModalBaseForm";
import ModalConfirmarEdicao from "../ModalConfirmarEdicao";

export default function ModalImagensReferencia({
  isOpen,
  onClose,
  onSave,
  initialImages = [],
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Garantir que as imagens tenham preview se não tiverem
      const imagesWithPreview = (initialImages || []).map(img => {
        // Se já tem preview, manter
        if (img.preview) {
          return img;
        }
        
        // Se for um File object direto (vindo do Step2)
        if (img instanceof File) {
          return {
            file: img,
            name: img.name,
            preview: URL.createObjectURL(img)
          };
        }
        
        // Se for um objeto com file property
        if (img.file && img.file instanceof File) {
          return {
            ...img,
            preview: URL.createObjectURL(img.file)
          };
        }
        
        // Se for apenas um objeto com name, assumir que é um arquivo já carregado
        return {
          ...img,
          preview: img.preview || img.file
        };
      });
      setImages(imagesWithPreview);
    }
  }, [isOpen, initialImages]);

  // Cleanup dos previews quando o componente for desmontado
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.preview && img.preview.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [images]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const uniqueFiles = newFiles.filter(
      (file) => !images.some((img) => img.name === file.name)
    );

    const newFilesWithPreview = uniqueFiles.map((file) => ({
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newFilesWithPreview]);
    
    // Resetar o input para permitir selecionar o mesmo arquivo novamente
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => {
      const newImages = prev.filter((_, index) => index !== indexToRemove);
      return newImages;
    });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(images);
    }
    setIsModalOpen(true);
  };

  return (
    <ModalBaseForm isOpen={isOpen} onClose={onClose} title="IMAGENS DE REFERÊNCIA">
      {/* ÁREA DE UPLOAD E EXIBIÇÃO DAS IMAGENS */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#103464] mb-3">IMAGENS DE REFERÊNCIA</h3>
        
        {/* Área de exibição das imagens */}
        <div className="w-full min-h-[150px] flex flex-wrap items-start gap-4 px-4 py-3 bg-white rounded-lg border-gradient overflow-auto mb-4">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center gap-2 text-[#103464] text-sm"
              >
                <div className="relative">
                  <img 
                    src={image.preview || image.file} 
                    alt={image.name} 
                    className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Remover imagem"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
                <span className="truncate max-w-[80px] text-xs">{image.name}</span>
              </div>
            ))
          ) : (
            <span className="text-sm text-gray-500">
              Nenhuma imagem selecionada
            </span>
          )}
        </div>

        {/* Botão para adicionar novas imagens */}
        <div className="mt-3">
          <label
            htmlFor="image-upload"
            className="cursor-pointer inline-block px-4 py-2 text-sm font-semibold text-white bg-gradient-to-l from-gold to-darkGold rounded-md shadow hover:opacity-90 transition"
          >
            Adicionar Imagens
          </label>
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* BOTÃO SALVAR */}
      <div className="flex justify-end mt-6">
        <Button
          text="Salvar"
          onClick={handleSave}
          bgColor="bg-gradient-to-l from-gold to-darkGold"
          fontSize="text-sm"
          textColor="text-blue"
          borderColor="border-gold"
        />
        {isModalOpen && <ModalConfirmarEdicao onClose={closeModal} step={"Imagens de Referência"} />}
      </div>
    </ModalBaseForm>
  );
}

import React, { useState, useEffect } from "react";
import { FaFileAlt, FaTimes } from "react-icons/fa";
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
      const imagesWithPreview = (initialImages || []).map(img => {
        if (img.preview) {
          return img;
        }
        
        if (img instanceof File) {
          return {
            file: img,
            name: img.name,
            preview: URL.createObjectURL(img)
          };
        }
        
        if (img.file && img.file instanceof File) {
          return {
            ...img,
            preview: URL.createObjectURL(img.file)
          };
        }
        
        return {
          ...img,
          preview: img.preview || img.file
        };
      });
      setImages(imagesWithPreview);
    }
  }, [isOpen, initialImages]);

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
      <div className="mb-6">
        <input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="image-upload"
          className="block border-2 border-gold rounded-lg p-4 w-full min-h-[150px] text-center bg-white cursor-pointer"
        >
          {images.length === 0 ? (
            <div className="flex items-center gap-2 pt-4 flex-col font-bold text-gold">
              <FaFileAlt className="text-4xl"/>
              Clique aqui para adicionar imagem(s).
            </div>
          ) : (
            <div className="flex gap-4 flex-wrap">
              {images.map((image, index) => (
                <div 
                  key={index} 
                  className="relative text-center group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                      className="absolute -top-2 -right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-all z-50 shadow-lg opacity-0 group-hover:opacity-100 border-2 border-red-500"
                      title="Remover imagem"
                    >
                      <FaTimes className="text-sm font-bold text-red-600" />
                    </button>
                    <img 
                      src={image.preview || image.file} 
                      alt={image.name} 
                      className="h-20 w-20 object-cover rounded-lg mb-2 group-hover:opacity-75 transition-opacity"
                    />
                  </div>
                  <span className="text-blue text-sm block">{image.name}</span>
                </div>
              ))}
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center h-20 w-20 border-2 border-dashed border-gold rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={(e) => e.stopPropagation()}
                title="Adicionar mais imagens"
              >
                <span className="text-gold text-2xl">+</span>
              </label>
            </div>
          )}
        </label>
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
        {isModalOpen && <ModalConfirmarEdicao onClose={closeModal} step={"Imagens de Referência"} />}
      </div>
    </ModalBaseForm>
  );
}

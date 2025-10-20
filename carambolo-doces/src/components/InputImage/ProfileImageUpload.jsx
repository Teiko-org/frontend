import React, { useState, useRef, useEffect } from "react";
import { LuUpload } from "react-icons/lu";
import Button from "../Button";
import { uploadProfileImage } from "../../service/userService";

const ProfileImageUpload = ({ currentImageUrl, userId, onImageUpdate }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    console.log("ProfileImageUpload - currentImageUrl mudou:", currentImageUrl);
    setPreviewUrl(currentImageUrl);
  }, [currentImageUrl]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 10MB.');
        return;
      }
      
      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      const updatedUser = await uploadProfileImage(userId, selectedFile);
      
      if (onImageUpdate) {
        onImageUpdate(updatedUser.imagemUrl);
      }
      
      setSelectedFile(null);
      setPreviewUrl(updatedUser.imagemUrl);
    } catch (error) {
      console.error("Erro no upload:", error);
      setPreviewUrl(currentImageUrl);
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(currentImageUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-around mb-6 gap-5">
      <div className="relative">
        <img
          width={190}
          height={190}
          src={previewUrl || "/src/assets/user_icon.png"}
          alt="Imagem de Perfil"
          className="rounded-full object-cover"
          style={{ width: '190px', height: '190px' }}
        />
        {selectedFile && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">Preview</span>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {!selectedFile ? (
        <button
          onClick={handleButtonClick}
          className="bg-gradient-to-l from-gold to-darkGold text-lg text-blue border-gold font-bold py-1 px-4 rounded-full shadow-md border-2 focus:outline-none transform hover:scale-105 transition-transform cursor-pointer flex items-center gap-3"
        >
          <span className="flex items-center gap-3 p-1">
            Alterar Imagem <LuUpload />
          </span>
        </button>
      ) : (
        <div className="flex gap-3">
          <Button
            text={isUploading ? "Carregando..." : "Confirmar"}
            onClick={handleUpload}
            disabled={isUploading}
          />
          <button
            onClick={handleCancel}
            disabled={isUploading}
            className="font-bold py-1 px-4 rounded-full shadow-md focus:outline-none transform hover:scale-105 transition-transform disabled:cursor-not-allowed"
            style={{
              background: '#FF0000',
              border: '2px solid #CC0000',
              color: '#FFFFFF',
              opacity: isUploading ? '0.6' : '1'
            }}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileImageUpload; 
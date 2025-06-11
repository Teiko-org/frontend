import React, { useState, useEffect } from "react";
import { getUserData } from "../../service/userService";

const ProfileImageDisplay = ({ userId, size = 190, className = "" }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      if (userId) {
        try {
          const userData = await getUserData(userId);
          setImageUrl(userData.imagemUrl);
        } catch (error) {
          console.error("Erro ao carregar imagem:", error);
        }
      }
    };

    loadImage();

    // Listener para atualizar quando imagem for alterada
    const handleImageUpdate = (event) => {
      console.log("Imagem atualizada:", event.detail?.imagemUrl);
      if (event.detail?.imagemUrl) {
        setImageUrl(event.detail.imagemUrl);
      } else {
        loadImage(); // Recarregar se não tiver URL no evento
      }
    };

    window.addEventListener("userImageUpdated", handleImageUpdate);

    return () => {
      window.removeEventListener("userImageUpdated", handleImageUpdate);
    };
  }, [userId]);

  return (
    <img
      width={size}
      height={size}
      src={imageUrl || "/src/assets/user_icon.png"}
      alt="Imagem de Perfil"
      className={`rounded-full object-cover ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
};

export default ProfileImageDisplay; 
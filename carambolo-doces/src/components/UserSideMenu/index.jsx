import React, { useEffect, useState } from "react";
import ProfileImageUpload from "../../components/InputImage/ProfileImageUpload";
import { useNavigate } from "react-router-dom";
import { getUserData, logOff } from "../../service/userService";

function UserSideMenu() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ imagemUrl: null });

  useEffect(() => {
    const loadUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          console.log("Carregando dados do usuário no UserSideMenu...");
          const data = await getUserData(userId);
          console.log("Dados recebidos no UserSideMenu:", data);
          setUserData(data);
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
        }
      }
    };

    loadUserData();

    const handleImageUpdateEvent = () => {
      console.log("Evento de atualização de imagem detectado no UserSideMenu");
      loadUserData();
    };

    window.addEventListener("userImageUpdated", handleImageUpdateEvent);

    return () => {
      window.removeEventListener("userImageUpdated", handleImageUpdateEvent);
    };
  }, []);

  const handleLogout = () => {
    logOff();
    navigate("/");
  };

  const handleProfileImageUpdate = (newImageUrl) => {
    setUserData(prev => ({ ...prev, imagemUrl: newImageUrl }));
  };

  return (
    <div className={`w-[450px] px-10 bg-bgHome border-r-2 border-r-gold`}>
      <header className="relative px-30 flex justify-center items-center pt-10 mb-5">
        <span className="font-bold text-2xl">Área do Cliente</span>
      </header>

      <div className="flex flex-col items-center gap-10 mb-10">
        <ProfileImageUpload
          currentImageUrl={userData.imagemUrl}
          userId={localStorage.getItem("userId")}
          onImageUpdate={handleProfileImageUpdate}
        />

        <div className="flex flex-col gap-3 mb-10">
          <button
            className="w-[365px] bg-bgNativeHome border-2 border-gold rounded-2xl font-semibold p-3 px-5 text-left"
            onClick={() => { navigate("/pagina-usuario") }}>
            Dados Pessoais
          </button>

          <button className="w-[365px] bg-bgNativeHome border-2 border-gold rounded-2xl font-semibold p-3 px-5 text-left"
            onClick={() => { navigate("/pagina-enderecos") }}>
            Endereços
          </button>
        </div>
      </div>

      <footer className="flex justify-center pb-10">
        <button
          onClick={handleLogout}
          className="bg-bgNativeHome border-2 border-red rounded-2xl text-red font-semibold p-2 px-8"
        >
          Desconectar
        </button>
      </footer>
    </div>
  );
}

export default UserSideMenu;

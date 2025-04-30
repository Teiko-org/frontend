import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { LuUpload } from "react-icons/lu";
import ModalConfirmationLogOff from "../../components/ModalConfirmationLogOff";
import { useNavigate } from "react-router-dom";

function UserSideMenu() {
  const navigate = useNavigate();

  useEffect(() => {
    let statusLogOn = localStorage.getItem("IS_SIGNED");

    if (!statusLogOn) {
      navigate("/");
    }
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={`w-[450px] px-10 bg-bgHome border-r-2 border-r-gold`}>
      <header className="relative px-30 flex justify-center items-center pt-10 mb-5">
        <span className="font-bold text-2xl">Área do Cliente</span>
      </header>

      <div className="flex flex-col items-center gap-10 mb-10">
        <div className="flex flex-col items-center justify-around mb-6 gap-5">
          <img
            width={190}
            src="src/assets/user_icon.png"
            alt="Ícone de Usuário"
          />
          <Button
            text={
              <span className="flex items-center gap-3 p-1">
                Enviar Imagem <LuUpload />
              </span>
            }
          />
        </div>

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
          onClick={openModal}
          className="bg-bgNativeHome border-2 border-red rounded-2xl text-red font-semibold p-2 px-8"
        >
          Desconectar
        </button>
        {isModalOpen && <ModalConfirmationLogOff onClose={closeModal} />}
      </footer>
    </div>
  );
}

export default UserSideMenu;

import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import UserSideMenu from "../../components/UserSideMenu";
import ModalConfirmationAccountDeletion from "../../components/ModalConfirmationAccountDeletion";

function UserPage() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-bgNativeHome flex-col">
      <Header />

      <div className="flex">
        <UserSideMenu />

        <div className="w-full flex flex-col items-center py-5">

          <div className="w-full flex flex-col items-center">
            <h1 className="font-medium text-2xl">DADOS PESSOAIS</h1>
            <div className="w-[510px] flex flex-col items-center gap-5">
              <div className="flex flex-col">
                <span>Nome</span>
                <input
                  type="text"
                  className="w-[510px] border-2 border-gold rounded-xl px-4 py-2 w-full pr-10"
                />
              </div>

              <div className="flex flex-row gap-10">
                <div className="flex flex-col">
                  <span>Telefone</span>
                  <input
                    type="text"
                    className="w-full border-2 border-gold rounded-xl px-4 py-2 w-full pr-10"
                  />
                </div>

                <div className="flex flex-col">
                  <span>Data Nascimento</span>
                  <input
                    type="text"
                    className="w-full border-2 border-gold rounded-xl px-4 py-2 w-full pr-10"
                  />
                </div>
              </div>

              <div className="w-full flex flex-row justify-between items-center">
                <div className="flex flex-col">
                  <span>Gênero</span>
                  <input
                    type="text"
                    className="w-[200px] border-2 border-gold rounded-xl px-4 py-2 w-full pr-10"
                  />
                </div>

                <Button className="h-fit" text={<span>Editar</span>} />
              </div>
            </div>
          </div>

          <div className="h-[1px] w-full bg-[#FFC8B2] mx-[-100px] my-10" />

          <div className="w-[510px] flex flex-col items-center gap-8">
            <h1 className="font-medium text-2xl">REDEFINIÇÃO DE SENHA</h1>

            <div className="flex flex-row gap-10">
              <div className="flex flex-col">
                <span>Senha Atual</span>
                <input
                  type="text"
                  className="w-full border-2 border-gold rounded-xl px-4 py-2 w-full pr-10"
                />
              </div>

              <div className="flex flex-col">
                <span>Nova Senha</span>
                <input
                  type="text"
                  className="w-full border-2 border-gold rounded-xl px-4 py-2 w-full pr-10"
                />
              </div>
            </div>

            <div className="w-full flex justify-end">
              <Button className="h-fit" text={<span>Redefinir Senha</span>} />
            </div>

          </div>

          <div className="h-[1px] w-full bg-[#FFC8B2] mx-[-100px] my-10" />

          <footer className="flex justify-center pb-10">
        <button onClick={openModal} className="bg-bgNativeHome border-2 border-red rounded-2xl text-red font-semibold p-2 px-8">Excluir Conta</button>
        {isModalOpen && <ModalConfirmationAccountDeletion onClose={closeModal} />}
      </footer>

        </div>

      </div>

      <Footer />
    </div>
  );
}

export default UserPage;

import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import CardAddress from "../../components/CardAddress";
import UserSideMenu from "../../components/UserSideMenu";
import ModalAddressRegister from "../../components/ModalAddressRegister";
import { IoAdd } from "react-icons/io5";

function AddressPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const enderecos = [
    {
      nome: "Casa",
      cep: "03150-080",
      estado: "SP",
      cidade: "São Paulo",
      bairro: "Quinta da Paineira",
      rua: "Rua Pindamonhangaba",
      numero: "1234",
      complemento:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elitttttttttttttt.",
    },

    {
      nome: "Casa da Vózinha Ana",
      cep: "03244-000",
      estado: "SP",
      cidade: "São Paulo",
      bairro: "Jardim Guairaca",
      rua: "Rua Antônio Marques Julião",
      numero: "623",
      complemento: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ];

  return (
    <div className="bg-bgNativeHome flex-col">
      <Header />

      <div className="flex">
        <UserSideMenu />

        <div className="w-full flex flex-col items-center py-5">
          <div className="relative w-full flex justify-center items-center">
            <h1 className="absolute left-1/2 transform -translate-x-1/2 font-medium text-2xl mx-auto">
              ENDEREÇOS
            </h1>
            <Button
              onClick={openModal}
              text={
                <span className="flex items-center gap-3">
                  Adicionar um Endereço
                  <IoAdd className="text-[30px]" />
                </span>
              }
              className="h-fit ml-auto mr-[60px]"
            />

            {isModalOpen && <ModalAddressRegister onClose={closeModal} />}
          </div>

          <div className="w-full flex flex-row justify-center items-center py-5 gap-[50px]">
            {enderecos.map((endereco, index) => {

              return (
                <CardAddress endereco={endereco} key={index} />
              );
            })}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AddressPage;

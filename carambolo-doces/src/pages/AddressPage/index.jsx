import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import CardAddress from "../../components/CardAddress";
import UserSideMenu from "../../components/UserSideMenu";
import ModalAddressRegister from "../../components/ModalAddressRegister";
import { IoAdd, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { listUserAddresses } from "../../service/addressService";
import { useNavigate } from "react-router-dom";

function AddressPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enderecos, setEnderecos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const addressesPerPage = 2;
  const totalPages = Math.ceil(enderecos.length / addressesPerPage);
  const startIndex = currentPage * addressesPerPage;
  const currentAddresses = enderecos.slice(startIndex, startIndex + addressesPerPage);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        // Em toda a app usamos 'userId' (minúsculo) para identificar o usuário logado
        const userId = localStorage.getItem('userId') || localStorage.getItem('USER_ID');
        
        if (!userId) {
          setEnderecos([]);
          return;
        }

        const addressData = await listUserAddresses(userId);
        setEnderecos(addressData || []);
      } catch (error) {
        console.error('Erro ao buscar endereços:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddressCreated = (newAddress) => {
    setEnderecos(prev => [...prev, newAddress]);
  };

  const handleAddressUpdated = (updatedAddress) => {
    setEnderecos(prev => 
      prev.map(addr => 
        addr.id === updatedAddress.id ? updatedAddress : addr
      )
    );
  };

  const handleAddressDeleted = (deletedAddressId) => {
    console.log("🗑️ AddressPage - handleAddressDeleted chamado para ID:", deletedAddressId);
    console.log("📋 AddressPage - Endereços antes da exclusão:", enderecos.length);
    
    setEnderecos(prevEnderecos => {
      const updatedAddresses = prevEnderecos.filter(endereco => endereco.id !== deletedAddressId);
      console.log("📋 AddressPage - Endereços após filtro:", updatedAddresses.length);
      
      const newTotalPages = Math.ceil(updatedAddresses.length / addressesPerPage);
      console.log("📄 AddressPage - Nova quantidade de páginas:", newTotalPages);
      
      if (currentPage >= newTotalPages && newTotalPages > 0) {
        console.log("📄 AddressPage - Ajustando página atual para:", newTotalPages - 1);
        setCurrentPage(newTotalPages - 1);
      } else if (updatedAddresses.length === 0) {
        console.log("📄 AddressPage - Nenhum endereço restante, voltando para página 0");
        setCurrentPage(0);
      }
      
      return updatedAddresses;
    });
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  return (
    <div className="bg-bgNativeHome flex-col">
      <Header />

      <div className="flex">
        <UserSideMenu />

        <div className="w-full flex flex-col items-center py-5">
          <div className="relative w-full flex justify-center items-center mb-8">
            <h1 className="font-medium text-2xl">ENDEREÇOS</h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-xl text-blue">Carregando endereços...</p>
            </div>
          ) : enderecos.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-10">
              <p className="text-xl text-blue mb-4">Nenhum endereço cadastrado</p>
              <p className="text-blue mb-6">Clique em "Adicionar um novo endereço" para cadastrar seu primeiro endereço</p>
            </div>
          ) : (
            <div className="w-full max-w-[1400px] px-8">
              {/* Carrossel com 2 endereços por vez */}
              <div className="flex items-center justify-center gap-4 mb-6">
                {/* Seta anterior */}
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={`p-2 rounded-full ${
                    currentPage === 0 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gold hover:bg-gold hover:text-white transition-colors'
                  }`}
                >
                  <IoChevronBack size={24} />
                </button>

                {/* Container dos cards */}
                <div className="flex gap-6 justify-center">
                  {currentAddresses.map((endereco) => (
                    <CardAddress 
                      endereco={endereco} 
                      key={endereco.id}
                      onAddressUpdated={handleAddressUpdated}
                      onAddressDeleted={handleAddressDeleted}
                    />
                  ))}
                  
                  {/* Se só há 1 endereço na página, adiciona espaço em branco para manter layout */}
                  {currentAddresses.length === 1 && (
                    <div className="w-full max-w-[620px] opacity-0">
                      {/* Placeholder invisível para manter o layout */}
                    </div>
                  )}
                </div>

                {/* Seta próxima */}
                <button
                  onClick={nextPage}
                  disabled={currentPage >= totalPages - 1}
                  className={`p-2 rounded-full ${
                    currentPage >= totalPages - 1 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gold hover:bg-gold hover:text-white transition-colors'
                  }`}
                >
                  <IoChevronForward size={24} />
                </button>
              </div>

              {/* Indicadores de página (pontinhos) */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mb-6">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => goToPage(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentPage 
                          ? 'bg-gold' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Botão de adicionar endereço sempre visível */}
          <div className="mt-6">
            <Button
              onClick={openModal}
              text={
                <span className="flex items-center gap-3">
                  Adicionar um novo endereço
                  <IoAdd className="text-[30px]" />
                </span>
              }
              className="h-fit"
            />
          </div>

          {isModalOpen && (
            <ModalAddressRegister 
              onClose={closeModal} 
              onAddressCreated={handleAddressCreated}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AddressPage;

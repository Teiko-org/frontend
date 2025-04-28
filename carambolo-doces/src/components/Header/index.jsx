import React, { useEffect, useState } from "react";
import { Search, ShoppingCart, ChevronDown } from "lucide-react";
import Button from "../Button";
import LoginModal from "../LoginModal";

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [userSigned, setUserSigned] = useState(false)

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    setUserSigned(localStorage.getItem("IS_SIGNED"))
  }, [localStorage.getItem("IS_SIGNED")])

  return (
    <header className="bg-gradient-to-b from-blue to-darkBlue h-30 max-w-full">
      <div className="container mx-auto flex items-center justify-between w-full h-full">
        <div className="flex flex-1 justify-center">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="O que está procurando?"
              className="rounded-full border-2 border-gold px-4 py-2 w-full pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold" />
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <img src="src/assets/LogoCarambolo.png" alt="Logo" className="h-20" />
        </div>
        <div className="flex flex-1 justify-center items-center space-x-12">
          <>
            {
              !userSigned ?
                (<Button
                  text="Login"
                  bgColor="bg-gradient-to-l from-gold to-darkGold"
                  fontSize="text-lg"
                  textColor="text-blue"
                  borderColor="border-gold"
                  onClick={openModal}
                />) : (
                  <button>
                    <img
                      src="src/assets/user_icon.png"
                      width={"50px"}
                    />
                  </button>)
            }

          </>

          <button className="p-2 bg-transparent rounded-full transform hover:scale-105 transition-transform">
            <ShoppingCart className="text-gold w-8 h-8" />
          </button>
        </div>
      </div>

      <div className="border-t-2 border-b-2 border-gold bg-transparent text-white py-2 flex justify-around items-center">
        <a href="#" className="hover:text-darkGold">
          HOME
        </a>
        <a href="#" className="hover:text-darkGold flex items-center">
          CARAMBOLOS <ChevronDown className="ml-1" size={16} />
        </a>
        <a href="#" className="hover:text-darkGold">
          FORNADA DA SEMANA
        </a>
        <a href="#" className="hover:text-darkGold">
          DATAS ESPECIAIS
        </a>
      </div>

      {isModalOpen && <LoginModal onClose={closeModal} />}
      {/* {isModalOpen && <RegisterModal onClose={closeModal} />} */}
    </header>
  );
}

export default Header;
import React, { useEffect, useState } from "react";
import { Search, ShoppingCart, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../Button";
import LoginModal from "../LoginModal";
import ProfileImageDisplay from "../InputImage/ProfileImageDisplay";
import { axiosApi } from "../../provider/AxiosApi";

function Header() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [userSigned, setUserSigned] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      setUserSigned(!!localStorage.getItem("IS_SIGNED"));
    };

    checkLoginStatus();

    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, [])

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const checkAdminStatus = async () => {
      const userData = await axiosApi.get(`/usuarios/${userId}`)

      console.log('admin: ', userData.data.admin)
      setIsAdmin(userData.data.admin)
    };

    checkAdminStatus();

    window.addEventListener("storage", checkAdminStatus);

    return () => {
      window.removeEventListener("storage", checkAdminStatus);
    };
  }, [userSigned]);

  const navigate = useNavigate();

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
          <Link to="/">
            <img src="src/assets/LogoCarambolo.png" alt="Logo" className="h-20 cursor-pointer" />
          </Link>
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
                  <button onClick={() => navigate('/pagina-usuario')}>
                    <ProfileImageDisplay
                      userId={localStorage.getItem("userId")}
                      size={50}
                      className="border-2 border-gold hover:border-darkGold transition-colors cursor-pointer"
                    />
                  </button>)
            }
            {
              isAdmin && (
                <Button
                onClick={() => navigate('/dashboard-kanban-pedidos')}
                text={"Ir para pedidos"}
                ></Button>
              )
            }
          </>

          <button className="p-2 bg-transparent rounded-full transform hover:scale-105 transition-transform">
            {/* <ShoppingCart className="text-gold w-8 h-8" /> */}
          </button>
        </div>
      </div>

      <div className="border-t-2 border-b-2 border-gold bg-transparent text-white py-2 flex justify-around items-center">
        <Link to="/" className="hover:text-darkGold">
          HOME
        </Link>
        <a href="/carambolos" className="hover:text-darkGold flex items-center">
          CARAMBOLOS <ChevronDown className="ml-1" size={16} />
        </a>
        <a href="/fornada" className="hover:text-darkGold">
          FORNADA DA SEMANA
        </a>
        {/* <a href="#" className="hover:text-darkGold">
          DATAS ESPECIAIS
        </a> */}
      </div>

      {isModalOpen && <LoginModal onClose={closeModal} />}
    </header>
  );
}

export default Header;
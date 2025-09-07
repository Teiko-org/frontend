import React, { useEffect, useRef, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../Button";
import LoginModal from "../LoginModal";
import ProfileImageDisplay from "../InputImage/ProfileImageDisplay";
import { axiosApi } from "../../provider/AxiosApi";
import IconCart from "../IconCart";
import { useCart } from "../../contexts/CartContext";
import { getBolosComImagens } from "../../service/boloService";


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
      // Verificar se o userId é válido antes de fazer a chamada
      if (!userId || userId === 'null' || userId === 'undefined') {
        setIsAdmin(false);
        return;
      }

      try {
        const userData = await axiosApi.get(`/usuarios/${userId}`)
        console.log('admin: ', userData.data.admin)
        setIsAdmin(userData.data.admin)
      } catch (error) {
        console.error('Erro ao verificar status de admin:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();

    window.addEventListener("storage", checkAdminStatus);

    return () => {
      window.removeEventListener("storage", checkAdminStatus);
    };
  }, [userSigned]);

  const navigate = useNavigate();
  const location = useLocation();
  const { totals } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = () => {
    const q = (searchTerm || "").trim();
    if (q.length === 0) return navigate("/");
    navigate(`/?q=${encodeURIComponent(q)}`);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const isHome = location.pathname === '/';
    if (!isHome) return;
    const q = (searchTerm || "").trim();
    const timer = setTimeout(() => {
      const target = q.length === 0 ? '/' : `/?q=${encodeURIComponent(q)}`;
      navigate(target, { replace: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, navigate, location.pathname]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const bolos = await getBolosComImagens();
        const uniq = Array.from(new Set((bolos || []).map(b => b.categoria || 'Outros'))).filter(Boolean);
        setCategorias(uniq);
      } catch (err) {
        setCategorias([]);
      }
    };
    loadCategorias();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-gradient-to-b from-blue to-darkBlue h-30 max-w-full">
      <div className="container mx-auto flex items-center justify-between w-full h-full">
        <div className="flex flex-1 justify-center">
          <div className="relative w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="O que está procurando?"
              className="rounded-full border-2 border-gold px-4 py-2 w-full pr-10"
            />
            <button type="button" onClick={handleSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gold">
              <Search />
            </button>
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

          <button onClick={() => navigate('/carrinho')} className="relative p-2 bg-transparent rounded-full transform hover:scale-105 transition-transform">
            <IconCart className="w-8 h-8" />
            {totals.count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                {totals.count}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="border-t-2 border-b-2 border-gold bg-transparent text-white py-2 flex justify-around items-center">
        <Link to="/" className="hover:text-darkGold">
          HOME
        </Link>
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen((v) => !v)} className="hover:text-darkGold flex items-center px-3 py-1.5 rounded-md transition">
            CARAMBOLOS <ChevronDown className="ml-1" size={16} />
          </button>
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-gradient-to-b from-blue to-darkBlue text-white rounded-lg shadow-xl z-50 max-h-96 overflow-auto border-2 border-gold">
              <button
                className="w-full text-left px-4 py-2.5 hover:text-darkGold"
                onClick={() => { setIsDropdownOpen(false); navigate('/carambolos'); }}
              >
                Ver todos
              </button>
              <div className="border-t border-gold/60" />
              {(categorias || []).map((cat) => (
                <button
                  key={cat}
                  className="w-full text-left px-4 py-2.5 hover:text-darkGold"
                  onClick={() => { setIsDropdownOpen(false); navigate('/carambolos', { state: { categoriaSelecionada: cat } }); }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
        <Link to="/fornada" className="hover:text-darkGold">
          FORNADA DA SEMANA
        </Link>
        
      </div>

      {isModalOpen && <LoginModal onClose={closeModal} />}
    </header>
  );
}

export default Header;
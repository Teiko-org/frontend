import { IoMdClipboard } from "react-icons/io";
import { BsBag } from "react-icons/bs";
import { RiFileEditLine } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdSpaceDashboard, MdFactory } from "react-icons/md";

const BarraLateralDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (paths) => paths.some((p) => location.pathname.startsWith(p));
    const isActiveExact = (path) => location.pathname === path;

    const handleLogout = () => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            const userCartKey = `CART_ITEMS_USER_${userId}`;
            const userCart = localStorage.getItem(userCartKey);
            if (userCart) {
                localStorage.setItem("CART_ITEMS_GUEST", userCart);
            }
        }

        localStorage.removeItem("IS_SIGNED");
        localStorage.removeItem("userId");
        localStorage.removeItem("userData");

        window.dispatchEvent(new Event("storage"));
        navigate("/");
    };

    return (
        <>
            <aside className='bg-gradient-blue w-52 h-screen flex flex-col fixed top-0 left-0 z-50'>
                <header>
                    <img src="src/assets/LogoComFundoDash.png" alt="" />
                </header>

                <nav className="flex-1">
                    <ul className="text-gold">
                        <li>
                            <Link to="/">
                                <div className={`flex items-center pl-5 py-2 gap-2 ml-3 rounded-l-full transition-colors duration-400 ease-in-out ${isActiveExact('/') ? 'bg-bgNativeHome text-darkBlue font-semibold' : 'hover:bg-bgNativeHome hover:text-darkBlue'}`}>
                                    <FaHome /> Home
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard">
                                <div className={`flex items-center pl-5 py-2 gap-2 ml-3 rounded-l-full transition-colors duration-400 ease-in-out ${isActiveExact('/dashboard') ? 'bg-bgNativeHome text-darkBlue font-semibold' : 'hover:bg-bgNativeHome hover:text-darkBlue'}`}>
                                    <MdSpaceDashboard /> Dashboard
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link to="/producao">
                                <div className={`flex items-center pl-5 py-2 gap-2 ml-3 rounded-l-full transition-colors duration-400 ease-in-out ${isActiveExact('/producao') ? 'bg-bgNativeHome text-darkBlue font-semibold' : 'hover:bg-bgNativeHome hover:text-darkBlue'}`}>
                                    <MdFactory /> Produção
                                </div>
                            </Link>
                        </li>
                        <li>
                            {/* <a href="/dashboard-kanban-pedidos">
                                <div className='flex items-center
                                    pl-5 py-2 gap-2 ml-3 rounded-l-full
                                    hover:bg-bgNativeHome hover:text-darkBlue
                                    transition-colors duration-400 ease-in-out'>
                                    <IoMdClipboard /> Pedidos
                                </div>
                            </a> */}
                            <Link to="/dashboard-kanban-pedidos">
                                <div className={`flex items-center pl-5 py-2 gap-2 ml-3 rounded-l-full transition-colors duration-400 ease-in-out ${isActiveExact('/dashboard-kanban-pedidos') ? 'bg-bgNativeHome text-darkBlue font-semibold' : 'hover:bg-bgNativeHome hover:text-darkBlue'}`}>
                                    <IoMdClipboard /> Pedidos
                                </div>
                            </Link>
                        </li>
                        <li>
                            {/* <a href="/produtos">
                                <div className='flex items-center
                                    pl-5 py-2 gap-2 ml-3 rounded-l-full
                                    hover:bg-bgNativeHome hover:text-darkBlue
                                    transition-colors duration-400 ease-in-out'>
                                    <BsBag /> Produtos
                                </div>
                            </a> */}
                            <Link to="/produtos">
                                <div className={`flex items-center pl-5 py-2 gap-2 ml-3 rounded-l-full transition-colors duration-400 ease-in-out ${isActiveExact('/produtos') ? 'bg-bgNativeHome text-darkBlue font-semibold' : 'hover:bg-bgNativeHome hover:text-darkBlue'}`}>
                                    <BsBag /> Produtos
                                </div>
                            </Link>
                        </li>
                        <li>
                            {/* <a href="/fornada-dashboard">
                                <div className='flex items-center
                                    pl-5 py-2 gap-2 ml-3 rounded-l-full
                                    hover:bg-bgNativeHome hover:text-darkBlue
                                    transition-colors duration-400 ease-in-out'>
                                    <RiFileEditLine /> Fornada
                                </div>
                            </a> */}
                            <Link to="/fornada-dashboard">
                                <div className={`flex items-center pl-5 py-2 gap-2 ml-3 rounded-l-full transition-colors duration-400 ease-in-out ${isActive(['/fornada-dashboard','/all-fornadas-dashboard']) ? 'bg-bgNativeHome text-darkBlue font-semibold' : 'hover:bg-bgNativeHome hover:text-darkBlue'}`}>
                                    <RiFileEditLine /> Fornada
                                </div>
                            </Link>
                        </li>
                    </ul>
                </nav>

                <footer className="flex justify-center">
                    {/* <a href="#"
                        className='flex items-center justify-center
                            text-white
                             pl-10 gap-2 mr-16 mb-6 rounded-r-full w-full
                           hover:bg-red
                           transition-colors duration-300 ease-in-out
                             '
                    ><BiLogOut /> Sair</a> */}
                    <button
                        onClick={handleLogout}
                        className='flex items-center justify-center
                            text-white
                             pl-10 gap-2 mr-16 mb-6 rounded-r-full w-full
                           hover:bg-red
                           transition-colors duration-300 ease-in-out
                             '
                    ><BiLogOut /> Sair
                    </button>
                </footer>
            </aside>
        </>
    )
}

export default BarraLateralDashboard
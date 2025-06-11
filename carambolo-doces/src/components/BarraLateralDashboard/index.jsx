import { MdInsertChartOutlined } from "react-icons/md";
import { IoMdClipboard } from "react-icons/io";
import { BsBag } from "react-icons/bs";
import { RiFileEditLine } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";

const BarraLateralDashboard = () => {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("IS_SIGNED");
        localStorage.removeItem("userId");
        localStorage.removeItem("JWT_TOKEN");
        localStorage.removeItem("userData");
        localStorage.removeItem("IS_ADMIN");

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
                            {/* <a href="/dashboard-kanban-pedidos">
                                <div className='flex items-center
                                    pl-5 py-2 gap-2 ml-3 rounded-l-full
                                    hover:bg-bgNativeHome hover:text-darkBlue
                                    transition-colors duration-400 ease-in-out'>
                                    <IoMdClipboard /> Pedidos
                                </div>
                            </a> */}
                            <Link to="/dashboard-kanban-pedidos">
                                <div className='flex items-center
                                    pl-5 py-2 gap-2 ml-3 rounded-l-full
                                    hover:bg-bgNativeHome hover:text-darkBlue
                                    transition-colors duration-400 ease-in-out'>
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
                                <div className='flex items-center
                                    pl-5 py-2 gap-2 ml-3 rounded-l-full
                                    hover:bg-bgNativeHome hover:text-darkBlue
                                    transition-colors duration-400 ease-in-out'>
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
                                <div className='flex items-center
                                    pl-5 py-2 gap-2 ml-3 rounded-l-full
                                    hover:bg-bgNativeHome hover:text-darkBlue
                                    transition-colors duration-400 ease-in-out'>
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
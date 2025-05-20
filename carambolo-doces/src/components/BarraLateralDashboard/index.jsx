import { MdInsertChartOutlined } from "react-icons/md";
import { IoMdClipboard } from "react-icons/io";
import { BsBag } from "react-icons/bs";
import { RiFileEditLine } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";

const BarraLateralDashboard = () => {

    return (
        <>
            <aside className='bg-darkBlue w-52 h-screen flex flex-col'>
                <header>
                    <img src="src/assets/LogoComFundoDash.png" alt="" />
                </header>

                <nav className="flex-1">
                    <ul className="text-gold">
                        <li className=''>
                            <a href="#"
                                className='flex items-center
                            pl-5 py-2 gap-2 ml-3 rounded-l-full
                            hover:bg-bgNativeHome hover:text-darkBlue
                            transition-colors duration-400 ease-in-out
                            '
                            ><MdInsertChartOutlined />Dashboard</a>
                        </li>
                        <li >
                            <a href="#"
                                 className='flex items-center
                            pl-5 py-2 gap-2 ml-3 rounded-l-full
                            hover:bg-bgNativeHome hover:text-darkBlue
                            transition-colors duration-400 ease-in-out
                            '
                            ><IoMdClipboard /> Pedidos</a>
                        </li>
                        <li >
                            <a href="#"
                                 className='flex items-center
                            pl-5 py-2 gap-2 ml-3 rounded-l-full
                            hover:bg-bgNativeHome hover:text-darkBlue
                            transition-colors duration-400 ease-in-out
                            '
                            ><BsBag /> Produtos</a>
                        </li>
                        <li>
                            <a href="#"
                                className='flex items-center
                            pl-5 py-2 gap-2 ml-3 rounded-l-full
                            hover:bg-bgNativeHome hover:text-darkBlue
                            transition-colors duration-400 ease-in-out
                            '
                            ><RiFileEditLine /> Produção</a>
                        </li>
                    </ul>
                </nav>

                <footer className="flex justify-center">
                        <a href="#"
                            className='flex items-center justify-center
                            text-white
                             pl-10 gap-2 mr-16 mb-6 rounded-r-full w-full
                           hover:bg-red
                           transition-colors duration-300 ease-in-out
                             '
                        ><BiLogOut /> Sair</a>
                </footer>
            </aside>
        </>
    )
}

export default BarraLateralDashboard
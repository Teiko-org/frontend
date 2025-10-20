import BarraLateralDashboard from "../../components/BarraLateralDashboard";
import ProductList from "../../components/ProductList";
import Button from "../../components/Button";
import ModalCadastroProduto from "../../components/ModalCadastroProduto";
import { useState } from "react";
import HeaderDashboard from "../../components/headerDashboard";

export default function Products() {
    const [isRegisterProductModalOpen, setRegisterProductModalOpen] = useState(false);

    return (
        <div className="flex flex-row h-[100vh] pb-5 overflow-hidden bg-bgNativeHome">
            <BarraLateralDashboard></BarraLateralDashboard>
            <div className="w-full h-full flex flex-col items-center pl-56">
                <header className="pb-5 w-full">
                    <HeaderDashboard title={"Produtos"} />
                </header>
                <div className=" border-gold h-full border-2 rounded-lg overflow-hidden w-[90%] flex flex-col justify-between items-end">
                    <ProductList></ProductList>
                    <ModalCadastroProduto />

                </div>
            </div>
        </div>
    )
}

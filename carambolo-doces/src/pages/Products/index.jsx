import BarraLateralDashboard from "../../components/BarraLateralDashboard";
import ProductList from "../../components/ProductList";
import Button from "../../components/Button";

export default function Products() {
    return (
        <div className="flex flex-row h-full overflow-hidden bg-bgNativeHome">
            <BarraLateralDashboard></BarraLateralDashboard>
            <div className="w-full flex flex-col items-center">
                <h1 className="h-[8rem]">HEADER</h1>
                <div className=" border-gold border-2 rounded-lg overflow-hidden max-h-[80%] w-[90%] flex flex-col justify-between items-end">
                    <ProductList></ProductList>
                    <Button className="w-[310px] h-[2.5rem] mb-5 mr-6" text={"ADICIONAR NOVO PRODUTO +"}/>
                </div>
            </div>
        </div>
    )
}

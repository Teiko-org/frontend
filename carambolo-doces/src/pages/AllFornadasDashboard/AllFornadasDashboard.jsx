import BarraLateralDashboard from "../../components/BarraLateralDashboard";
import CustomDatePicker from "../../components/DatePicker-3";
import TableSelectProductsFornada from "../../components/TableSelectProductsFornada";
import Button from "../../components/Button";
import HeaderDashboard from "../../components/headerDashboard";
import "react-toastify/dist/ReactToastify.css";
import KPILastFornada from "../../components/KPILastFornada";
import KPIThisMonthFornadas from "../../components/KPIThisMonthFornadas";
import DashboardFornadaData from "../../components/DashboardFornadaData/DashboardFornadaData";
import Select from "../../components/Select";
import TableProductsThisFornada from "../../components/TableProductsThisFornada/TableProductsThisFornada";

function AllFornadasDashboard() {

    return (
        <div className="flex h-full bg-bgNativeHome">
            <BarraLateralDashboard />

            <div className="w-full h-full pl-56">
                <header className="w-full">
                    <HeaderDashboard title={"Fornada"} />
                </header>

                <div className="flex flex-col justify-evenly items-center">

                    <TableProductsThisFornada />
                    <div className="flex flex-row justify-evenly items-center gap-10">

                        <KPIThisMonthFornadas />

                    </div>
                    <div className="flex flex-col w-full items-center gap-5 pt-5">

                        <div className={`flex flex-col w-full h-fit justify-center border-2 border-gold rounded-2xl bg-bgHome`}>
                            <header className="flex flex-row justify-between rounded-t-2xl px-20 items-center bg-gradient-blue h-[3.6875rem] w-full flex-shrink-0">
                                <h1 className="text-gold text-[1.5rem]">Selecionar Produtos</h1>

                                <div className="flex w-1/2 items-center justify-end gap-x-16">
                                    <Select className="rounded-full" placeholder="Mês" width="25%" rounded="full"/>
                                    <Select className="rounded-full" placeholder="Ano" width="25%" rounded="full"/>
                                </div>

                            </header>

                            <div className="flex flex-col p-5 gap-y-5">
                                <DashboardFornadaData />
                                <DashboardFornadaData />
                                <DashboardFornadaData />
                                <DashboardFornadaData />
                                <DashboardFornadaData />
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default AllFornadasDashboard;

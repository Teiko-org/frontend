import BarraLateralDashboard from "../../components/BarraLateralDashboard";
import FornadaDatePicker from "../../components/FornadaDatePicker";

function FornadaDashboard() {


  return (
    <div className="flex bg-bgNativeHome">
      <BarraLateralDashboard />

      <div className="w-full">
        <header>HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER HEADER</header>
        <div className="flex justify-evenly items-center gap-10">
          <FornadaDatePicker/>
        </div>
      </div>
    </div>
  );
}

export default FornadaDashboard;

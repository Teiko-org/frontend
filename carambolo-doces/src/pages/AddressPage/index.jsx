import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import CardAddress from "../../components/CardAddress";
import UserSideMenu from "../../components/UserSideMenu";
import { IoAdd } from "react-icons/io5";

function AddressPage() {
  return (
    <div className="bg-bgNativeHome flex-col">
      <Header />

      <div className="flex">
        <UserSideMenu />

        <div className="w-full flex flex-col items-center py-5">

          <div className="relative w-full flex justify-center items-center">
            <h1 className="absolute left-1/2 transform -translate-x-1/2 font-medium text-2xl mx-auto">ENDEREÇOS</h1>
              <Button
                text={
                  <span className="flex items-center gap-3">
                    Adicionar um Endereço
                    <IoAdd className="text-[30px]" />
                  </span>}
                className="h-fit ml-auto mr-[60px]"/>
          </div>

          <div className="w-full flex flex-row justify-center items-center py-5 gap-[50px]">
            <CardAddress />
            <CardAddress />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AddressPage;

import React, { useState } from "react";
import ModalBase from "../ModalBase";
import Button from "../Button";
import RegisterModal from "../RegisterModal";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function LoginModal({ onClose }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const onSubmit = (data) => {
    if (data.phone === "11912341234" && data.password === "Senha123@") {
      console.log(data);
      toast.success("Login realizado com sucesso!");
    } else {
      toast.error("Telefone ou Senha incorretos.");
    }
  };

  const handleRegisterClick = () => {
    setIsRegisterOpen(true);
  };

  return (
    <>
      {!isRegisterOpen ? (
        <ModalBase title="Login" onClose={onClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center mb-6">
              <img src="src/assets/user_icon.png" alt="Ícone de Usuário" />
            </div>

            <label htmlFor="phone" className="text-white mb-1">Telefone Celular</label>
            <input
              {...register("phone", { required: "Telefone é obrigatório" })}
              type="tel"
              placeholder="Telefone"
              className={`mb-1 w-full py-2 px-4 rounded-lg ${errors.phone && 'border-red-600'}`}
            />

            <label htmlFor="password" className="text-white mb-1">Senha</label>
            <input
              {...register("password", { required: "Senha é obrigatória" })}
              type="password"
              placeholder="Senha"
              className={`mb-2 w-full py-2 px-4 rounded-lg ${errors.password && 'border-red-600'}`}
            />

            <div className="flex justify-between items-center mb-6 w-full">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-white text-sm font-medium">Lembrar de mim</span>
              </div>
              <span className="text-gradient text-sm font-semibold underline decoration-gold decoration-1 cursor-pointer">
                Esqueci minha senha
              </span>
            </div>

            <Button
              type="submit"
              text="Entrar"
              bgColor="bg-gradient-to-l from-gold to-darkGold"
              textColor="text-black"
              className="mx-auto mb-4 px-10 flex"
            />
          </form>

          <p className="text-center text-base font-normal text-white">
            Ainda não tem uma conta? <span onClick={handleRegisterClick} className="text-gradient font-bold cursor-pointer">Cadastre-se</span>
          </p>

          <ToastContainer />
        </ModalBase>
      ) : (
        <RegisterModal
          onClose={() => {
            setIsRegisterOpen(false);
            onClose();
          }}
          switchToLogin={() => setIsRegisterOpen(false)}
        />
      )}
    </>
  );
}

export default LoginModal;
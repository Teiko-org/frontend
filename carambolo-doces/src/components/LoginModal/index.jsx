import React, { useState } from "react";
import ModalBaseLogin from "../ModalBaseLogin";
import Button from "../Button";
import RegisterModal from "../RegisterModal";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { login, getUserData } from "../../service/userService";
import { useCart } from "../../contexts/CartContext";
import PhoneInputLogin from "../PhoneInput/PhoneInputLogin";
import userIcon from '../../assets/user_icon.png'; // added import

function LoginModal({ onClose }) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { migrateGuestCartToUser } = useCart();
  const [phoneValue, setPhoneValue] = useState('');

  const onSubmit = async (data) => {
    try {
      // Usa o valor do telefone formatado (apenas números)
      const phoneToSend = phoneValue || data.phone;
      const response = await login(phoneToSend, data.password);
      
      localStorage.setItem("userId", response.userId || response.id);
      localStorage.setItem("IS_SIGNED", true);

      const userData = await getUserData(response.userId || response.id);
      localStorage.setItem("userData", JSON.stringify(userData));

      // Migrar carrinho de convidado para usuário logado
      migrateGuestCartToUser();

      toast.success("Login realizado com sucesso!");
      window.dispatchEvent(new Event("storage"));
      onClose();
    } catch (error) {
      console.error("Erro ao logar:", error);
      // O toast de erro já é exibido no userService
    }
  };

  const handleRegisterClick = () => {
    setIsRegisterOpen(true);
  };


  return (
    <>
      {!isRegisterOpen ? (
        <ModalBaseLogin title="Login" onClose={onClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center mb-6">
              <img src={userIcon} alt="Ícone de Usuário" />
            </div>

            <label htmlFor="phone" className="text-white mb-1">Telefone Celular</label>
            <PhoneInputLogin
              {...register("phone", { required: "Telefone é obrigatório" })}
              value={phoneValue}
              onChange={(value) => {
                setPhoneValue(value);
                setValue('phone', value);
              }}
              placeholder="(XX) XXXXX-XXXX"
              className={`mb-1 w-full py-2 px-4 rounded-lg ${errors.phone && 'border-red-600'}`}
            />
            {errors.phone && <span className="text-red-600 text-sm">{errors.phone.message}</span>}

            <label htmlFor="password" className="text-white mb-1">Senha</label>
            <input
              {...register("password", { required: "Senha é obrigatória" })}
              type="password"
              placeholder="Senha"
              className={`mb-1 w-full py-2 px-4 rounded-lg ${errors.password && 'border-red-600'}`}
            />
            {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}

            <div className="flex flex-col items-center mt-6">
              <Button
                text="Entrar"
                type="submit"
                bgColor="bg-gradient-to-l from-gold to-darkGold"
                fontSize="text-lg"
                textColor="text-blue"
                borderColor="border-gold"
              />
            </div>

            <p className="text-center text-base font-normal text-white mt-4">
              Não tem uma conta? <span onClick={handleRegisterClick} className="text-gradient font-bold cursor-pointer">Cadastre-se</span>
            </p>
          </form>
        </ModalBaseLogin>
      ) : (
        <RegisterModal 
          onClose={onClose} 
          switchToLogin={() => setIsRegisterOpen(false)} 
        />
      )}
    </>
  );
}

export default LoginModal;
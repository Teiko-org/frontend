import React, { useState } from "react";
import ModalBaseLogin from "../ModalBaseLogin";
import Button from "../Button";
import RegisterModal from "../RegisterModal";
import userIcon from "../../assets/user_icon.png";
import { useForm } from "react-hook-form";
import { login, getUserData } from "../../service/userService";
import { useCart } from "../../contexts/CartContext";
import PhoneInputLogin from "../PhoneInput/PhoneInputLogin";
import { validateBrazilianPhone } from "../../utils/phoneValidation";
import { toast } from "../../utils/toast";

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

      toast.success('Login realizado com sucesso!');
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

            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="text-white">Telefone Celular</label>
              <PhoneInputLogin
                {...register("phone", { 
                  required: "Telefone é obrigatório",
                  validate: (value) => {
                    const validation = validateBrazilianPhone(value, { allowCountryCode: true, requireMobile: true });
                    return validation.valid || validation.error || "Telefone inválido";
                  }
                })}
                value={phoneValue}
                onChange={(value) => {
                  setPhoneValue(value);
                  setValue('phone', value, { shouldValidate: true });
                }}
                placeholder="(XX) XXXXX-XXXX"
                className={`w-full py-2 px-4 rounded-lg ${errors.phone ? 'mb-1' : ''}`}
              />
              {errors.phone && <span className="text-red-600 text-sm mb-1">{errors.phone.message}</span>}

              <label htmlFor="password" className="text-white">Senha</label>
              <input
                {...register("password", { required: "Senha é obrigatória" })}
                type="password"
                placeholder="Senha"
                className={`w-full py-2 px-4 rounded-lg ${errors.password ? 'mb-1' : ''}`}
              />
              {errors.password && <span className="text-red-600 text-sm mb-1">{errors.password.message}</span>}
            </div>

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

            <div className="flex flex-col items-center mt-4">
              <p className="text-center text-base font-normal text-white">
                Não tem uma conta?{" "}
                <span
                  onClick={handleRegisterClick}
                  className="text-gradient font-bold cursor-pointer"
                >
                  Cadastre-se
                </span>
              </p>
            </div>
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

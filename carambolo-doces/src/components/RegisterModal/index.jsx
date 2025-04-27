import React from "react";
import { useForm } from "react-hook-form";
import ModalBaseLogin from "../ModalBaseLogin";
import Button from "../Button";
import PhoneNumberInput from "../PhoneInput";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { axiosApi } from "../../provider/AxiosApi";

function RegisterModal({ onClose, switchToLogin }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    trigger
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    await axiosApi.post("/usuarios", {
      nome: data.name,
      senha: data.password,
      contato: data.phone
    }).then((response) => {
      toast.success("Cadastro criado com sucesso!");
      switchToLogin();
      alert("tela de coisas");
    }).catch((error) => {
      if(error.status == 409) {
        alert(`Usuario com contato ${data.phone} ja existente`);
      } else if(error.status == 500) {
        alert(`Tivemos problemas para processar seu cadastro. Tente novamente mais tarde!`);
      }
    })
  };

  const handleErrors = () => {
    if (Object.keys(errors).length > 0) {
      notify("Campos incorretos, corrija antes de enviar.");
    }
  };

  const notify = (message) => toast.error(message);

  return (
    <ModalBaseLogin title="Cadastro" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit, handleErrors)}>
        <div className="flex flex-col items-center mb-6">
          <img src="src/assets/user_icon.png" alt="Ícone de Usuário" />
        </div>
        
        <label htmlFor="name" className="text-white mb-1">Nome</label>
        <input
          {...register("name", { required: "Nome é obrigatório" })}
          type="text"
          placeholder="Nome"
          className={`w-full py-2 px-4 rounded-lg ${errors.name ? 'mb-1' : 'mb-4'}`}
        />
        {errors.name && <p className="text-red-600 text-sm mb-1">{errors.name.message}</p>}

        <div className={`flex flex-col ${errors.phone ? '' : 'mb-4'}`}>
          <label htmlFor="phone" className="text-white mb-1">Telefone Celular</label>
          <PhoneNumberInput
            {...register("phone", { required: "Telefone é obrigatório" })}
            onChange={(phone) => {
              setValue('phone', phone, { shouldValidate: true });
              trigger('phone');
            }}
          />
          {errors.phone && <p className="text-red-600 text-sm mb-1">{errors.phone.message}</p>}
        </div>

        <label htmlFor="password" className="text-white mb-1">Senha</label>
        <input
          {...register("password", {
            required: "Senha é obrigatória",
            pattern: {
              value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/,
              message: "Senha deve ter pelo menos 6 caracteres, um maiúsculo e um especial"
            }
          })}
          type="password"
          placeholder="Senha"
          className={`w-full py-2 px-4 rounded-lg ${errors.password ? 'mb-1' : 'mb-4'}`}
        />
        {errors.password && <p className="text-red-600 text-sm mb-1">{errors.password.message}</p>}

        <label htmlFor="confirmPassword" className="text-white mb-1">Confirmar Senha</label>
        <input
          {...register("confirmPassword", {
            required: "Confirmação de senha é obrigatória",
            validate: value => value === watch('password') || "As senhas não coincidem"
          })}
          type="password"
          placeholder="Confirmar Senha"
          className={`w-full py-2 px-4 rounded-lg ${errors.confirmPassword ? 'mb-1' : 'mb-4'}`}
        />
        {errors.confirmPassword && <p className="text-red-600 text-sm mb-1">{errors.confirmPassword.message}</p>}

        <Button
          text="Cadastrar"
          bgColor="bg-gradient-to-l from-gold to-darkGold"
          textColor="text-black"
          type="submit"
          className="mx-auto mb-4 px-10 flex"
        />
      </form>
      <p className="text-center text-base font-normal text-white">
        Já possui uma conta? <span onClick={switchToLogin} className="text-gradient font-bold cursor-pointer">Entrar</span>
      </p>
      <ToastContainer />
    </ModalBaseLogin>
  );
}

export default RegisterModal;
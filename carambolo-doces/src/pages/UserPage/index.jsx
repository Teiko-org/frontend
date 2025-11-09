import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import UserSideMenu from "../../components/UserSideMenu";
import ModalConfirmationAccountDeletion from "../../components/ModalConfirmationAccountDeletion";
import { changePassword, deleteUser, getUserData, updateUserData } from "../../service/userService";
import { useNavigate } from "react-router-dom";
import PhoneInputCustom from "../../components/PhoneInput/PhoneInputCustom";
import CampoComGradiente from "../../components/gradientField";
import { toast } from "react-toastify";

function UserPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    nome: "",
    contato: "",
    dataNascimento: "",
    genero: "",
    imagemUrl: "",
  });
  const [tempNome, setTempNome] = useState("");
  const [tempTelefone, setTempTelefone] = useState("");
  const [tempDataNascimento, setTempDataNascimento] = useState("");
  const [tempGenero, setTempGenero] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [senhaErrors, setSenhaErrors] = useState({});
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const navigate = useNavigate();

  // Função para obter a data de hoje no formato YYYY-MM-DD
  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const loadUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          console.log("Carregando dados do usuário na UserPage...");
          const data = await getUserData(userId);
          console.log("Dados recebidos na UserPage:", data);
          
          setUserData(data);
          setTempNome(data.nome);
          setTempTelefone(data.contato);
          setTempDataNascimento(data.dataNascimento || "");
          setTempGenero(data.genero || "");
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
        }
      }
    };

    loadUserData();
  }, []);

  const handleEditSave = async () => {
    if (isEditing) {
      const userId = localStorage.getItem("userId");
      
      try {
        const updatedData = {
          nome: tempNome,
          contato: tempTelefone,
          dataNascimento: tempDataNascimento || null,
          genero: tempGenero || null
        };

        // Verifica se o telefone foi alterado
        const telefoneAlterado = tempTelefone !== userData.contato;
        
        await updateUserData(userId, updatedData, telefoneAlterado);
        
        if (telefoneAlterado) {
          // Se telefone foi alterado, redireciona para home (será feito logout)
          navigate("/");
        } else {
          // Se apenas data/gênero foram alterados, recarrega os dados e sai do modo edição
          const newData = await getUserData(userId);
          setUserData(newData);
          setTempNome(newData.nome);
          setTempTelefone(newData.contato);
          setTempDataNascimento(newData.dataNascimento || "");
          setTempGenero(newData.genero || "");
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Erro ao salvar dados:", error);
      }
    } else {
      setTempNome(userData.nome);
      setTempTelefone(userData.contato);
      setTempDataNascimento(userData.dataNascimento || "");
      setTempGenero(userData.genero || "");
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setTempNome(userData.nome || "");
    setTempTelefone(userData.contato || "");
    setTempDataNascimento(userData.dataNascimento || "");
    setTempGenero(userData.genero || "");
    setIsEditing(false);
  };

  const validatePassword = (password) => {
    const errors = {};
    if (!password) {
      return errors;
    }
    const trimmedPassword = password.trim();
    if (trimmedPassword.length < 6) {
      errors.minLength = true;
    }
    if (!/[A-Z]/.test(trimmedPassword)) {
      errors.uppercase = true;
    }
    if (!/[0-9]/.test(trimmedPassword)) {
      errors.number = true;
    }
    if (!/[!@#$%^&*]/.test(trimmedPassword)) {
      errors.special = true;
    }
    return errors;
  };

  const handleChangePassword = async () => {
    if (!senhaAtual || !novaSenha) {
      toast.error("Preencha todos os campos!");
      return;
    }

    if (senhaAtual === novaSenha) {
      toast.error("A nova senha não pode ser igual à senha atual!");
      return;
    }

    const passwordErrors = validatePassword(novaSenha);
    if (Object.keys(passwordErrors).length > 0) {
      setSenhaErrors(passwordErrors);
      setShowPasswordRules(true);
      toast.error("A senha não atende aos requisitos de segurança!");
      return;
    }

    const userId = localStorage.getItem("userId");
    try {
      const trimmedNovaSenha = novaSenha.trim();
      await changePassword(userId, senhaAtual, trimmedNovaSenha);
      setSenhaAtual("");
      setNovaSenha("");
      setSenhaErrors({});
      setShowPasswordRules(false);
      navigate("/");
    } catch (error) {
      setSenhaErrors({});
      setShowPasswordRules(false);
    }
  };

  const handleDeleteUser = async () => {
    const userId = localStorage.getItem("userId");
    try {
      await deleteUser(userId);
      navigate("/");
    } catch (error) {
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-bgNativeHome flex-col">
      <Header />

      <div className="flex">
        <UserSideMenu />

        <div className="w-full flex flex-col items-center py-5">
          <div className="w-full flex flex-col items-center">
            <h1 className="font-medium text-2xl">DADOS PESSOAIS</h1>
            
            <div className="w-[510px] flex flex-col items-center gap-5">
              <div className="flex flex-col">
                <span className="font-semibold text-blue">Nome</span>
                <input
                  type="text"
                  className={`w-[510px] border-2 ${isEditing ? 'border-gold' : 'border-gray-300'} rounded-xl px-4 py-2 pr-10 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  value={isEditing ? tempNome : userData.nome}
                  onChange={(e) => setTempNome(e.target.value)}
                  readOnly={!isEditing}
                />
              </div>

              <div className="flex flex-row gap-4">
                <div className="flex flex-col w-[250px]">
                  <span className="font-semibold text-blue">Telefone</span>
                  {isEditing ? (
                    <CampoComGradiente>
                      <PhoneInputCustom
                        key="phone-editing"
                        value={tempTelefone || ""}
                        onChange={value => setTempTelefone(value)}
                        includeCountryCode={true}
                      />
                    </CampoComGradiente>
                  ) : (
                    <input
                      type="text"
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 pr-10 bg-gray-100 cursor-not-allowed"
                      value={userData.contato || ""}
                      readOnly
                    />
                  )}
                </div>

                <div className="flex flex-col w-[250px]">
                  <span className="font-semibold text-blue">Data Nascimento</span>
                  <input
                    type="date"
                    className={`w-full border-2 ${isEditing ? 'border-gold' : 'border-gray-300'} rounded-xl px-4 py-2 pr-10 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    value={isEditing ? tempDataNascimento : (userData.dataNascimento || "")}
                    onChange={(e) => setTempDataNascimento(e.target.value)}
                    readOnly={!isEditing}
                    max={getToday()}
                  />
                </div>
              </div>

              <div className="w-full flex flex-row justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-semibold text-blue">Gênero</span>
                  <select
                    className={`w-[200px] border-2 ${isEditing ? 'border-gold' : 'border-gray-300'} rounded-xl px-4 py-2 pr-10 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    value={isEditing ? tempGenero : (userData.genero || "")}
                    onChange={(e) => setTempGenero(e.target.value)}
                    disabled={!isEditing}
                  >
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                    <option value="Prefiro não informar">Prefiro não informar</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="h-fit" 
                    text={isEditing ? "Salvar" : "Editar"} 
                    onClick={handleEditSave}
                  />
                  {isEditing && (
                    <Button 
                      className="h-fit" 
                      text="Cancelar"
                      bgColor="bg-red"
                      onClick={handleCancel}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="h-[1px] w-full bg-[#FFC8B2] mx-[-100px] my-10" />

          <div className="w-[510px] flex flex-col items-center gap-8">
            <h1 className="font-medium text-2xl">REDEFINIÇÃO DE SENHA</h1>

            <div className="flex flex-row gap-10">
              <div className="flex flex-col">
                <span className="font-semibold text-blue">Senha Atual</span>
                <input
                  type="password"
                  className="w-full border-2 border-gold rounded-xl px-4 py-2 pr-10"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <span className="font-semibold text-blue">Nova Senha</span>
                <input
                  type="password"
                  className={`w-full border-2 ${Object.keys(senhaErrors).length > 0 ? 'border-red' : 'border-gold'} rounded-xl px-4 py-2 pr-10`}
                  value={novaSenha}
                  onChange={(e) => {
                    setNovaSenha(e.target.value);
                    if (e.target.value) {
                      setShowPasswordRules(true);
                      const errors = validatePassword(e.target.value);
                      setSenhaErrors(errors);
                    } else {
                      setShowPasswordRules(false);
                      setSenhaErrors({});
                    }
                  }}
                  onFocus={() => setShowPasswordRules(true)}
                  onBlur={() => {
                    if (!novaSenha) {
                      setShowPasswordRules(false);
                    }
                  }}
                />
                {showPasswordRules && (
                  <div className="mt-2 p-3 bg-bgHome border border-gold rounded-lg text-sm">
                    <p className="font-semibold text-blue mb-2">A senha deve conter:</p>
                    <ul className="space-y-1">
                      <li className={novaSenha.length >= 6 ? "text-green" : "text-gray-600"}>
                        {novaSenha.length >= 6 ? "✓" : "○"} Mínimo de 6 caracteres
                      </li>
                      <li className={/[A-Z]/.test(novaSenha) ? "text-green" : "text-gray-600"}>
                        {/[A-Z]/.test(novaSenha) ? "✓" : "○"} Pelo menos uma letra maiúscula
                      </li>
                      <li className={/[0-9]/.test(novaSenha) ? "text-green" : "text-gray-600"}>
                        {/[0-9]/.test(novaSenha) ? "✓" : "○"} Pelo menos um número
                      </li>
                      <li className={/[!@#$%^&*]/.test(novaSenha) ? "text-green" : "text-gray-600"}>
                        {/[!@#$%^&*]/.test(novaSenha) ? "✓" : "○"} Pelo menos um caractere especial (!@#$%^&*)
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full flex justify-end">
              <Button className="h-fit" text={<span>Redefinir Senha</span>} onClick={handleChangePassword} />
            </div>
          </div>

          <div className="h-[1px] w-full bg-[#FFC8B2] mx-[-100px] my-10" />

          <footer className="flex justify-center pb-10">
            <button onClick={openModal} className="bg-bgNativeHome border-2 border-red rounded-2xl text-red font-semibold p-2 px-8">
              Excluir Conta
            </button>
            {isModalOpen && <ModalConfirmationAccountDeletion onClose={closeModal} onDelete={handleDeleteUser} />}
          </footer>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default UserPage;

import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import InputOption from "../../components/InputOption";
import CampoComGradiente from "../../components/gradientField";
import PhoneInputCustom from "../../components/PhoneInput/PhoneInputCustom";
import Select from "../../components/Select";
import Button from "../../components/Button";
import { axiosApi } from "../../provider/AxiosApi";
import { useCart } from "../../contexts/CartContext";
import axios from "axios";
import { toast } from "react-toastify";
import { IoIosInformationCircle } from "react-icons/io";
import { listUserAddresses } from "../../service/addressService";
import { getProdutoFornadaById } from "../../service/fornadaService";
import Carousel from "../../components/Carousel";
import defaultImageCard from "../../assets/image_card.png";

export default function FornadaMultiOrderPage() {
  const { removeByFornadaId, removeItem } = useCart();
  const { state } = useLocation();
  const navigate = useNavigate();
  const itens = state?.itens || [];

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!itens || itens.length === 0) return;
    const timer = setInterval(() => {
      setIdx((v) => (v + 1) % itens.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [itens]);

  const next = () => setIdx((v) => (v + 1) % itens.length);
  const prev = () => setIdx((v) => (v - 1 + itens.length) % itens.length);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("Entrega");
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [referencia, setReferencia] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [horario, setHorario] = useState("");
  // Removido: observações não são usadas em fornadas
  const [errors, setErrors] = useState({});
  const t = {
    info: (m) => toast.info(m),
    warn: (m) => toast.warn(m),
    error: (m) => toast.error(m),
    success: (m) => toast.success(m),
  };
  const clearError = (k) => setErrors((p) => ({ ...p, [k]: false }));

  useEffect(() => {
    if (!itens || itens.length === 0) {
      t.error("Nenhum item selecionado");
      navigate("/fornada");
    }
  }, [itens, navigate]);

  useEffect(() => {
    const checkUserAndLoadAddresses = async () => {
      const userId = localStorage.getItem("userId");
      const isSignedIn = localStorage.getItem("IS_SIGNED");
      if (userId && isSignedIn) {
        setIsLoggedIn(true);
        try {
          const addresses = await listUserAddresses(userId);
          setUserAddresses(addresses);
        } catch {}
      }
    };
    checkUserAndLoadAddresses();
  }, []);

  const totalEstimado = useMemo(() => {
    return itens.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0), 0);
  }, [itens]);

  const formatCep = (value) => {
    const cleanCep = value.replace(/\D/g, "");
    if (cleanCep.length <= 5) return cleanCep;
    return `${cleanCep.substring(0, 5)}-${cleanCep.substring(5, 8)}`;
  };

  const handleCepChange = (e) => {
    if (selectedAddressId && selectedAddressId !== "novo") return;
    const formattedValue = formatCep(e.target.value);
    setCep(formattedValue);
    const cepWithoutMask = formattedValue.replace(/\D/g, "");
    if (cepWithoutMask.length === 8) searchAddressByCep(formattedValue);
    else clearAddressFields();
  };

  const searchAddressByCep = async (typedCep) => {
    try {
      const cepOnlyNumbers = typedCep.replace(/\D/g, "");
      if (cepOnlyNumbers.length !== 8) return;
      const response = await axios.get(`https://viacep.com.br/ws/${cepOnlyNumbers}/json/`);
      if (response.data && !response.data.erro) {
        setCidade(response.data.localidade || "");
        setBairro(response.data.bairro || "");
        setRua(response.data.logradouro || "");
      } else {
        clearAddressFields();
        t.error("❌ CEP não encontrado!");
      }
    } catch {
      clearAddressFields();
      t.error("❌ Erro ao buscar CEP. Verifique a conexão!");
    }
  };

  const clearAddressFields = () => {
    setCidade("");
    setBairro("");
    setRua("");
  };

  const handleAddressSelection = (addressId) => {
    setSelectedAddressId(addressId);
    if (addressId === "novo") {
      clearAddressFields();
      setCep("");
      setNumero("");
      setComplemento("");
      setReferencia("");
    } else if (addressId) {
      const selectedAddress = userAddresses.find((addr) => addr.id === parseInt(addressId));
      if (selectedAddress) {
        setCep(selectedAddress.cep);
        setCidade(selectedAddress.cidade);
        setBairro(selectedAddress.bairro);
        setRua(selectedAddress.logradouro);
        setNumero(selectedAddress.numero);
        setComplemento(selectedAddress.complemento || "");
        setReferencia(selectedAddress.referencia || "");
      }
    }
  };

  const registerAddress = async (endereco) => {
    const response = await axiosApi.post("/enderecos", endereco);
    return response.data.id;
  };

  const registerFornadaOrder = async (pedido) => {
    const response = await axiosApi.post("/fornadas/pedidos", pedido);
    return response.data.id;
  };

  const registerFornadaOrderSummary = async (pedidoFornadaId, dataEntrega, horario) => {
    const horarioValido = horario && horario.trim() !== "";
    const body = { 
      pedidoFornadaId, 
      dataEntrega: dataEntrega && horarioValido ? `${dataEntrega}T${horario}` : null 
    };
    const response = await axiosApi.post("/resumo-pedido", body);
    return response.data;
  };

  const validate = () => {
    if (!nome?.trim()) { setErrors((p)=>({ ...p, nome:true })); t.warn("Por favor, preencha seu nome!"); return false; }
    const telDigits = String(telefone || '').replace(/\D/g, '');
    if (telDigits.length < 10) { setErrors((p)=>({ ...p, telefone:true })); t.warn("Telefone inválido!"); return false; }
    if (!dataEntrega) { setErrors((p)=>({ ...p, dataEntrega:true })); t.warn("Selecione a data de entrega!"); return false; }
    const d = new Date(dataEntrega); const today = new Date(); today.setHours(0,0,0,0);
    if (d < today) { setErrors((p)=>({ ...p, dataEntrega:true })); t.warn("A data não pode ser no passado!"); return false; }
    if (deliveryOption === 'Retirada' && !horario) { setErrors((p)=>({ ...p, horario:true })); t.warn("Selecione o horário da retirada!"); return false; }
    if (deliveryOption === 'Entrega' && !(selectedAddressId && selectedAddressId !== 'novo')) {
      const cepDigits = String(cep || '').replace(/\D/g, '');
      if (cepDigits.length !== 8) { setErrors((p)=>({ ...p, cep:true })); t.warn("CEP inválido!"); return false; }
      if (!cidade) { setErrors((p)=>({ ...p, cidade:true })); t.warn("Preencha a cidade!"); return false; }
      if (!bairro) { setErrors((p)=>({ ...p, bairro:true })); t.warn("Preencha o bairro!"); return false; }
      if (!rua) { setErrors((p)=>({ ...p, rua:true })); t.warn("Preencha o endereço!"); return false; }
      if (!numero) { setErrors((p)=>({ ...p, numero:true })); t.warn("Preencha o número!"); return false; }
    }
    if (!itens || itens.length === 0) { t.warn("Nenhum item selecionado!"); return false; }
    return true;
  };

  const sendOrders = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    t.info("Processando seus pedidos...");
    try {
      // Validar todos os produtos antes de processar
      for (const it of itens) {
        if (!it.fornadaDaVezId) {
          t.error(`Produto "${it.name}" inválido! Por favor, remova do carrinho e adicione novamente.`);
          setIsSubmitting(false);
          return;
        }
        
        const produtoAtualizado = await getProdutoFornadaById(it.fornadaDaVezId);
        if (!produtoAtualizado || !produtoAtualizado.fornada) {
          t.error(`Produto "${it.name}" não está mais disponível na fornada atual!`);
          setIsSubmitting(false);
          return;
        }
        
        if ((produtoAtualizado.quantidade ?? 0) < it.quantity) {
          t.error(`Estoque insuficiente para "${it.name}". Disponível: ${produtoAtualizado.quantidade ?? 0}, Solicitado: ${it.quantity}`);
          setIsSubmitting(false);
          return;
        }
      }

      let enderecoId = null;
      if (deliveryOption === "Entrega") {
        if (selectedAddressId && selectedAddressId !== "novo") {
          enderecoId = parseInt(selectedAddressId);
        } else {
          const userId = localStorage.getItem("userId");
          const endereco = {
            nome: "Endereço de Entrega",
            cep: cep.replace("-", ""),
            estado: "SP",
            cidade,
            bairro,
            logradouro: rua,
            numero,
            complemento,
            referencia,
            usuario: userId ? parseInt(userId) : null,
          };
          enderecoId = await registerAddress(endereco);
        }
      }

      const mensagens = [];
      const idsResumo = [];
      for (const it of itens) {
        // Validar se o fornadaDaVezId está presente
        if (!it.fornadaDaVezId) {
          t.error(`Produto "${it.name}" inválido! Por favor, remova do carrinho e adicione novamente.`);
          continue;
        }
        
        try {
          // Verificar se o produto ainda está disponível antes de criar o pedido
          const produtoAtualizado = await getProdutoFornadaById(it.fornadaDaVezId);
          if (!produtoAtualizado || !produtoAtualizado.fornada) {
            t.error(`Produto "${it.name}" não está mais disponível na fornada atual!`);
            continue;
          }
          
          if ((produtoAtualizado.quantidade ?? 0) < it.quantity) {
            t.error(`Estoque insuficiente para "${it.name}". Disponível: ${produtoAtualizado.quantidade ?? 0}, Solicitado: ${it.quantity}`);
            continue;
          }
          
          const pedido = {
            fornadaDaVezId: it.fornadaDaVezId,
            usuarioId: null,
            quantidade: Number(it.quantity),
            dataPrevisaoEntrega: dataEntrega,
            tipoEntrega: deliveryOption.toUpperCase(),
            nomeCliente: nome,
            telefoneCliente: telefone,
            enderecoId: enderecoId,
            horarioRetirada: horario,
          };
          
          const pedidoId = await registerFornadaOrder(pedido);
          const resumo = await registerFornadaOrderSummary(pedidoId, dataEntrega, horario);
          if (resumo?.mensagem) mensagens.push(resumo.mensagem);
          if (resumo?.id) idsResumo.push(resumo.id);
          // remove do carrinho local
          try { removeItem(it.id, it.type); } catch {}
          try { removeByFornadaId(it.fornadaDaVezId); } catch {}
        } catch (error) {
          console.error(`Erro ao processar pedido para "${it.name}":`, error);
          if (error.response?.status === 422) {
            t.error(error.response.data?.message || `Erro ao processar "${it.name}": ${error.message}`);
          } else {
            t.error(`Erro ao processar "${it.name}". Tente novamente.`);
          }
        }
      }
      
      if (idsResumo.length === 0) {
        t.error("Nenhum pedido foi criado. Verifique os erros acima.");
        setIsSubmitting(false);
        return;
      }

      try {
        const resp = await axiosApi.post('/resumo-pedido/mensagens', { idsResumo });
        if (resp?.data && typeof resp.data === 'string' && resp.data.trim().length > 0) {
          mensagens.length = 0;
          mensagens.push(resp.data);
        }
      } catch {}

      const numeroWhatsApp = "11964849864";
      const mensagemFinal = mensagens.join("\n\n");
      const linkWhatsApp = `https://wa.me/55${numeroWhatsApp}?text=${encodeURIComponent(mensagemFinal)}`;

      t.success("Pedidos realizados com sucesso!");
      setTimeout(() => {
        window.open(linkWhatsApp, "_blank");
        navigate('/');
      }, 800);

    } catch (error) {
      console.error(error);
      t.error("Erro ao realizar pedidos! Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bgNativeHome flex-col">
      <Header />
      <div className="flex">
        <div className="flex flex-col items-center px-20">
          <h1 className="font-bold text-blue text-3xl py-6">Itens Selecionados</h1>
          {itens.length > 0 && (
            <div className="w-[360px]">
              <Carousel
                slides={itens.map((i, k) => ({ id: k + 1, image: i.image ?? defaultImageCard, title: i.name }))}
                imageHeightClass="h-[360px]"
                itemsPerView={1}
                showTitles={false}
                autoPlay
                interval={3500}
                showIndicators
              />
            </div>
          )}
          <div className="mt-2 text-center text-blue text-sm font-medium truncate" style={{ maxWidth: 320 }}>{itens[idx]?.name}</div>
          <div className="text-center text-blue text-xs">Qtd: {itens[idx]?.quantity} • R$ {Number(itens[idx]?.price || 0).toFixed(2)}</div>
          <span className="mt-4"><span className="text-gradient font-bold text-lg">TOTAL ESTIMADO:</span> R$ {totalEstimado.toFixed(2)}</span>
        </div>

        <div className="w-1/2 py-10">
          <h3 className="text-blue text-lg">Complete os dados abaixo para finalizar seus pedidos</h3>

          <div className="border-b border-[#FFC8B2] py-5">
            <div className="mb-4">
              <div className="flex space-x-4 mt-2 mb-4">
                <h2 className="font-semibold tracking-wider text-xl text-blue">Seu pedido será?</h2>
                {[
                  "Entrega",
                  "Retirada",
                ].map((option) => (
                  <InputOption key={option} type="radio" label={option} checked={deliveryOption === option} onChange={() => setDeliveryOption(option)} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <label className="block text-blue font-semibold mb-1">Nome</label>
                <input className={`border-2 ${errors.nome ? 'border-red' : 'border-gold'} rounded-lg px-4 py-2 w-full`} placeholder="Inserir o seu nome" value={nome} onChange={(e) => { setNome(e.target.value); if (e.target.value?.trim()) clearError('nome'); }} />
              </div>
              <div className="col-span-4">
                <label className="block text-blue font-semibold mb-1">Telefone</label>
                <CampoComGradiente>
                  <PhoneInputCustom value={telefone} onChange={(v) => setTelefone(v)} includeCountryCode={true} className={errors.telefone ? 'border-red-500' : ''} />
                </CampoComGradiente>
              </div>
              <div className="col-span-2">
                <label className="block text-blue font-semibold mb-1">Data</label>
                <input type="date" className={`w-full border-2 ${errors.dataEntrega ? 'border-red' : 'border-gold'} rounded-lg px-4 py-2`} value={dataEntrega} onChange={(e) => { setDataEntrega(e.target.value); if (e.target.value) clearError('dataEntrega'); }} min={new Date().toISOString().split("T")[0]} />
              </div>

              {deliveryOption === "Entrega" && (
                <>
                  {isLoggedIn && userAddresses.length > 0 && (
                    <div className="col-span-12 mb-4">
                      <label className="block text-blue font-semibold mb-1">Escolher Endereço</label>
                      <select className="w-full border-2 border-gold rounded-lg px-4 py-2" value={selectedAddressId} onChange={(e) => handleAddressSelection(e.target.value)}>
                        <option value="">Selecione um endereço ou digite um novo</option>
                        {userAddresses.map((address) => (
                          <option key={address.id} value={address.id}>
                            {address.nome} - {address.logradouro}, {address.numero} - {address.bairro}
                          </option>
                        ))}
                        <option value="novo">+ Inserir novo endereço</option>
                      </select>
                    </div>
                  )}

                  <div className="col-span-3">
                    <label className="block text-blue font-semibold mb-1">CEP</label>
                    <input placeholder="00000-000" className={`border-2 ${errors.cep ? 'border-red' : 'border-gold'} rounded-lg px-4 py-2 w-full ${selectedAddressId && selectedAddressId !== "novo" ? 'bg-gray-100' : ''}`} value={cep} maxLength={9} onChange={(e)=>{ handleCepChange(e); if(e.target.value) clearError('cep'); }} readOnly={selectedAddressId && selectedAddressId !== "novo"} />
                    <span className="text-xs text-blue mt-1">Não sabe o CEP? <a href="https://www.buscacep.correios.com.br/" target="_blank" rel="noopener noreferrer" className="text-blue font-semibold underline">Clique Aqui</a></span>
                  </div>
                  <div className="col-span-2">
                    <Select label="Estado" options={[{ value: "SP", label: "SP" }]} defaultValue="SP" disabled={true} />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-blue font-semibold mb-1">Cidade</label>
                    <input className={`border-2 ${errors.cidade ? 'border-red' : 'border-gold'} rounded-lg px-4 py-2 w-full ${selectedAddressId && selectedAddressId !== "novo" ? 'bg-gray-100' : ''}`} value={cidade} onChange={(e) => { setCidade(e.target.value); if(e.target.value) clearError('cidade'); }} readOnly={selectedAddressId && selectedAddressId !== "novo"} />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-blue font-semibold mb-1">Bairro</label>
                    <input className={`border-2 ${errors.bairro ? 'border-red' : 'border-gold'} rounded-lg px-4 py-2 w-full ${selectedAddressId && selectedAddressId !== "novo" ? 'bg-gray-100' : ''}`} value={bairro} onChange={(e) => { setBairro(e.target.value); if(e.target.value) clearError('bairro'); }} readOnly={selectedAddressId && selectedAddressId !== "novo"} />
                  </div>
                  <div className="col-span-8">
                    <label className="block text-blue font-semibold mb-1">Endereço</label>
                    <input placeholder="Inserir seu endereço" className={`border-2 ${errors.rua ? 'border-red' : 'border-gold'} rounded-lg px-4 py-2 w-full ${selectedAddressId && selectedAddressId !== "novo" ? 'bg-gray-100' : ''}`} value={rua} onChange={(e) => { setRua(e.target.value); if(e.target.value) clearError('rua'); }} readOnly={selectedAddressId && selectedAddressId !== "novo"} />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-blue font-semibold mb-1">Número</label>
                    <input className={`border-2 ${errors.numero ? 'border-red' : 'border-gold'} rounded-lg px-4 py-2 w-full ${selectedAddressId && selectedAddressId !== "novo" ? 'bg-gray-100' : ''}`} value={numero} onChange={(e) => { setNumero(e.target.value); if(e.target.value) clearError('numero'); }} readOnly={selectedAddressId && selectedAddressId !== "novo"} />
                  </div>
                  <div className="col-span-8">
                    <label className="block text-blue font-semibold mb-1">Complemento</label>
                    <input className={`border-2 border-gold rounded-lg px-4 py-2 w-full ${selectedAddressId && selectedAddressId !== "novo" ? 'bg-gray-100' : ''}`} value={complemento} onChange={(e) => setComplemento(e.target.value)} readOnly={selectedAddressId && selectedAddressId !== "novo"} />
                  </div>
                </>
              )}
              {deliveryOption === "Retirada" && (
                <div className="col-span-2">
                  <Select label="Horário" options={[{ value: "17:00", label: "17:00" }, { value: "17:30", label: "17:30" }, { value: "18:00", label: "18:00" }, { value: "18:30", label: "18:30" }, { value: "19:00", label: "19:00" }]} value={horario} onChange={(e) => setHorario(e.target.value)} className={errors.horario ? 'border-red-500' : ''} />
                </div>
              )}
            </div>
          </div>

          {/* Observações removidas para fornadas */}

          <div className="flex justify-between items-center mt-10">
            <div>
              <span><span className="text-gradient font-bold text-lg">TOTAL ESTIMADO:</span> R$ {totalEstimado.toFixed(2)}</span>
              <span className="flex items-center gap-1 text-[#665853] text-sm"><IoIosInformationCircle className="text-red" /> Esse valor não inclui o valor do frete</span>
            </div>
            <Button text={isSubmitting ? "Processando..." : "Finalizar Pedidos"} onClick={sendOrders} disabled={isSubmitting} bgColor={isSubmitting ? "bg-gray-400" : "bg-gradient-to-l from-gold to-darkGold"} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}



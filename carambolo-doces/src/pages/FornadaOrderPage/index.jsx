import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import InputOption from "../../components/InputOption";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CampoComGradiente from "../../components/gradientField";
import PhoneInputCustom from "../../components/PhoneInput/PhoneInputCustom";

import Select from "../../components/Select";
import { axiosApi } from "../../provider/AxiosApi";
import axios from "axios";
import { IoIosInformationCircle } from "react-icons/io";
import { listUserAddresses } from "../../service/addressService";
import { getProdutoFornadaById } from "../../service/fornadaService";
import { toast } from "react-toastify";
import { useCart } from "../../contexts/CartContext";
import defaultFornadaImg from "../../assets/image_fornada.png";

function FornadaOrderPage() {
    const { removeByFornadaId } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quantidadeDisponivel, setQuantidadeDisponivel] = useState(0);
    const [carregandoEstoque, setCarregandoEstoque] = useState(true);
    
    const produtoSelecionado = location.state?.produto;

    useEffect(() => {
        if (!produtoSelecionado) {
            toast.error("Nenhum produto selecionado!");
            navigate("/fornada");
        }
    }, [produtoSelecionado, navigate]);

    const doceFornada = {
        nome: produtoSelecionado?.produto || "Brownie Recheado",
        valorUnitario: produtoSelecionado?.valor || 12.00,
        fornadaDaVezId: produtoSelecionado?.fornadaDaVezId,
        imagens: produtoSelecionado?.imagens || []
    };

    const [amount, setAmount] = useState(location.state?.quantidade || 1);

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

    const getImagemPrincipal = () => {
        const normalizeImageUrl = (url) => {
            if (!url) return url;
            try {
                const parsed = new URL(url, window.location.origin);
                const isLocalhost = parsed.hostname === 'localhost' && (parsed.port === '8080' || parsed.port === '');
                const isPrivate10 = /^10\.\d+\.\d+\.\d+$/.test(parsed.hostname) && (parsed.port === '8080' || parsed.port === '');
                if (isLocalhost || isPrivate10) {
                    return `/api${parsed.pathname}${parsed.search}`;
                }
                if (parsed.origin === window.location.origin && parsed.pathname.startsWith('/files')) {
                    return `/api${parsed.pathname}${parsed.search}`;
                }
                return url;
            } catch (_e) {
                if (url.startsWith('/files')) return `/api${url}`;
                if (url.startsWith('files/')) return `/api/${url}`;
                return url;
            }
        };

        if (doceFornada.imagens && doceFornada.imagens.length > 0) {
            const primeira = doceFornada.imagens[0];
            const url = typeof primeira === "object" && primeira.url ? primeira.url : primeira;
            return normalizeImageUrl(url);
        }
        return defaultFornadaImg;
    };

    useEffect(() => {
        const checkUserAndLoadAddresses = async () => {
            const userId = localStorage.getItem("userId");
            const isSignedIn = localStorage.getItem("IS_SIGNED");
            
            if (userId && isSignedIn) {
                setIsLoggedIn(true);
                try {
                    const addresses = await listUserAddresses(userId);
                    setUserAddresses(addresses);
                } catch (error) {
                    console.error("Erro ao carregar endereços do usuário:", error);
                }
            }
        };

        const buscarQuantidadeDisponivel = async () => {
            if (produtoSelecionado?.fornadaDaVezId) {
                try {
                    setCarregandoEstoque(true);
                    const produtoAtualizado = await getProdutoFornadaById(produtoSelecionado.fornadaDaVezId);
                    const quantidadeDisp = produtoAtualizado.quantidade || 0;
                    setQuantidadeDisponivel(quantidadeDisp);
                    
                    // Se a quantidade inicial for maior que a disponível, ajusta
                    if (amount > quantidadeDisp && quantidadeDisp > 0) {
                        setAmount(quantidadeDisp);
                    }
                } catch (error) {
                    console.error("Erro ao buscar quantidade disponível:", error);
                    toast.error("Erro ao verificar estoque do produto");
                    setQuantidadeDisponivel(0);
                    setAmount(1);
                } finally {
                    setCarregandoEstoque(false);
                }
            } else {
                setCarregandoEstoque(false);
            }
        };

        checkUserAndLoadAddresses();
        buscarQuantidadeDisponivel();
    }, [produtoSelecionado]);

    useEffect(() => {
        if (cep.length === 8) {
            searchAddressByCep(cep);
        }
    }, [cep]);

    const formatCep = (value) => {
        const cleanCep = value.replace(/\D/g, "");
        if (cleanCep.length <= 5) {
            return cleanCep;
        }
        return `${cleanCep.substring(0, 5)}-${cleanCep.substring(5, 8)}`;
    };

    const handleCepChange = (e) => {
        if (selectedAddressId && selectedAddressId !== "novo") {
            return;
        }

        const formattedValue = formatCep(e.target.value);
        setCep(formattedValue);

        const cepWithoutMask = formattedValue.replace(/\D/g, "");

        if (cepWithoutMask.length === 8) {
            searchAddressByCep(formattedValue);
        } else {
            clearAddressFields();
        }
    };

    const searchAddressByCep = async (typedCep) => {
        try {
            const cepOnlyNumbers = typedCep.replace(/\D/g, "");

            if (cepOnlyNumbers.length !== 8) {
                return;
            }

            const response = await axios.get(
                `https://viacep.com.br/ws/${cepOnlyNumbers}/json/`
            );

            if (response.data && !response.data.erro) {
                setCidade(response.data.localidade || "");
                setBairro(response.data.bairro || "");
                setRua(response.data.logradouro || "");
            } else {
                console.error("CEP não encontrado.");
                clearAddressFields();
            }
        } catch (error) {
            console.error("Erro ao buscar o CEP:", error);
            clearAddressFields();
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
            const selectedAddress = userAddresses.find(addr => addr.id === parseInt(addressId));
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

    const sendOrder = async () => {
        if (!dataEntrega) {
            toast.warn("Por favor, selecione a data de entrega!");
            return;
        }
        if (!nome) {
            toast.warn("Por favor, preencha seu nome!");
            return;
        }
        if (!telefone) {
            toast.warn("Por favor, preencha o telefone!");
            return;
        }
        if (deliveryOption === "Entrega" && !cep) {
            toast.warn("Por favor, preencha o CEP para entrega!");
            return;
        }
        if (deliveryOption === "Entrega" && (!cidade || !bairro || !rua || !numero)) {
            toast.warn("Por favor, preencha todos os campos obrigatórios do endereço!");
            return;
        }
        if (deliveryOption === "Retirada" && !horario) {
            toast.warn("Por favor, selecione o horário da retirada!");
            return;
        }
        if (amount < 1) {
            toast.warn("A quantidade deve ser no mínimo 1 unidade!");
            return;
        }
        
        if (quantidadeDisponivel === 0) {
            toast.error("Este produto está esgotado!");
            return;
        }
        
        if (amount > quantidadeDisponivel) {
            toast.warn(`Quantidade indisponível! Máximo disponível: ${quantidadeDisponivel} unidades`);
            return;
        }
        
        setIsSubmitting(true);
        toast.info("Processando seu pedido...");
        
        try {
            const produtoAtualizado = await getProdutoFornadaById(produtoSelecionado.fornadaDaVezId);
            if (produtoAtualizado.quantidade < amount) {
                toast.error(`Estoque insuficiente! Disponível agora: ${produtoAtualizado.quantidade} unidades`);
                setQuantidadeDisponivel(produtoAtualizado.quantidade);
                if (produtoAtualizado.quantidade > 0) {
                    setAmount(Math.min(amount, produtoAtualizado.quantidade));
                }
                setIsSubmitting(false);
                return;
            }
            let enderecoId = null;

            if (deliveryOption === "Entrega") {
                if (selectedAddressId && selectedAddressId !== "novo") {
                    // Usa endereço existente
                    enderecoId = parseInt(selectedAddressId);
                } else {
                    // Cria novo endereço
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
                        usuario: userId ? parseInt(userId) : null
                    };
                    enderecoId = await registerAddress(endereco);
                }
            }

            const pedido = {
                fornadaDaVezId: doceFornada.fornadaDaVezId,
                usuarioId: null, 
                quantidade: Number(amount),
                dataPrevisaoEntrega: dataEntrega, 
                tipoEntrega: deliveryOption.toUpperCase(), 
                nomeCliente: nome,
                telefoneCliente: telefone,
                enderecoId: enderecoId,
                horarioRetirada: horario
            };

            if (deliveryOption === "Entrega") {
                pedido.enderecoId = enderecoId;
            }

            if (deliveryOption === "Retirada") {
                pedido.horarioRetirada = horario;
            }

            console.log("Pedido enviado:", pedido); 

            const pedidoId = await registerFornadaOrder(pedido);
            const resumo = await registerFornadaOrderSummary(pedidoId, dataEntrega, horario);
            console.log("Mensagem do resumo:", resumo.mensagem);

            const numeroWhatsApp = "11964849864";
            const mensagem = resumo.mensagem;
            const linkWhatsApp = `https://wa.me/55${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

            toast.success("Pedido realizado com sucesso!");
            
            try { removeByFornadaId(doceFornada.fornadaDaVezId); } catch {}
            setTimeout(() => {
                window.open(linkWhatsApp, "_blank");
                navigate('/');
            }, 800);

        } catch (error) {
            console.error("Erro ao realizar pedido:", error);
            
            // Verifica o tipo de erro para dar feedback adequado
            if (error.response?.status === 422 && error.response?.data?.message?.includes("Estoque insuficiente")) {
                toast.error(error.response.data.message);
            } else if (error.response?.status === 422) {
                toast.error(error.response.data.message);
            } else if (error.response?.status === 404) {
                toast.error("Produto não encontrado!");
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao realizar pedido! Tente novamente.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-bgNativeHome flex-col">
            <Header />

            <div className="flex">

                <div className="flex flex-col items-center px-20">
                    <h1 className="font-bold text-blue text-3xl py-6">{doceFornada.nome}</h1>
                    <img
                        src={getImagemPrincipal()}
                        alt={doceFornada.nome}
                        className="w-[320px] h-[320px] object-cover rounded-lg border-2 border-goldCard mb-2"
                        onError={(e) => {
                            e.target.src = defaultFornadaImg;
                        }}
                    />
                    <span><span className="text-gradient font-bold text-lg">VALOR UNITÁRIO:</span> R$ {doceFornada.valorUnitario.toFixed(2)}</span>
                </div>

                <div className="w-1/2 py-10">
                    <h3 className="text-blue text-lg">Complete os dados abaixo para finalizar seu pedido e receber tudo fresquinho!</h3>

                    <div className="flex flex-col gap-3 border-b border-[#FFC8B2] py-5">
                        <h2 className="font-semibold tracking-wider text-xl text-blue">QUANTIDADE</h2>
                        <span className="text-blue text-sm">
                            Insira abaixo quantos {doceFornada.nome} você gostaria de pedir
                            {carregandoEstoque ? (
                                <span className="text-gold ml-2">• Verificando estoque...</span>
                            ) : quantidadeDisponivel > 0 ? (
                                <span className="text-green-600 ml-2">• {quantidadeDisponivel} disponíveis</span>
                            ) : (
                                <span className="text-red-600 ml-2">• Produto esgotado</span>
                            )}
                        </span>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                min="1" 
                                max={quantidadeDisponivel || 1}
                                disabled={carregandoEstoque || quantidadeDisponivel === 0}
                                value={amount}
                                onChange={e => {
                                    const newAmount = parseInt(e.target.value) || 1;
                                    if (newAmount > quantidadeDisponivel) {
                                        setAmount(quantidadeDisponivel);
                                        toast.warn(`Máximo disponível: ${quantidadeDisponivel} unidades`);
                                    } else if (newAmount < 1) {
                                        setAmount(1);
                                    } else {
                                        setAmount(newAmount);
                                    }
                                }}
                                className={`w-[10%] border-2 border-gold rounded-xl px-3 py-2 ${
                                    carregandoEstoque || quantidadeDisponivel === 0 
                                        ? 'bg-gray-100 cursor-not-allowed' 
                                        : ''
                                }`}
                            />
                            {quantidadeDisponivel === 0 && !carregandoEstoque && (
                                <span className="text-red-600 text-sm font-medium">
                                    Este produto está esgotado
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="border-b border-[#FFC8B2] py-5">
                        <div className="mb-4">
                            <div className="flex space-x-4 mt-2 mb-4">
                                <h2 className="font-semibold tracking-wider text-xl text-blue">
                                    Seu pedido será?
                                </h2>
                                {["Entrega", "Retirada"].map((option) => (
                                    <InputOption
                                        key={option}
                                        type="radio"
                                        label={option}
                                        checked={deliveryOption === option}
                                        onChange={() => setDeliveryOption(option)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6">
                                <label className="block text-blue font-semibold mb-1">Nome</label>
                                <input
                                    placeholder="Inserir o seu nome"
                                    className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                />
                            </div>
                            <div className="col-span-4">
                                <label className="block text-blue font-semibold mb-1">Telefone</label>
                                <CampoComGradiente>
                                    <PhoneInputCustom
                                        placeholder="(XX) X XXXX-XXXX"
                                        className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                                        value={telefone}
                                        onChange={value => setTelefone(value)}
                                        includeCountryCode={true}
                                    />
                                </CampoComGradiente>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-blue font-semibold mb-1">Data</label>
                                <input
                                    type="date"
                                    className="w-full border-2 border-gold rounded-lg px-4 py-2"
                                    value={dataEntrega}
                                    onChange={(e) => setDataEntrega(e.target.value)}
                                    min={new Date().toISOString().split("T")[0]}
                                />
                            </div>

                            {deliveryOption === "Entrega" && (
                                <>
                                    {isLoggedIn && userAddresses.length > 0 && (
                                        <div className="col-span-12 mb-4">
                                            <label className="block text-blue font-semibold mb-1">
                                                Escolher Endereço
                                            </label>
                                            <select
                                                className="w-full border-2 border-gold rounded-lg px-4 py-2"
                                                value={selectedAddressId}
                                                onChange={(e) => handleAddressSelection(e.target.value)}
                                            >
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
                                        <input
                                            placeholder="00000-000"
                                            className={`border-2 border-gold rounded-lg px-4 py-2 w-full ${selectedAddressId && selectedAddressId !== "novo" ? 'bg-gray-100' : ''}`}
                                            value={cep}
                                            maxLength={9}
                                            onChange={handleCepChange}
                                            readOnly={selectedAddressId && selectedAddressId !== "novo"}
                                        />
                                        <span className="text-xs text-blue mt-1">
                                            Não sabe o CEP?{" "}
                                            <a
                                                href="https://www.buscacep.correios.com.br/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue font-semibold underline"
                                            >
                                                Clique Aqui
                                            </a>
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <Select
                                            label="Estado"
                                            options={[{ value: "SP", label: "SP" }]}
                                            defaultValue="SP"
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-blue font-semibold mb-1">
                                            Cidade
                                        </label>
                                        <input
                                            className={`border-2 border-gold rounded-lg px-4 py-2 w-full ${selectedAddressId && selectedAddressId !== "novo" ? 'bg-gray-100' : ''}`}
                                            value={cidade}
                                            onChange={(e) => setCidade(e.target.value)}
                                            readOnly={selectedAddressId && selectedAddressId !== "novo"}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-blue font-semibold mb-1">
                                            Bairro
                                        </label>
                                        <input
                                            className={`border-2 border-gold rounded-lg px-4 py-2 w-full ${selectedAddressId && selectedAddressId !== "novo" ? 'bg-gray-100' : ''}`}
                                            value={bairro}
                                            onChange={(e) => setBairro(e.target.value)}
                                            readOnly={selectedAddressId && selectedAddressId !== "novo"}
                                        />
                                    </div>

                                    <div className="col-span-8">
                                        <label className="block text-blue font-semibold mb-1">
                                            Endereço
                                        </label>
                                        <input
                                            placeholder="Inserir seu endereço"
                                            className={`border-2 border-gold rounded-lg px-4 py-2 w-full ${selectedAddressId && selectedAddressId !== "novo" ? 'bg-gray-100' : ''}`}
                                            value={rua}
                                            onChange={(e) => setRua(e.target.value)}
                                            readOnly={selectedAddressId && selectedAddressId !== "novo"}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-blue font-semibold mb-1">
                                            Número
                                        </label>
                                        <input 
                                            className={`border-2 border-gold rounded-lg px-4 py-2 w-full ${selectedAddressId && selectedAddressId !== "novo" ? 'bg-gray-100' : ''}`} 
                                            value={numero} 
                                            onChange={e => setNumero(e.target.value)}
                                            readOnly={selectedAddressId && selectedAddressId !== "novo"}
                                        />
                                    </div>

                                    <div className="col-span-8">
                                        <label className="block text-blue font-semibold mb-1">
                                            Complemento
                                        </label>
                                        <input 
                                            className={`border-2 border-gold rounded-lg px-4 py-2 w-full ${selectedAddressId && selectedAddressId !== "novo" ? 'bg-gray-100' : ''}`} 
                                            value={complemento} 
                                            onChange={e => setComplemento(e.target.value)}
                                            readOnly={selectedAddressId && selectedAddressId !== "novo"}
                                        />
                                    </div>
                                </>
                            )}
                            {deliveryOption === "Retirada" && (
                                <div className="col-span-2">
                                    <Select
                                        label="Horário"
                                        options={[
                                            { value: "17:00", label: "17:00" },
                                            { value: "17:30", label: "17:30" },
                                            { value: "18:00", label: "18:00" },
                                            { value: "18:30", label: "18:30" },
                                            { value: "19:00", label: "19:00" },
                                        ]}
                                        placeholder={""}
                                        value={horario}
                                        onChange={e => setHorario(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Observações removidas para fornadas */}

                    <div className="flex justify-between items-center mt-10">
                        <div>
                            <span><span className="text-gradient font-bold text-lg">TOTAL ESTIMADO:</span> R$ {(doceFornada.valorUnitario * amount).toFixed(2)}</span>
                            <span className="flex items-center gap-1 text-[#665853] text-sm"><IoIosInformationCircle className="text-red" /> Esse valor não inclui o valor do frete</span>
                        </div>
                        <Button
                            text={
                                isSubmitting ? "Processando..." : 
                                carregandoEstoque ? "Carregando..." :
                                quantidadeDisponivel === 0 ? "Produto Esgotado" : 
                                "Finalizar Pedido"
                            }
                            onClick={sendOrder}
                            disabled={isSubmitting || carregandoEstoque || quantidadeDisponivel === 0}
                            bgColor={
                                isSubmitting || carregandoEstoque || quantidadeDisponivel === 0 
                                    ? "bg-gray-400" 
                                    : "bg-gradient-to-l from-gold to-darkGold"
                            }
                        />
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}

export default FornadaOrderPage;
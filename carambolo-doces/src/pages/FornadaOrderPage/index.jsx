import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import InputOption from "../../components/InputOption";
import { useEffect, useState } from "react";
import CampoComGradiente from "../../components/gradientField";
import PhoneNumberInput from "../../components/PhoneInput";
import CustomDatePicker from "../../components/DatePicker";
import Select from "../../components/Select";
import { axiosApi } from "../../provider/AxiosApi";
import axios from "axios";
import { IoIosInformationCircle } from "react-icons/io";

function FornadaOrderPage() {

    const doceFornada = {
        'nome': "Brownie Recheado",
        'valorUnitario': 12.00
    }

    const [amount, setAmount] = useState(1);

    const [deliveryOption, setDeliveryOption] = useState("Entrega");

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
    const [observacoes, setObservacoes] = useState("");

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

    const registerAddress = async (endereco) => {
        const response = await axiosApi.post("/enderecos", endereco);
        return response.data.id;
    };

    const registerFornadaOrder = async (pedido) => {
        const response = await axiosApi.post("/fornadas/pedidos", pedido);
        return response.data.id;
    };

    const registerFornadaOrderSummary = async (pedidoFornadaId, dataEntrega, horario) => {
        const body = {
            pedidoFornadaId,
            dataEntrega: dataEntrega && horario ? `${dataEntrega}T${horario}:00` : null
        };
        const response = await axiosApi.post("/resumo-pedido", body);
        return response.data;
    };

    const sendOrder = async () => {
        if (!dataEntrega) {
            alert("Por favor, selecione a data de entrega.");
            return;
        }
        if (!telefone) {
            alert("Por favor, preencha o telefone.");
            return;
        }
        if (deliveryOption === "Entrega" && !cep) {
            alert("Por favor, preencha o CEP para entrega.");
            return;
        }
        if (deliveryOption === "Retirada" && !horario) {
            alert("Por favor, selecione o horário da retirada.");
            return;
        }
        try {
            let enderecoId = null;

            if (deliveryOption === "Entrega") {
                const endereco = {
                    cep: cep.replace("-", ""),
                    estado: "SP",
                    cidade,
                    bairro,
                    logradouro: rua,
                    numero,
                    complemento,
                    referencia,
                    usuario: null 
                };
                enderecoId = await registerAddress(endereco);
            }

            const pedido = {
                fornadaDaVezId: 1,
                usuarioId: null, 
                quantidade: Number(amount),
                dataPrevisaoEntrega: dataEntrega, 
                tipoEntrega: deliveryOption.toUpperCase(), 
                nomeCliente: nome,
                telefoneCliente: telefone,
                observacoes: observacoes,
                complemento: complemento,
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

            window.open(linkWhatsApp, "_blank");

            alert("Pedido realizado com sucesso!");
        } catch (error) {
            alert("Erro ao realizar pedido!");
            console.error(error);
        }
    };

    return (
        <div className="bg-bgNativeHome flex-col">
            <Header />

            <div className="flex">

                <div className="flex flex-col items-center px-20">
                    <h1 className="font-bold text-blue text-3xl py-6">{doceFornada.nome}</h1>
                    <img src="src/assets/imagemBrownie.png" alt="" />
                    <span><span className="text-gradient font-bold text-lg">VALOR UNITÁRIO:</span> R$ {doceFornada.valorUnitario.toFixed(2)}</span>
                </div>

                <div className="w-1/2 py-10">
                    <h3 className="text-blue text-lg">Frase específica para gerar um pouco de interação com o usuário</h3>

                    <div className="flex flex-col gap-3 border-b border-[#FFC8B2] py-5">
                        <h2 className="font-semibold tracking-wider text-xl text-blue">QUANTIDADE</h2>
                        <span className="text-blue text-sm">Insira abaixo quantos Brownies Recheados você gostaria de pedir</span>
                        <input
                            type="number"
                            maxLength={2}
                            min="1" max="12"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-[10%] border-2 border-gold rounded-xl px-3 py-2"
                        />
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
                                    <PhoneNumberInput
                                        placeholder="(XX) X XXXX-XXXX"
                                        className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                                        value={telefone}
                                        onChange={value => setTelefone(value)}
                                    />
                                </CampoComGradiente>
                            </div>
                            <div className="col-span-2">
                                <CustomDatePicker
                                    label="Data"
                                    placeholder="DD/MM"
                                    value={dataEntrega}
                                    onChange={value => {
                                        let formatted = value;
                                        if (value instanceof Date) {
                                            formatted = value.toISOString().split("T")[0];
                                        }
                                        setDataEntrega(formatted);
                                    }}
                                />
                            </div>

                            {deliveryOption === "Entrega" && (
                                <>
                                    <div className="col-span-3">
                                        <label className="block text-blue font-semibold mb-1">CEP</label>
                                        <input
                                            placeholder="00000-000"
                                            className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                                            value={cep}
                                            maxLength={9}
                                            onChange={handleCepChange}
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
                                            className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                                            value={cidade}
                                            onChange={(e) => setCidade(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-blue font-semibold mb-1">
                                            Bairro
                                        </label>
                                        <input
                                            className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                                            value={bairro}
                                            onChange={(e) => setBairro(e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-8">
                                        <label className="block text-blue font-semibold mb-1">
                                            Endereço
                                        </label>
                                        <input
                                            placeholder="Inserir seu endereço"
                                            className="border-2 border-gold rounded-lg px-4 py-2 w-full"
                                            value={rua}
                                            onChange={(e) => setRua(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-blue font-semibold mb-1">
                                            Número
                                        </label>
                                        <input className="border-2 border-gold rounded-lg px-4 py-2 w-full" value={numero} onChange={e => setNumero(e.target.value)} />
                                    </div>

                                    <div className="col-span-8">
                                        <label className="block text-blue font-semibold mb-1">
                                            Complemento
                                        </label>
                                        <input className="border-2 border-gold rounded-lg px-4 py-2 w-full" value={complemento} onChange={e => setComplemento(e.target.value)} />
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

                    <div className="mb-4 mt-6">
                        <h2 className="font-semibold tracking-wider text-lg text-blue">
                            OBSERVAÇÕES
                        </h2>
                        <span className="text-blue text-sm">Escreva abaixo tudo relacionado a o que e como você quer o seu Carambolo</span>
                        <textarea
                            className="border-2 border-gold rounded-lg px-4 py-2 w-full mt-2 h-32"
                            placeholder="Descreva abaixo como você quer o seu Carambolo"
                            value={observacoes}
                            onChange={e => setObservacoes(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex justify-between items-center mt-10">
                        <div>
                            <span><span className="text-gradient font-bold text-lg">TOTAL ESTIMADO:</span> R$ {(doceFornada.valorUnitario * amount).toFixed(2)}</span>
                            <span className="flex items-center gap-1 text-[#665853] text-sm"><IoIosInformationCircle className="text-red" /> Esse valor não inclui o valor do frete</span>
                        </div>
                        <Button
                            text="Finalizar Pedido"
                            onClick={sendOrder}
                        />
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}

export default FornadaOrderPage;
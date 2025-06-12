import { useState, useRef, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { RiFileTextLine } from "react-icons/ri";
import Button from "../Button";
import InputOption from "../InputOption";
import axios from "axios";

export default function ModalCadastroProduto() {
    const [isModalOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const imagemRef = useRef(null);

    const [produto, setProduto] = useState("");
    const [categoria, setCategoria] = useState("");
    const [valor, setValor] = useState("");
    const [observacao, setObservacao] = useState([]);
    const [massa, setMassa] = useState("");
    const [recheioPedido, setRecheioPedido] = useState("");
    const [cobertura, setCobertura] = useState("");
    const [formato, setFormato] = useState("");
    const [tamanho, setTamanho] = useState("");
    const [descricao, setDescricao] = useState("");
    const [categoriaBolo, setCategoriaBolo] = useState("");
    const [decoracao, setDecoracao] = useState("");
    const [categoriaFornada, setCategoriaFornada] = useState("");
    const [nomeDecoracao, setNomeDecoracao] = useState("");

    const [massasDisponiveis, setMassasDisponiveis] = useState([]);
    const [recheiosDisponiveis, setRecheiosDisponiveis] = useState([]);
    const [coberturasDisponiveis, setCoberturasDisponiveis] = useState([]);
    const [formatosDisponiveis, setFormatosDisponiveis] = useState([]);
    const [tamanhosDisponiveis, setTamanhosDisponiveis] = useState([]);
    const [decoracoesDisponiveis, setDecoracoesDisponiveis] = useState([]);

    const fetchDecoracoes = async () => {
        try {
            const token = localStorage.getItem('JWT_TOKEN');
            let config = {};
            
            if (token && token.trim() !== '') {
                try {
                    config.headers = { Authorization: `Bearer ${token}` };
                    const response = await axios.get("http://localhost:8080/decoracoes", config);
                    setDecoracoesDisponiveis(response.data);
                    return;
                } catch (authError) {
                    // Fallback to no auth
                }
            }
            
            const response = await axios.get("http://localhost:8080/decoracoes");
            setDecoracoesDisponiveis(response.data);
        } catch (error) {
            console.error("Erro ao buscar decorações:", error);
        }
    };

    const anexarImagem = (e) => {
        const img = e.target.files[0];
        if (img) {
            setFile(img);
            setFilePreview(URL.createObjectURL(img));
        }
    };
    
    const exibirImagem = () => {
        imagemRef.current?.click();
    };

    const alterarObservacao = (opcao) =>
        observacao.includes(opcao)
            ? setObservacao(observacao.filter((i) => i !== opcao))
            : setObservacao([...observacao, opcao]);

    useEffect(() => {
        setFile(null);
        setFilePreview(null);
        
        if (categoria === "Carambolo") {
            axios
                .get("http://localhost:8080/bolos/massa")
                .then((res) => setMassasDisponiveis(res.data))
                .catch((err) => console.error("Erro ao buscar massas:", err));

            axios
                .get("http://localhost:8080/bolos/recheio-exclusivo")
                .then((res) => setRecheiosDisponiveis(res.data))
                .catch((err) => console.error("Erro ao buscar recheios:", err));
        }

        axios
            .get("http://localhost:8080/bolos/cobertura")
            .then((res) => setCoberturasDisponiveis(res.data))
            .catch((err) => console.error("Erro ao buscar coberturas:", err));

        axios
            .get("http://localhost:8080/bolos/formatos")
            .then(res => setFormatosDisponiveis(res.data))
            .catch(err => console.error("Erro ao buscar formatos:", err));

        axios
            .get("http://localhost:8080/bolos/tamanhos")
            .then(res => setTamanhosDisponiveis(res.data))
            .catch(err => console.error("Erro ao buscar tamanhos:", err));

        fetchDecoracoes();
    }, [categoria]);

    const cadastrarDecoracao = async (e, naoFecharModal = false) => {
        e?.preventDefault?.();

        if (!nomeDecoracao) {
            alert("Preencha o nome da decoração!");
            return;
        }

        const formData = new FormData();
        observacao.forEach((obs) => formData.append("observacao", obs));
        formData.append("nome", nomeDecoracao);
        if (file) formData.append("imagens", file);

        try {
            const token = localStorage.getItem('JWT_TOKEN');
            let config = { headers: {} };
            
            if (token && token.trim() !== '') {
                try {
                    config.headers.Authorization = `Bearer ${token}`;
                    const response = await axios.post("http://localhost:8080/decoracoes", formData, config);
                    alert("Decoração cadastrada com sucesso!");
                    
                    await fetchDecoracoes();
                    
                    setNomeDecoracao("");
                    setObservacao([]);
                    setFile(null);
                    setFilePreview(null);
                    
                    if (categoria === "Decoracao" && !naoFecharModal) {
                        setIsOpen(false);
                    }
                    
                    return response.data.id;
                } catch (authError) {
                    // Fallback to no auth
                }
            }
            
            delete config.headers.Authorization;
            const response = await axios.post("http://localhost:8080/decoracoes", formData, config);
            alert("Decoração cadastrada com sucesso!");
            
            await fetchDecoracoes();
            
            setNomeDecoracao("");
            setObservacao([]);
            setFile(null);
            setFilePreview(null);
            
            if (categoria === "Decoracao" && !naoFecharModal) {
                setIsOpen(false);
            }
            
            return response.data.id;
        } catch (error) {
            alert("Erro ao cadastrar decoração!");
            console.error("Erro completo:", error);
            throw error;
        }
    };

    const cadastrarProduto = async (decoracaoId) => {
        const decoracaoFinal = decoracaoId || (decoracao ? Number(decoracao) : null);
        
        const data = {
            recheioPedidoId: Number(recheioPedido),
            massaId: Number(massa),
            coberturaId: Number(cobertura),
            decoracaoId: decoracaoFinal,
            formato: formato,
            tamanho: tamanho,
            categoria: categoriaBolo
        };

        try {
            const token = localStorage.getItem('JWT_TOKEN');
            let config = {
                headers: { "Content-Type": "application/json" }
            };
            
            if (token && token.trim() !== '') {
                try {
                    config.headers.Authorization = `Bearer ${token}`;
                    await axios.post("http://localhost:8080/bolos", data, config);
                    return;
                } catch (authError) {
                    // Fallback to no auth
                }
            }
            
            delete config.headers.Authorization;
            await axios.post("http://localhost:8080/bolos", data, config);
        } catch (error) {
            alert("Erro ao cadastrar produto!");
            console.error("Erro completo:", error);
            throw error;
        }
    };

    const handleSubmitCarambolo = async (e) => {
        e.preventDefault();
        
        if (!massa) {
            alert("Por favor, selecione uma massa!");
            return;
        }
        if (!recheioPedido) {
            alert("Por favor, selecione um recheio!");
            return;
        }
        if (!cobertura) {
            alert("Por favor, selecione uma cobertura!");
            return;
        }
        if (!formato) {
            alert("Por favor, selecione um formato!");
            return;
        }
        if (!tamanho) {
            alert("Por favor, selecione um tamanho!");
            return;
        }
        
        try {
            let decoracaoIdParaUsar = null;
            
            if (nomeDecoracao && nomeDecoracao.trim() !== '') {
                decoracaoIdParaUsar = await cadastrarDecoracao(null, true);
                
                if (decoracaoIdParaUsar) {
                    setDecoracao(decoracaoIdParaUsar.toString());
                }
            } else {
                decoracaoIdParaUsar = decoracao ? Number(decoracao) : null;
            }
            
            await cadastrarProduto(decoracaoIdParaUsar);
            alert("Produto cadastrado com sucesso!");
            setIsOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    const cadastrarFornada = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("produto", produto);
        formData.append("descricao", descricao);
        formData.append("valor", valor);
        formData.append("categoria", categoriaFornada);

        if (file) {
            formData.append("imagens", file);
        }

        try {
            const response = await axios.post("http://localhost:8080/fornadas/produto-fornada", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Fornada cadastrada com sucesso!");
            
            setProduto("");
            setDescricao("");
            setValor("");
            setCategoriaFornada("");
            setFile(null);
            setFilePreview(null);
            
            setIsOpen(false);
        } catch (error) {
            alert("Erro ao cadastrar fornada!");
            console.error("Erro completo:", error);
        }
    };

    return (
        <>
            <Button
                className="w-[310px] h-[2.5rem] mb-5 mr-6" 
                text={"ADICIONAR NOVO PRODUTO +"} 
                onClick={() => setIsOpen(true)}
            >
            </Button>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <form
                        onSubmit={
                            categoria === "Fornada"
                                ? cadastrarFornada
                                : categoria === "Carambolo"
                                ? handleSubmitCarambolo
                                : cadastrarDecoracao
                        }
                        className="bg-[#fbe4d6] rounded-md border border-blue-400 max-w-4xl w-full max-h-[90vh] overflow-auto text-[#5c3c10] shadow-xl"
                    >
                        <header className="flex justify-between items-center px-6 py-3 border-b border-orange-300 bg-[#fbe4d6]">
                            <h2 className="font-semibold text-lg">Cadastrar Produtos</h2>
                            <div className="flex items-center gap-2">
                                <select
                                    value={categoria}
                                    onChange={(e) => setCategoria(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                >
                                    <option value="" disabled>
                                        Selecione uma categoria
                                    </option>
                                    <option value="Fornada">Fornada</option>
                                    <option value="Carambolo">Carambolo</option>
                                    <option value="Decoracao">Decoração</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="text-red-600 hover:scale-110 transition-transform"
                                >
                                    <X size={26} />
                                </button>
                            </div>
                        </header>

                        <section className="flex px-8 gap-8 py-4 h-[557px] overflow-y-auto">
                            {/* Imagem */}
                            <div className="w-1/2 flex flex-col items-center justify-center gap-4">
                                <div className="flex flex-col gap-4 items-center border-[3px] border-[#d6a87c] rounded-md p-2 px-1 w-72 h-80">
                                    <div className="border-2 border-dashed border-[#d6a87c] rounded-md p-4 flex flex-col items-center justify-center gap-3 bg-white w-64 h-64 overflow-hidden">
                                        {filePreview ? (
                                            <img
                                                src={filePreview}
                                                alt="Prévia"
                                                className="w-full h-full object-contain rounded-md"
                                            />
                                        ) : (
                                            <RiFileTextLine size={100} className="text-goldCard" />
                                        )}
                                    </div>

                                    <Button
                                        type="button"
                                        className="text-sm flex flex-row gap-2 items-center"
                                        onClick={exibirImagem}
                                    >
                                        <Upload size={16} /> Adicionar Imagem
                                    </Button>
                                    <input
                                        type="file"
                                        ref={imagemRef}
                                        accept="image/*"
                                        className="hidden"
                                        onChange={anexarImagem}
                                    />
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="w-1/2 text-sm flex flex-col justify-start overflow-y-auto pr-2 gap-4">
                                {categoria === "Carambolo" && (
                                    <>
                                        {/* Campos de Carambolo */}
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium">Massa</label>
                                            <select
                                                value={massa}
                                                onChange={(e) => setMassa(e.target.value)}
                                                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                            >
                                                <option value="" disabled>
                                                    Selecione uma massa
                                                </option>
                                                {massasDisponiveis.map((m) => (
                                                    <option key={m.id} value={m.id}>
                                                        {m.sabor}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium">Recheio</label>
                                            <select
                                                value={recheioPedido}
                                                onChange={(e) => setRecheioPedido(e.target.value)}
                                                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                            >
                                                <option value="" disabled>
                                                    Selecione um recheio
                                                </option>
                                                {recheiosDisponiveis.map((r) => (
                                                    <option key={r.id} value={r.id}>
                                                        {r.nome}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium">Cobertura</label>
                                            <select
                                                value={cobertura}
                                                onChange={(e) => setCobertura(e.target.value)}
                                                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                            >
                                                <option value="" disabled>
                                                    Selecione uma cobertura
                                                </option>
                                                {coberturasDisponiveis.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.descricao}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium">Formato</label>
                                            <select
                                                value={formato}
                                                onChange={(e) => setFormato(e.target.value)}
                                                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                            >
                                                <option value="">Selecione um formato</option>
                                                {formatosDisponiveis.map((f) => (
                                                    <option key={f} value={f}>
                                                        {f.charAt(0).toUpperCase() + f.slice(1).toLowerCase()}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium">Tamanho</label>
                                            <select
                                                value={tamanho}
                                                onChange={(e) => setTamanho(e.target.value)}
                                                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                            >
                                                <option value="">Selecione um tamanho</option>
                                                {tamanhosDisponiveis.map((t) => (
                                                    <option key={t.id ?? t.nome ?? t} value={t.id ?? t.nome ?? t}>
                                                        {(t.nome ?? t.toString()).charAt(0).toUpperCase() + (t.nome ?? t.toString()).slice(1).toLowerCase()}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium">Decoração</label>
                                            <select
                                                value={decoracao}
                                                onChange={(e) => setDecoracao(e.target.value)}
                                                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                            >
                                                <option value="">Selecione uma decoracao</option>
                                                {decoracoesDisponiveis.map((d) => (
                                                    <option key={d.id} value={d.id}>
                                                        {d.nome}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium">Categoria</label>
                                            <input
                                                type="text"
                                                value={categoriaBolo}
                                                onChange={(e) => setCategoriaBolo(e.target.value)}
                                                placeholder="Digite a categoria do bolo"
                                                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                            />
                                        </div>

                                        <Button type="submit" className="w-fit self-end">
                                            Cadastrar
                                        </Button>
                                    </>
                                )}
                
                                {categoria === "Fornada" && (
                                    <>
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium">Nome do produto</label>
                                            <input
                                                type="text"
                                                value={produto}
                                                onChange={(e) => setProduto(e.target.value)}
                                                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium">Descrição</label>
                                            <textarea
                                                value={descricao}
                                                onChange={(e) => setDescricao([e.target.value])}
                                                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                            ></textarea>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium">Categoria</label>
                                            <input
                                                type="string"
                                                value={categoriaFornada}
                                                onChange={(e) => setCategoriaFornada(e.target.value)}
                                                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                            />
                                        </div>

                                        
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium">Valor</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={valor}
                                                onChange={(e) => setValor(e.target.value)}
                                                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                            />
                                        </div>

                                        <Button type="submit" className="w-fit self-end">
                                            Cadastrar
                                        </Button>
                                    </>
                                )}
                                {categoria === "Decoracao" && (
                                    <>
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium">Nome da Decoração</label>
                                            <input
                                                type="text"
                                                value={nomeDecoracao}
                                                onChange={(e) => setNomeDecoracao(e.target.value)}
                                                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                                placeholder="Digite o nome da decoração"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium">Observações</label>
                                            <div className="flex flex-wrap gap-4">
                                                {["cereja", "perolado", "glitter", "lacinhos"].map((opcao) => (
                                                    <InputOption
                                                        key={opcao}
                                                        type="checkbox"
                                                        label={opcao}
                                                        checked={observacao.includes(opcao)}
                                                        onChange={() => alterarObservacao(opcao)}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <input
                                                type="file"
                                                ref={imagemRef}
                                                accept="image/*"
                                                className="hidden"
                                                onChange={anexarImagem}
                                            />
                                        </div>

                                        <Button type="submit" className="w-fit self-end">
                                            Cadastrar
                                        </Button>
                                    </>
                                )}
                            </div>
                        </section>
                    </form>
                </div>
            )}
        </>
    );
}

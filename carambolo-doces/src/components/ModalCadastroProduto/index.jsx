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

    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("");
    const [preco, setPreco] = useState("");
    const [adicionais, setAdicionais] = useState([]);
    const [massa, setMassa] = useState("");
    const [recheioPedido, setRecheioPedido] = useState("");
    const [cobertura, setCobertura] = useState("");
    const [formato, setFormato] = useState("");
    const [tamanho, setTamanho] = useState("");
    const [descricao, setDescricao] = useState("");
    const [categoriaBolo, setCategoriaBolo] = useState("");

    const [massasDisponiveis, setMassasDisponiveis] = useState([]);
    const [recheiosDisponiveis, setRecheiosDisponiveis] = useState([]);
    const [coberturasDisponiveis, setCoberturasDisponiveis] = useState([]);
    const [formatosDisponiveis, setFormatosDisponiveis] = useState([]);
    const [tamanhosDisponiveis, setTamanhosDisponiveis] = useState([]);

    const anexarImagem = (e) => {
        const img = e.target.files[0];
        if (img) {
            setFile(img);
            setFilePreview(URL.createObjectURL(img));
        }
    };
    const exibirImagem = () => imagemRef.current?.click();

    const alternarAdicional = (opcao) =>
        adicionais.includes(opcao)
            ? setAdicionais(adicionais.filter((i) => i !== opcao))
            : setAdicionais([...adicionais, opcao]);

    useEffect(() => {
        if (categoria === "Carambolo") {
            axios
                .get("http://localhost:8080/bolos/massa")
                .then((res) => {
                    console.log(res.data); // Veja aqui como a resposta está vindo
                    setMassasDisponiveis(res.data);
                })
                .catch((err) => console.error("Erro ao buscar massas:", err));

            // Buscar recheios
            axios
                .get("http://localhost:8080/bolos/recheio-exclusivo")
                .then((res) => {
                    console.log("Recheios:", res.data);
                    setRecheiosDisponiveis(res.data);
                })
                .catch((err) => console.error("Erro ao buscar recheios:", err));
        }

        axios
            .get("http://localhost:8080/bolos/cobertura")
            .then((res) => {
                console.log("Coberturas:", res.data);
                setCoberturasDisponiveis(res.data);
            })
            .catch((err) => console.error("Erro ao buscar coberturas:", err));

        axios.get("http://localhost:8080/bolos/formatos")
            .then(res =>
                console.log("Formatos:", res.data) ||
                setFormatosDisponiveis(res.data))
            .catch(err => console.error("Erro ao buscar formatos:", err));

        axios.get("http://localhost:8080/bolos/tamanhos")
            .then(res =>
                console.log("Tamanhos:", res.data) ||
                setTamanhosDisponiveis(res.data))
            .catch(err => console.error("Erro ao buscar tamanhos:", err));
    }, [categoria]);


    const cadastrarProduto = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        if (categoria === "Carambolo") {
          formData.append("massa", massa); 
          formData.append("recheioPedido", recheioPedido); 
          formData.append("cobertura", cobertura); 
          formData.append("formato", formato); 
          formData.append("tamanho", tamanho);
          adicionais.forEach((a) => formData.append("adicionais", a)); // array
        } else if (categoria === "Fornada") {
          formData.append("produto", nome);
          formData.append("descricao", descricao);
          formData.append("valor", preco);
        }
        // formData.append("categoria", categoria);
        // if (file) formData.append("imagem", file);

        // let url = "";
        // if (categoria === "Carambolo") {
        //   url = "http://localhost:8080/bolos";
        // } else if (categoria === "Fornada") {
        //   url = "http://localhost:8080/produto-fornada";
        // }

        // try {
        //   await axios.post(url, formData);
        //   alert("Cadastrado com sucesso!");
        //   // resetar estados
        //   setIsOpen(false);
        //   setFile(null);
        //   setFilePreview(null);
        //   setCategoria("");
        //   setNome("");
        //   setPreco("");
        //   setAdicionais([]);
        //   setMassa("");
        //   setRecheioPedido("");
        //   setCobertura("");
        //   setFormato("");
        //   setTamanho("");
        //   setDescricao("");
        // } catch (err) {
        //   console.error("Erro ao cadastrar:", err);
        //   alert("Erro ao cadastrar!");
        // }

        let data = {};

        // if (categoria === "Carambolo") {
        //     data = {
        //         massa: massa,
        //         recheioPedido: recheioPedido,
        //         cobertura: cobertura,
        //         formato: formato,
        //         tamanho: tamanho,
        //         categoria: categoria,
        //     };
        // } else if (categoria === "Fornada") {
        //     data = {
        //         produto: nome,
        //         descricao: descricao,
        //         valor: preco,
        //         categoria: categoria,
        //     };
        // }

        try {
            const url =
                categoria === "Carambolo"
                    ? "http://localhost:8080/bolos"
                    : "http://localhost:8080/produto-fornada";

            const res = await axios.post(url, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            alert("Cadastrado com sucesso!");
            setIsOpen(false);
            setFile(null);
            setFilePreview(null);
            setCategoria("");
            setNome("");
            setPreco("");
            setAdicionais([]);
            setMassa("");
            setRecheioPedido("");
            setCobertura("");
            setFormato("");
            setTamanho("");
            setDescricao("");
        } catch (err) {
            console.error("Erro ao cadastrar:", err);
            alert("Erro ao cadastrar!");
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="bg-[#d6a87c] text-white px-4 py-2 rounded hover:bg-[#c49664]"
            >
                Abrir Modal
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <form
                        onSubmit={cadastrarProduto}
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
                                                    <option key={m.id} value={m.sabor}>
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
                                                    <option key={r.id} value={r.nome}>
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
                                                <option value="">Selecione uma cobertura</option>
                                                {coberturasDisponiveis.map((c) => (
                                                    <option key={c.id} value={c.descricao}>
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
                                                    <option key={t} value={t}>
                                                        {t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()}
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

                                        <div className="flex flex-wrap gap-4">
                                            <span className="font-medium w-full">Adicionais</span>
                                            {["cereja", "perolado", "glitter", "lacinhos"].map((opcao) => (
                                                <InputOption
                                                    key={opcao}
                                                    type="checkbox"
                                                    label={opcao}
                                                    checked={adicionais.includes(opcao)}
                                                    onChange={() => alternarAdicional(opcao)}
                                                />
                                            ))}
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
                                                value={nome}
                                                onChange={(e) => setNome(e.target.value)}
                                                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium">Descrição</label>
                                            <textarea
                                                value={adicionais.join(", ")}
                                                onChange={(e) => setAdicionais([e.target.value])}
                                                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                            ></textarea>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium">Preço</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={preco}
                                                onChange={(e) => setPreco(e.target.value)}
                                                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
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

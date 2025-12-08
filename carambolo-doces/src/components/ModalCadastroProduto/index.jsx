import { useState, useRef, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { RiFileTextLine } from "react-icons/ri";
import Button from "../Button";
import InputOption from "../InputOption";
import { axiosApi } from "../../provider/AxiosApi";
import { fetchAllAdicionais } from "../../service/adicionalService";
import { toast } from "../../utils/toast";

export default function ModalCadastroProduto() {
    const [isModalOpen, setIsOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const imagemRef = useRef(null);

    const [produto, setProduto] = useState("");
    const [categoria, setCategoria] = useState("");
    const [valor, setValor] = useState("");
    const [observacao, setObservacao] = useState([]);
    const [categoriaFornada, setCategoriaFornada] = useState("");
    const [nomeDecoracao, setNomeDecoracao] = useState("");
    const [categoriaDecoracao, setCategoriaDecoracao] = useState("");
    const [observacoesDecoracao, setObservacoesDecoracao] = useState("");
    const [allAdicionais, setAllAdicionais] = useState([]);
    const [adicionaisToRequest, setAdicionaisToRequest] = useState([]);
    const [descricao, setDescricao] = useState("");

    const anexarImagem = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length > 0) {
            // Criar previews apenas para os novos arquivos
            const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
            setFiles(prev => [...prev, ...selectedFiles]);
            setFilePreviews(prev => [...prev, ...newPreviews]);
        }
        // Limpar o input para permitir selecionar o mesmo arquivo novamente
        if (imagemRef.current) {
            imagemRef.current.value = '';
        }
    };

    const removerImagem = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        const newPreviews = filePreviews.filter((_, i) => i !== index);
        // Revogar URL do objeto removido para liberar memória
        URL.revokeObjectURL(filePreviews[index]);
        setFiles(newFiles);
        setFilePreviews(newPreviews);
    };

    const exibirImagem = () => {
        imagemRef.current?.click();
    };

    const handleAdicionaisToAdd = (adicional) => {
        setAdicionaisToRequest((prev) => {
            const exists = prev.some((item) => item.id === adicional.id);
            if (exists) {
                return prev.filter((item) => item.id !== adicional.id);
            } else {
                return [...prev, adicional];
            }
        });
    }

    const getAllAdicionais = async () => {
        setAllAdicionais(await fetchAllAdicionais().then(data => data || []));
    }

    useEffect(() => {
        getAllAdicionais()
    }, [])

    // Limpar estado quando o modal fechar
    useEffect(() => {
        if (!isModalOpen) {
            // Limpar previews e revogar URLs
            setFilePreviews(prev => {
                prev.forEach(preview => URL.revokeObjectURL(preview));
                return [];
            });
            setFiles([]);
        }
    }, [isModalOpen]);

    const cadastrarDecoracao = async (e, naoFecharModal = false) => {
        e?.preventDefault?.();

        if (!nomeDecoracao) {
            toast.warn('Preencha o nome da decoração!');
            return;
        }

        const formData = new FormData();
        if (observacoesDecoracao && observacoesDecoracao.length > 0) {
            formData.append("observacao", observacoesDecoracao);
        } else {
            formData.append("observacao", "");
        }
        formData.append("nome", nomeDecoracao);
        // Adicionar múltiplas imagens
        if (files && files.length > 0) {
            files.forEach((file) => {
                formData.append("imagens", file);
            });
        }
        if (categoriaDecoracao && categoria === "Decoracao") {
            formData.append("categoria", categoriaDecoracao);
        }

        formData.append("adicionais", adicionaisToRequest.map(item => item.id))

        try {
            const response = await axiosApi.post("/decoracoes", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Decoração cadastrada com sucesso!');

            setNomeDecoracao("");
            setObservacao([]);
            // Limpar previews e revogar URLs
            filePreviews.forEach(preview => URL.revokeObjectURL(preview));
            setFiles([]);
            setFilePreviews([]);

            setCategoriaDecoracao("");

            if (categoria === "Decoracao" && !naoFecharModal) {
                setIsOpen(false);
            }

            return response.data.id;
        } catch (error) {
            toast.error('Erro ao cadastrar decoração!');
            console.error("Erro completo:", error);
            throw error;
        }
    };

    const cadastrarFornada = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("produto", produto);
        formData.append("descricao", descricao);
        formData.append("valor", valor);
        formData.append("categoria", categoriaFornada);

        // Adicionar múltiplas imagens
        if (files && files.length > 0) {
            files.forEach((file) => {
                formData.append("imagens", file);
            });
        }

        try {
            await axiosApi.post("/fornadas/produto-fornada", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Produto cadastrado com sucesso!');

            // Disparar evento para recarregar a lista de produtos
            window.dispatchEvent(new CustomEvent('productCreated'));

            setProduto("");
            setValor("");
            setCategoriaFornada("");
            // Limpar previews e revogar URLs
            filePreviews.forEach(preview => URL.revokeObjectURL(preview));
            setFiles([]);
            setFilePreviews([]);

            setIsOpen(false);
        } catch (error) {
            toast.error('Erro ao cadastrar produto!');
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
                                        Selecione uma pré definição
                                    </option>
                                    <option value="Fornada">Fornada</option>
                                    <option value="Decoracao">Decoração Carambolo</option>
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
                            {/* Imagens */}
                            <div className="w-1/2 flex flex-col items-center justify-center gap-4">
                                <div className="flex flex-col gap-4 items-center border-[3px] border-[#d6a87c] rounded-md p-2 px-1 w-72 max-h-[500px] overflow-y-auto">
                                    {/* Preview das imagens */}
                                    {filePreviews.length > 0 ? (
                                        <div className="flex flex-col gap-3 w-full">
                                            {filePreviews.map((preview, index) => (
                                                <div key={index} className="relative border-2 border-[#d6a87c] rounded-md p-2 bg-white">
                                                    <button
                                                        type="button"
                                                        onClick={() => removerImagem(index)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                                                        title="Remover imagem"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                    <img
                                                        src={preview}
                                                        alt={`Prévia ${index + 1}`}
                                                        className="w-full h-48 object-contain rounded-md"
                                                    />
                                                    <p className="text-xs text-center mt-1 text-gray-600">
                                                        Imagem {index + 1}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-[#d6a87c] rounded-md p-4 flex flex-col items-center justify-center gap-3 bg-white w-64 h-64">
                                            <RiFileTextLine size={100} className="text-goldCard" />
                                            <p className="text-sm text-gray-500 text-center">
                                                Nenhuma imagem adicionada
                                            </p>
                                        </div>
                                    )}

                                    <Button
                                        type="button"
                                        className="text-sm flex flex-row gap-2 items-center"
                                        onClick={exibirImagem}
                                    >
                                        <Upload size={16} /> {filePreviews.length > 0 ? 'Adicionar Mais Imagens' : 'Adicionar Imagens'}
                                    </Button>
                                    <input
                                        type="file"
                                        ref={imagemRef}
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={anexarImagem}
                                    />
                                    {filePreviews.length > 0 && (
                                        <p className="text-xs text-gray-500 text-center">
                                            {filePreviews.length} {filePreviews.length === 1 ? 'imagem' : 'imagens'} adicionada{filePreviews.length > 1 ? 's' : ''}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="w-1/2 text-sm flex flex-col justify-start overflow-y-auto pr-2 gap-4">
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
                                            <label className="font-medium">Categoria</label>
                                            <input
                                                type="text"
                                                value={categoriaDecoracao}
                                                onChange={(e) => setCategoriaDecoracao(e.target.value)}
                                                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                                placeholder="Ex.: Vintage, Birthday, ..."
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium">Observações</label>
                                            <input
                                                value={observacoesDecoracao}
                                                onChange={(e) => setObservacoesDecoracao(e.target.value)}
                                                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                                placeholder="Adicione observações sobre a decoração"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium">Adicionais</label>
                                                <div className="max-h-40 overflow-y-auto pr-2">
                                                    <div className="flex flex-col gap-2">
                                                        {allAdicionais.map((opcao) => (
                                                            <div key={opcao.id}>
                                                                <InputOption
                                                                    type="checkbox"
                                                                    label={opcao.descricao}
                                                                    checked={adicionaisToRequest.some(item => item.id === opcao.id)}
                                                                    onChange={() => handleAdicionaisToAdd(opcao)}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
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

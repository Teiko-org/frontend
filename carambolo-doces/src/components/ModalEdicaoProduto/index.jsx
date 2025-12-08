import { useState, useRef, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { RiFileTextLine } from "react-icons/ri";
import Button from "../Button";
import InputOption from "../InputOption";
import { axiosApi } from "../../provider/AxiosApi";
import { fetchAllAdicionais } from "../../service/adicionalService";
import { updateDecoracao, getDecoraceosComAdicionais } from "../../service/decoracaoService";
import { toast } from "../../utils/toast";

export default function ModalEdicaoProduto({ isOpen, onClose, produto, onProdutoEditado, initialCategoria }) {
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const imagemRef = useRef(null);

    const [produtoNome, setProdutoNome] = useState("");
    const [categoria, setCategoria] = useState("");
    const [valor, setValor] = useState("");
    const [observacao, setObservacao] = useState("");
    const [categoriaFornada, setCategoriaFornada] = useState("");
    const [nomeDecoracao, setNomeDecoracao] = useState("");
    const [categoriaDecoracao, setCategoriaDecoracao] = useState("");
    const [observacoesDecoracao, setObservacoesDecoracao] = useState("");
    const [allAdicionais, setAllAdicionais] = useState([]);
    const [adicionaisToRequest, setAdicionaisToRequest] = useState([]);

    useEffect(() => {
        if (!isOpen) return;
        // inicializa campos a partir do produto recebido
        setProdutoNome(produto?.produto || produto?.nome || "");
        // set category based on initialCategoria prop (coming from ProductList)
        const categoria = initialCategoria || produto?.categoria || "";
        setCategoria(categoria);
        setValor(produto?.valor ?? produto?.preco ?? "");
        setObservacao(produto?.descricao || "");
        setCategoriaFornada(produto?.categoria || "");
        setNomeDecoracao(produto?.nomeDecoracao || produto?.nome || "");
        setCategoriaDecoracao(produto?.categoriaDecoracao || "");
        setObservacoesDecoracao(produto?.observacoesDecoracao || produto?.observacao || "");
        setFilePreview(produto?.imagemUrl || produto?.imagens?.[0] || produto?.image || null);
        // se o produto já tem adicionais, pré-seleciona
        if (produto?.adicionais && Array.isArray(produto.adicionais)) {
            setAdicionaisToRequest(produto.adicionais.map(a => ({ id: a.id, descricao: a.descricao })));
        } else {
            setAdicionaisToRequest([]);
        }
    }, [isOpen, produto, initialCategoria]);

    const getAllAdicionais = async () => {
        setAllAdicionais(await fetchAllAdicionais().then(data => data || []));
    }

    const getDecoracacaoAdicionais = async () => {
        try {
            const decoracoesComAdicionais = await getDecoraceosComAdicionais();
            
            if (!decoracoesComAdicionais || decoracoesComAdicionais.length === 0) {
                return;
            }

            // Find the decoration data for the current product being edited
            const decoracaoId = produto?.decoracaoId || produto?.id;
            const decoracaoData = decoracoesComAdicionais.find(d => d.decoracaoId === decoracaoId);

            if (!decoracaoData || !decoracaoData.adicionaisPossiveis) {
                return;
            }

            // Get the description of adicionais from the general list
            const allAdicionaisLocal = await fetchAllAdicionais();
            
            // Create a map of adicional descriptions to ids
            const adicionaisMap = {};
            if (allAdicionaisLocal && Array.isArray(allAdicionaisLocal)) {
                allAdicionaisLocal.forEach(adicional => {
                    adicionaisMap[adicional.descricao] = adicional.id;
                });
            }

            // Match the descriptions from decoracaoData.adicionaisPossiveis with the ids
            const decoracaoAdicionaisIds = decoracaoData.adicionaisPossiveis
                .map(descricao => adicionaisMap[descricao])
                .filter(id => id !== undefined);

            // Pre-select adicionais that belong to this decoration
            const selectedAdicionais = allAdicionaisLocal.filter(adicional =>
                decoracaoAdicionaisIds.includes(adicional.id)
            ).map(a => ({ id: a.id, descricao: a.descricao }));

            setAdicionaisToRequest(selectedAdicionais);
        } catch (error) {
            console.error("Erro ao buscar adicionais da decoração:", error);
        }
    }

    useEffect(() => {
        if (!isOpen) return;
        getAllAdicionais();
        
        // If it's a decoration, get decoration-specific adicionais
        const categoria = initialCategoria || produto?.categoria || "";
        if (categoria === "Decoracao" || categoria?.toLowerCase().includes("decoracao")) {
            getDecoracacaoAdicionais();
        }
    }, [isOpen]);

    const anexarImagem = (e) => {
        const img = e.target.files[0];
        if (img) {
            setFile(img);
            setFilePreview(URL.createObjectURL(img));
        }
    };

    const exibirImagem = () => imagemRef.current?.click();

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

    const editarDecoracao = async (e) => {
        e?.preventDefault?.();

        if (!nomeDecoracao) {
            toast.warn('Preencha o nome da decoração!');
            return;
        }

        const decoracaoId = produto?.decoracaoId || produto?.id;
        const formData = new FormData();
        formData.append("nome", nomeDecoracao);
        formData.append("categoria", categoriaDecoracao || "");
        formData.append("observacao", observacoesDecoracao || "");
        
        // Adicionar adicionais como string separada por vírgula
        if (adicionaisToRequest && adicionaisToRequest.length > 0) {
            const adicionaisIds = adicionaisToRequest.map(item => item.id).join(",");
            formData.append("adicionais", adicionaisIds);
        } else {
            formData.append("adicionais", "");
        }
        
        // Adicionar imagem apenas se um novo arquivo foi selecionado
        if (file) {
            formData.append("imagens", file);
        }

        console.log('decoracaoId: ', decoracaoId)

        try {
            const response = await updateDecoracao(decoracaoId, formData);
            toast.success('Decoração atualizada com sucesso!');
            onProdutoEditado && onProdutoEditado();
            onClose();
        } catch (error) {
            toast.error('Erro ao atualizar decoração!');
            console.error(error);
        }
    }

    const editarFornada = async (e) => {
        e?.preventDefault?.();

        const formData = new FormData();
        formData.append("produto", produtoNome);
        formData.append("descricao", observacao);
        formData.append("valor", valor);
        formData.append("categoria", categoriaFornada || categoria);
        if (file) formData.append("imagens", file);

        try {
            await axiosApi.put(`/fornadas/produto-fornada/${produto.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Produto atualizado com sucesso!');
            
            // Disparar evento para recarregar a lista de produtos
            window.dispatchEvent(new CustomEvent('productUpdated'));
            
            onProdutoEditado && onProdutoEditado();
            onClose();
        } catch (error) {
            toast.error('Erro ao atualizar fornada!');
            console.error(error);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <form
                onSubmit={categoria === "Fornada" ? editarFornada : editarDecoracao}
                className="bg-[#fbe4d6] rounded-md border border-blue-400 max-w-4xl w-full max-h-[90vh] overflow-auto text-[#5c3c10] shadow-xl"
            >
                <header className="flex justify-between items-center px-6 py-3 border-b border-orange-300 bg-[#fbe4d6]">
                    <h2 className="font-semibold text-lg">Editar Produto</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-[#5c3c10]">{categoria || 'Carregando...'}</span>
                        <button
                            type="button"
                            onClick={onClose}
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
                                <Upload size={16} /> Atualizar Imagem
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
                    {(categoria === "Fornada" || categoria?.toLowerCase() === "fornada") && (
                            <>
                                <div className="flex flex-col gap-1">
                                    <label className="font-medium">Nome do produto</label>
                                    <input
                                        type="text"
                                        value={produtoNome}
                                        onChange={(e) => setProdutoNome(e.target.value)}
                                        className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-medium">Descrição</label>
                                    <textarea
                                        value={observacao}
                                        onChange={(e) => setObservacao(e.target.value)}
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
                                    Salvar Alterações
                                </Button>
                            </>
                        )}

                        {(categoria === "Decoracao" || categoria?.toLowerCase().includes("decoracao") || categoria?.toLowerCase().includes("decoração")) && (
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
                                    Salvar Alterações
                                </Button>
                            </>
                        )}
                    </div>
                </section>
            </form>
        </div>
    );
}

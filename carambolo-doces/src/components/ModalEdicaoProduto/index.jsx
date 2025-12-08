import { useState, useRef, useEffect } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import { RiFileTextLine } from "react-icons/ri";
import Button from "../Button";
import InputOption from "../InputOption";
import { axiosApi } from "../../provider/AxiosApi";
import { fetchAllAdicionais } from "../../service/adicionalService";
import { updateDecoracao, getDecoraceosComAdicionais, getDecoracaoById } from "../../service/decoracaoService";
import { toast } from "../../utils/toast";

export default function ModalEdicaoProduto({ isOpen, onClose, produto, onProdutoEditado, initialCategoria }) {
    const [imagens, setImagens] = useState([]); // Array de { url: string, file: File | null, isNew: boolean }
    const [imagensOriginaisCount, setImagensOriginaisCount] = useState(0); // Contador de imagens originais
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

    // Buscar dados atualizados quando o modal abrir
    useEffect(() => {
        if (!isOpen || !produto?.id) return;
        
        const carregarDadosAtualizados = async () => {
            try {
                // Se for decoração, buscar dados atualizados da API
                const categoria = initialCategoria || produto?.categoria || "";
                if (categoria === "Decoracao" || categoria?.toLowerCase().includes("decoracao")) {
                    const decoracaoId = produto?.decoracaoId || produto?.id;
                    const decoracaoAtualizada = await getDecoracaoById(decoracaoId);
                    if (decoracaoAtualizada) {
                        // Atualizar produto com dados mais recentes
                        const produtoAtualizado = {
                            ...produto,
                            nomeDecoracao: decoracaoAtualizada.nome,
                            categoriaDecoracao: decoracaoAtualizada.categoria || "",
                            observacoesDecoracao: decoracaoAtualizada.observacao || "",
                            observacao: decoracaoAtualizada.observacao || "",
                            imagens: decoracaoAtualizada.imagens || [],
                            imagemUrl: decoracaoAtualizada.imagens?.[0] || null,
                            adicionais: decoracaoAtualizada.adicionais || []
                        };
                        inicializarCampos(produtoAtualizado);
                        return;
                    }
                }
                // Se não for decoração ou não conseguir buscar, usar dados do produto recebido
                inicializarCampos(produto);
            } catch (error) {
                console.warn("Erro ao buscar dados atualizados, usando dados do produto recebido:", error);
                inicializarCampos(produto);
            }
        };
        
        const inicializarCampos = (produtoData) => {
            // inicializa campos a partir do produto recebido
            setProdutoNome(produtoData?.produto || produtoData?.nome || "");
            // set category based on initialCategoria prop (coming from ProductList)
            const categoria = initialCategoria || produtoData?.categoria || "";
            setCategoria(categoria);
            setValor(produtoData?.valor ?? produtoData?.preco ?? "");
            setObservacao(produtoData?.descricao || "");
            setCategoriaFornada(produtoData?.categoria || "");
            setNomeDecoracao(produtoData?.nomeDecoracao || produtoData?.nome || "");
            setCategoriaDecoracao(produtoData?.categoriaDecoracao || "");
            setObservacoesDecoracao(produtoData?.observacoesDecoracao || produtoData?.observacao || "");
            
            // Inicializar imagens existentes
            const imagensExistentes = [];
            if (produtoData?.imagens && Array.isArray(produtoData.imagens) && produtoData.imagens.length > 0) {
                // Se imagens é um array de URLs
                produtoData.imagens.forEach(url => {
                    if (url && typeof url === 'string') {
                        imagensExistentes.push({ url, file: null, isNew: false });
                    }
                });
            } else if (produtoData?.imagemUrl) {
                // Se tem imagemUrl única
                imagensExistentes.push({ url: produtoData.imagemUrl, file: null, isNew: false });
            } else if (produtoData?.image) {
                // Se tem image única
                imagensExistentes.push({ url: produtoData.image, file: null, isNew: false });
            }
            setImagens(imagensExistentes);
            setImagensOriginaisCount(imagensExistentes.length); // Guardar contador de imagens originais
            
            // se o produto já tem adicionais, pré-seleciona
            if (produtoData?.adicionais && Array.isArray(produtoData.adicionais)) {
                setAdicionaisToRequest(produtoData.adicionais.map(a => ({ id: a.id, descricao: a.descricao })));
            } else {
                setAdicionaisToRequest([]);
            }
        };
        
        carregarDadosAtualizados();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, produto?.id]);

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

            if (!decoracaoData || !decoracaoData.adicionaisPossiveis || decoracaoData.adicionaisPossiveis.length === 0) {
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
            // Silenciosamente falha - não quebra o modal se não conseguir buscar adicionais
            console.warn("Erro ao buscar adicionais da decoração (continuando sem pré-seleção):", error);
            // Mantém os adicionais que já estavam selecionados (se houver)
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

    // Cleanup: revogar URLs de objetos quando o componente desmontar ou fechar
    useEffect(() => {
        return () => {
            imagens.forEach(imagem => {
                if (imagem.isNew && imagem.url) {
                    URL.revokeObjectURL(imagem.url);
                }
            });
        };
    }, []);

    const anexarImagem = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        
        const novasImagens = files.map(file => ({
            url: URL.createObjectURL(file),
            file: file,
            isNew: true
        }));
        
        setImagens(prev => [...prev, ...novasImagens]);
        
        // Limpar o input para permitir selecionar o mesmo arquivo novamente
        if (imagemRef.current) {
            imagemRef.current.value = '';
        }
    };

    const removerImagem = (index) => {
        setImagens(prev => {
            const novaLista = prev.filter((_, i) => i !== index);
            // Se a imagem removida era nova (File), revogar a URL do objeto
            if (prev[index]?.isNew && prev[index]?.url) {
                URL.revokeObjectURL(prev[index].url);
            }
            return novaLista;
        });
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
        
        // Garantir que nome sempre seja uma string válida
        formData.append("nome", String(nomeDecoracao || ""));
        
        // Garantir que categoria sempre seja uma string válida
        formData.append("categoria", categoriaDecoracao != null ? String(categoriaDecoracao) : "");
        
        // Sempre enviar observacao como string válida (não pode ser null ou undefined)
        // O backend requer este campo, então sempre enviar, mesmo que vazio
        const observacaoValue = String(observacoesDecoracao || "");
        formData.append("observacao", observacaoValue);
        
        // Adicionar adicionais como string separada por vírgula
        if (adicionaisToRequest && adicionaisToRequest.length > 0) {
            const adicionaisIds = adicionaisToRequest.map(item => item.id).join(",");
            formData.append("adicionais", adicionaisIds);
        } else {
            formData.append("adicionais", "");
        }
        
        // Verificar se houve remoção de imagens existentes
        const imagensExistentesAtuais = imagens.filter(img => !img.isNew).length;
        const houveRemocao = imagensExistentesAtuais < imagensOriginaisCount;
        const todasImagensRemovidas = imagens.length === 0 && imagensOriginaisCount > 0;
        const novasImagens = imagens.filter(imagem => imagem.isNew && imagem.file);
        
        // Se houve remoção de imagens existentes, precisamos re-enviar todas as imagens restantes
        if (houveRemocao || todasImagensRemovidas) {
            // Baixar e re-enviar todas as imagens restantes (existentes + novas)
            const imagensParaEnviar = [];
            
            // Primeiro, adicionar novas imagens que já têm file
            imagensParaEnviar.push(...novasImagens.map(img => img.file));
            
            // Depois, baixar e adicionar imagens existentes que foram mantidas
            const imagensExistentesMantidas = imagens.filter(img => !img.isNew);
            for (const imagemExistente of imagensExistentesMantidas) {
                try {
                    const response = await fetch(imagemExistente.url);
                    const blob = await response.blob();
                    const file = new File([blob], `imagem_${Date.now()}.jpg`, { type: blob.type });
                    imagensParaEnviar.push(file);
                } catch (error) {
                    console.warn(`Erro ao baixar imagem ${imagemExistente.url}:`, error);
                }
            }
            
            // Se todas as imagens foram removidas, enviar um arquivo vazio para indicar remoção
            if (todasImagensRemovidas && imagensParaEnviar.length === 0) {
                // Enviar um arquivo vazio para indicar que todas as imagens devem ser removidas
                const emptyBlob = new Blob([], { type: 'image/png' });
                const emptyFile = new File([emptyBlob], 'empty.png', { type: 'image/png' });
                formData.append("imagens", emptyFile);
            } else {
                // Enviar todas as imagens restantes
                imagensParaEnviar.forEach(file => {
                    if (file) {
                        formData.append("imagens", file);
                    }
                });
            }
        } else {
            // Se não houve remoção, só enviar novas imagens
            if (novasImagens.length > 0) {
                novasImagens.forEach(imagem => {
                    if (imagem.file) {
                        formData.append("imagens", imagem.file);
                    }
                });
            }
            // Se não houver novas imagens e não houve remoção, não enviar o campo (backend manterá as existentes)
        }

        // Debug: verificar o que está sendo enviado
        console.log('Atualizando decoração:', {
            decoracaoId,
            nome: nomeDecoracao,
            observacao: observacaoValue,
            categoria: categoriaDecoracao,
            novasImagens: novasImagens.length,
            totalImagens: imagens.length,
            houveRemocao
        });

        try {
            const response = await updateDecoracao(decoracaoId, formData);
            toast.success('Decoração atualizada com sucesso!');
            
            // Recarregar produtos antes de fechar para garantir dados atualizados
            if (onProdutoEditado) {
                await onProdutoEditado();
            }
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
        formData.append("descricao", observacao || "");
        formData.append("valor", valor);
        formData.append("categoria", categoriaFornada || categoria);
        
        // Adicionar todas as novas imagens (apenas as que têm file)
        imagens.forEach(imagem => {
            if (imagem.isNew && imagem.file) {
                formData.append("imagens", imagem.file);
            }
        });

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
                    {/* Imagens */}
                    <div className="w-1/2 flex flex-col items-start gap-4">
                        <div className="w-full">
                            <label className="font-medium mb-2 block">Imagens do Produto</label>
                            
                            {/* Grid de imagens */}
                            {imagens.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    {imagens.map((imagem, index) => (
                                        <div key={index} className="relative border-2 border-[#d6a87c] rounded-md p-2 bg-white group">
                                            <div className="relative w-full h-40 overflow-hidden rounded-md">
                                                <img
                                                    src={imagem.url}
                                                    alt={`Imagem ${index + 1}`}
                                                    className="w-full h-full object-contain"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        removerImagem(index);
                                                    }}
                                                    className="absolute top-1 right-1 text-white rounded-full p-1.5 shadow-lg border-2 border-white z-50 transition-all hover:scale-110 active:scale-95"
                                                    title="Remover imagem"
                                                    aria-label="Remover imagem"
                                                    style={{
                                                        backgroundColor: '#dc2626', // Vermelho vibrante
                                                        width: '28px',
                                                        height: '28px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: '0 2px 8px rgba(220, 38, 38, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.8)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#b91c1c'; // Vermelho mais escuro no hover
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#dc2626'; // Volta ao vermelho original
                                                    }}
                                                >
                                                    <Trash2 size={16} strokeWidth={2.5} fill="currentColor" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-[#d6a87c] rounded-md p-8 flex flex-col items-center justify-center gap-3 bg-white mb-4">
                                    <RiFileTextLine size={80} className="text-goldCard" />
                                    <span className="text-sm text-gray-500">Nenhuma imagem adicionada</span>
                                </div>
                            )}

                            <Button
                                type="button"
                                className="text-sm flex flex-row gap-2 items-center"
                                onClick={exibirImagem}
                            >
                                <Upload size={16} /> {imagens.length > 0 ? 'Adicionar Mais Imagens' : 'Adicionar Imagens'}
                            </Button>
                            <input
                                type="file"
                                ref={imagemRef}
                                accept="image/*"
                                multiple
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

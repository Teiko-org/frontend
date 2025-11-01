import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import Button from "../Button";
import InputOption from "../InputOption";
import { axiosApi } from "../../provider/AxiosApi";

export default function ModalEdicaoProduto({ isOpen, onClose, produto, onProdutoEditado }) {
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(produto?.imagemUrl || null);
    const imagemRef = useRef(null);

    // Campos editáveis
    const [nome, setNome] = useState(produto?.produto || "");
    const [categoria, setCategoria] = useState(produto?.categoria || "");
    const [valor, setValor] = useState(produto?.valor || "");
    const [descricao, setDescricao] = useState(produto?.descricao || "");
    const [quantidade, setQuantidade] = useState(produto?.quantidade || "");
    // Campos específicos de bolo
    const [massa, setMassa] = useState(produto?.massaId || "");
    const [recheioPedido, setRecheioPedido] = useState(produto?.recheioPedidoId || "");
    const [cobertura, setCobertura] = useState(produto?.coberturaId || "");
    const [formato, setFormato] = useState(produto?.formato || "");
    const [tamanho, setTamanho] = useState(produto?.tamanho || "");
    const [decoracao, setDecoracao] = useState(produto?.decoracaoId || "");

    // Listas de opções
    const [massasDisponiveis, setMassasDisponiveis] = useState([]);
    const [recheiosDisponiveis, setRecheiosDisponiveis] = useState([]);
    const [coberturasDisponiveis, setCoberturasDisponiveis] = useState([]);
    const [formatosDisponiveis, setFormatosDisponiveis] = useState([]);
    const [tamanhosDisponiveis, setTamanhosDisponiveis] = useState([]);
    const [decoracoesDisponiveis, setDecoracoesDisponiveis] = useState([]);

    useEffect(() => {
        if (!isOpen) return;
        setNome(produto?.produto || "");
        setCategoria(produto?.categoria || "");
        setValor(produto?.valor || "");
        setDescricao(produto?.descricao || "");
        setQuantidade(produto?.quantidade || "");
        setMassa(produto?.massaId || "");
        setRecheioPedido(produto?.recheioPedidoId || "");
        setCobertura(produto?.coberturaId || "");
        // Corrige aqui: só seta formato se for válido
        setFormato(
            produto?.formato === "CIRCULO" || produto?.formato === "CORACAO"
                ? produto?.formato
                : ""
        );
        setTamanho(produto?.tamanho || "");
        setDecoracao(produto?.decoracaoId || "");
        setFilePreview(produto?.imagemUrl || null);
    }, [isOpen, produto]);

    useEffect(() => {
        if (!isOpen) return;
        // Busca listas de opções
        if (categoria.toLowerCase().includes("carambolo")) {
            axiosApi.get("/bolos/massa").then(res => setMassasDisponiveis(res.data));
            axiosApi.get("/bolos/recheio-exclusivo").then(res => setRecheiosDisponiveis(res.data));
        }
        axiosApi.get("/bolos/cobertura").then(res => setCoberturasDisponiveis(res.data));
        axiosApi.get("/bolos/formatos").then(res => {
            // Filtra apenas os formatos válidos
            const validos = res.data.filter(f => f === "CIRCULO" || f === "CORACAO");
            setFormatosDisponiveis(validos);
        });
        axiosApi.get("/bolos/tamanhos").then(res => setTamanhosDisponiveis(res.data));
        axiosApi.get("/decoracoes").then(res => setDecoracoesDisponiveis(res.data));
    }, [isOpen, categoria]);

    const anexarImagem = (e) => {
        const img = e.target.files[0];
        if (img) {
            setFile(img);
            setFilePreview(URL.createObjectURL(img));
        }
    };
    const exibirImagem = () => imagemRef.current?.click();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (categoria.toLowerCase().includes("fornada")) {
                // Atualiza produto de fornada
                const data = {
                    id: produto.id,
                    produto: nome,
                    descricao,
                    valor: Number(valor),
                    categoria,
                };
                await axiosApi.put(`/fornadas/produto-fornada/${produto.id}`, data, {
                    headers: { "Content-Type": "application/json" }
                });
            } else if (categoria.toLowerCase().includes("carambolo")) {
                // Atualiza decoração antes do bolo
                if (formato !== "CIRCULO" && formato !== "CORACAO") {
                    alert("Selecione um formato válido!");
                    return;
                }
                // Atualiza decoração
                const decoracaoIdToUpdate = produto?.decoracaoId || decoracao;
                let nomeDecoracao = nome;
                if (decoracaoIdToUpdate) {
                    await axiosApi.put(`/decoracoes/${decoracaoIdToUpdate}`, {
                        nome: nome,
                        observacao: descricao
                    }, {
                        headers: { "Content-Type": "application/json" }
                    });
                    // Atualiza o nome da decoração para o payload do bolo
                    nomeDecoracao = nome;
                }
                // Atualiza bolo (carambolo)
                const data = {
                    produto: nomeDecoracao, // <-- Adicione esta linha!
                    recheioPedidoId: recheioPedido ? Number(recheioPedido) : null,
                    massaId: massa ? Number(massa) : null,
                    coberturaId: cobertura ? Number(cobertura) : null,
                    decoracaoId: decoracao ? Number(decoracao) : null,
                    formato: formato || null,
                    tamanho: tamanho || null,
                    categoria,
                };
                await axiosApi.put(`/bolos/${produto.id}`, data, {
                    headers: { "Content-Type": "application/json" }
                });
            } else {
                alert("Categoria inválida! Informe se é Fornada ou Carambolo.");
                return;
            }
            alert("Produto atualizado com sucesso!");
            onProdutoEditado && onProdutoEditado();
            onClose();
        } catch (error) {
            alert("Erro ao atualizar produto!");
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <form onSubmit={handleSubmit} className="bg-[#fbe4d6] rounded-md border border-blue-400 max-w-4xl w-full max-h-[90vh] overflow-auto text-[#5c3c10] shadow-xl">
                <header className="flex justify-between items-center px-6 py-3 border-b border-orange-300 bg-[#fbe4d6]">
                    <h2 className="font-semibold text-lg">Editar Produto</h2>
                    <button type="button" onClick={onClose} className="text-red-600 hover:scale-110 transition-transform">
                        <X size={26} />
                    </button>
                </header>
                <section className="flex justify-center px-8 gap-8 py-4 h-[557px] overflow-y-auto">
                    {/* Inputs */}
                    <div className="w-1/2 text-sm flex flex-col justify-start overflow-y-auto pr-2 gap-4">
                        {/* Campos comuns */}
                        <div className="flex flex-col gap-1">
                            <label className="font-medium">Nome do produto</label>
                            <input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-medium">Categoria</label>
                            <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-medium">Valor</label>
                            <input type="number" step="0.01" value={valor} onChange={e => setValor(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-medium">Descrição</label>
                            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]" />
                        </div>
                        {categoria.toLowerCase().includes("carambolo") && (
                            <>
                                <div className="flex flex-col gap-1">
                                    <label className="font-medium">Massa</label>
                                    <select value={massa} onChange={e => setMassa(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]">
                                        <option value="">Selecione uma massa</option>
                                        {massasDisponiveis.map((m) => (
                                            <option key={m.id} value={m.id}>{m.sabor}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-medium">Recheio</label>
                                    <select value={recheioPedido} onChange={e => setRecheioPedido(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]">
                                        <option value="">Selecione um recheio</option>
                                        {recheiosDisponiveis.map((r) => (
                                            <option key={r.id} value={r.id}>{r.nome}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-medium">Cobertura</label>
                                    <select value={cobertura} onChange={e => setCobertura(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]">
                                        <option value="">Selecione uma cobertura</option>
                                        {coberturasDisponiveis.map((c) => (
                                            <option key={c.id} value={c.id}>{c.descricao}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-medium">Formato</label>
                                    <select value={formato} onChange={e => setFormato(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]">
                                        <option value="">Selecione um formato</option>
                                        {formatosDisponiveis.map((f) => (
                                            <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1).toLowerCase()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-medium">Tamanho</label>
                                    <select value={tamanho} onChange={e => setTamanho(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]">
                                        <option value="">Selecione um tamanho</option>
                                        {tamanhosDisponiveis.map((t) => (
                                            <option key={t.id ?? t.nome ?? t} value={t.id ?? t.nome ?? t}>{(t.nome ?? t.toString()).charAt(0).toUpperCase() + (t.nome ?? t.toString()).slice(1).toLowerCase()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-medium">Decoração</label>
                                    <select value={decoracao} onChange={e => setDecoracao(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]">
                                        <option value="">Selecione uma decoração</option>
                                        {decoracoesDisponiveis.map((d) => (
                                            <option key={d.id} value={d.id}>{d.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                        <Button type="submit" className="w-full">Salvar Alterações</Button>
                    </div>
                </section>
            </form>
        </div>
    );
}

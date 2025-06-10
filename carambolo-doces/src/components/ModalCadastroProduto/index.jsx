import { useState, useRef, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { RiFileTextLine } from "react-icons/ri";
import Button from "../Button";

export default function ModalCadastroProduto() {
    const [isModalOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const imagemRef = useRef(null);

    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("");
    const [preco, setPreco] = useState("");
    const [adicionais, setAdicionais] = useState("");

    const anexarImagem = (event) => {
        const imagemSelecionada = event.target.files[0];

        if (imagemSelecionada) {
            setFile(imagemSelecionada);
            setFilePreview(URL.createObjectURL(imagemSelecionada));
        }
    }

    const exibirImagem = () => {
        if (imagemRef.current) {
            imagemRef.current.click();
        }
    }

    // Função que salva o produto no sessionStorage
    // const cadastrarProduto = (e) => {
    //     e.preventDefault();
    //     const produto = {
    //         nome,
    //         categoria,
    //         preco: parseFloat(preco),
    //          ...(categoria === "Carambolo" && { adicionais }),
    //         imagemPreview: filePreview,
    //     };


    //     // Pega produtos já cadastrados no sessionStorage ou inicia array vazio
    //     const produtosSalvos = JSON.parse(sessionStorage.getItem("produtos")) || [];

    //     // Adiciona o novo produto
    //     produtosSalvos.push(produto);

    //     console.log("Produto cadastrado:", produto);

    //     // Salva de volta no sessionStorage
    //     sessionStorage.setItem("produtos", JSON.stringify(produtosSalvos));

    //     setNome("");
    //     setCategoria("Fornada");
    //     setPreco("");
    //     setAdicionais("");
    //     setFile(null);
    //     setFilePreview(null);

    //     setIsOpen(false);

    //     alert("Produto cadastrado com sucesso!");
    // };

    const cadastrarProduto = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("nome", nome);
        formData.append("categoria", categoria);
        formData.append("preco", preco);
        if (categoria === "Carambolo") {
            formData.append("adicionais", adicionais);
        }
        if (file) {
            formData.append("imagem", file);
        }

        try {
            const response = await fetch("http://localhost:8080/produtos", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                alert("Produto cadastrado com sucesso!");

                setNome("");
                setCategoria("Fornada");
                setPreco("");
                setAdicionais("");
                setFile(null);
                setFilePreview(null);
                setIsOpen(false);
            } else {
                const error = await response.text();
                console.error("Erro ao cadastrar:", error);
                alert("Erro ao cadastrar produto.");
            }
        } catch (error) {
            console.error("Erro de conexão:", error);
            alert("Erro ao conectar com o servidor.");
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

            {
                isModalOpen && (
                    <div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    >
                        <form
                            className="bg-[#fbe4d6] rounded-md border border-blue-400 max-w-3xl w-full max-h-[80vh] overflow-auto text-[#5c3c10] shadow-xl"
                        >
                            {/* Cabeçalho */}
                            <header className="flex justify-between items-center px-6 py-3 border-b border-orange-300 bg-[#fbe4d6]">
                                <h2 className="font-semibold text-lg">Cadastrar Produtos</h2>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="text-red-600 hover:scale-110 transition-transform"
                                    aria-label="Fechar modal"
                                >
                                    <X size={26} />
                                </button>
                            </header>

                            {/* Conteúdo */}
                            <section className=" h-[439px] grid-cols-2 flex items-center justify-center gap-10 px-8">
                                <div className="flex justify-center">
                                    {/* Área de imagem com borda dourada ao redor da imagem e do botão */}
                                    <div className="flex flex-col gap-4 items-center border-[3px]
                                     border-[#d6a87c] rounded-md p-2 px-1 w-60 h-72">
                                        {/* Caixa tracejada */}
                                        <div className="border-2 border-dashed border-[#d6a87c] 
                                rounded-md p-4 flex flex-col items-center justify-center gap-3 bg-white w-52 h-64
                                overflow-hidden">

                                            {filePreview ? (
                                                <img
                                                    src={filePreview}
                                                    alt="Imagem do produto"
                                                    className="w-full h-full object-contain rounded-md"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <RiFileTextLine size={100} className="text-goldCard" />

                                                </div>
                                            )

                                            }
                                        </div>

                                        {/* Botão fora da caixa branca */}
                                        <div>
                                            <Button
                                                type="button"
                                                className="text-sm flex flex-row gap-2 items-center"
                                                onClick={exibirImagem}
                                                aria-label="Adicionar imagem"
                                            >
                                                <Upload size={16} />
                                                Adicionar Imagem
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
                                </div>

                                {/* Inputs do produto */}
                                <div className="space-y-4 text-sm">
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="nome" className="font-medium">Nome produto</label>
                                        <input
                                            id="nome"
                                            type="text"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            placeholder="Insira o nome do produto"
                                            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="categoria" className="font-medium">Categoria</label>
                                        <select
                                            id="categoria"
                                            name="categoria"
                                            onChange={(e) => setCategoria(e.target.value)}

                                            value={categoria}
                                            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                        >
                                            <option value="" disabled>Selecione uma categoria</option>
                                            <option value="Fornada" >Fornada</option>
                                            <option value="Carambolo">Carambolo</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="preco" className="font-medium">Preço</label>
                                            <div className="flex items-center gap-1">
                                                <span className="bg-gray-100 px-2 py-2 rounded-l text-gray-500">R$</span>
                                                <input
                                                    id="preco"
                                                    type="number"
                                                    value={preco}
                                                    onChange={(e) => setPreco(e.target.value)}
                                                    min="0"
                                                    step="0.01"
                                                    className="border border-gray-300 px-2 py-2 rounded-r w-full focus:ring-2 focus:ring-[#d6a87c]"
                                                />
                                            </div>
                                        </div>


                                        <div className="flex flex-col gap-1"
                                            style={{
                                                opacity: categoria === "Carambolo" ? 1 : 0,
                                                pointerEvents: categoria === "Carambolo" ? 'auto' : 'none',
                                                height: 'auto',
                                            }}
                                        >
                                            <label htmlFor="adicionais" className="font-medium">Adicionais</label>
                                            <input
                                                id="adicionais"
                                                type="text"
                                                value={adicionais}
                                                onChange={(e) => setAdicionais(e.target.value)}
                                                placeholder="Ex: Cobertura de chocolate, Granulado, etc."
                                                className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#d6a87c]"
                                            />
                                        </div>


                                    </div>

                                    <Button
                                        text="Cadastrar Produto"
                                        type="submit"
                                        onClick={cadastrarProduto}
                                        className="w-full bg-[#d6a87c] hover:bg-[#c49664] py-2 rounded mt-20"
                                    />
                                </div>
                            </section>
                        </form>
                    </div>
                )
            }


        </>
    );
}

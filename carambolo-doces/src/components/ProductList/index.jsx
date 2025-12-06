import * as React from 'react';
import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { axiosApi } from '../../provider/AxiosApi';
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { BsChatSquareFill } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { ConfirmToast } from 'react-confirm-toast';
import Button from '../Button';
import { CiFilter } from "react-icons/ci";
import ModalFilterProduct from '../ModalFilterProduct';
import ModalEdicaoProduto from '../ModalEdicaoProduto';
import { findAllBolo, findAllFornada, handleDeleteBolo, handleVisibilityBolo, handleVisibilityProdutoFornada } from '../../service/productService';
import { getProdutosCadastrados } from '../../service/dashboardService';
import { getAllDecoracoes } from '../../service/decoracaoService';
import { LuSearch } from "react-icons/lu";

const columns = [
    { id: 'ativo', label: '', minWidth: 50, align: 'left' },
    { id: 'produto', label: 'PRODUTO', minWidth: 100, align: 'left' },
    { id: 'categoria', label: 'CATEGORIA', minWidth: 100, align: 'left' },
    { id: 'preco', label: 'PREÇO', minWidth: 100, align: 'left' },
    { id: 'status', label: 'STATUS', minWidth: 100, align: 'center' },
    { id: 'edit', label: '', minWidth: 100 },
];

export default function ProductList() {
    const [showInfoBalloon, setShowInfoBalloon] = React.useState(false);
    const [balloonPosition, setBalloonPosition] = React.useState({ x: 0, y: 0 });
    const [products, setProducts] = React.useState([]);
    const [updatingMap, setUpdatingMap] = React.useState({});
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isFilterModalOpen, setFilterModalOpen] = React.useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = React.useState(null);
    const [isModalEdicaoOpen, setModalEdicaoOpen] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);

    const fetchProducts = async () => {
        try {
            // Buscar produtos cadastrados (fornadas)
            const produtosCadastrados = await getProdutosCadastrados();
            
            // Mapear fornadas para a estrutura esperada
            const fornadas = (produtosCadastrados || []).map(produto => ({
                tipo: produto.tipo,
                categoria: produto.categoria,
                descricao: produto.descricao || null,
                isAtivo: produto.ativo,
                produto: produto.nome,
                nome: produto.nome,
                id: produto.id,
                valor: produto.preco,
                preco: produto.preco,
                quantidade: produto.quantidade || 0,
                nomeDecoracao: produto.nomeDecoracao || produto.nome,
                categoriaDecoracao: produto.categoriaDecoracao || "",
                observacoesDecoracao: produto.observacoesDecoracao || "",
                observacao: produto.observacao || "",
                imagemUrl: produto.imagemUrl || produto.image || null,
                imagens: produto.imagens || [],
                adicionais: produto.adicionais || [],
                decoracaoId: produto.decoracaoId || produto.id
            }));

            // Buscar decorações
            const decoracoes = await getAllDecoracoes();
            
            // Mapear decorações para a estrutura esperada
            const decoracoesMapeadas = (decoracoes || []).map(decoracao => ({
                tipo: 'DECORACAO',
                categoria: decoracao.categoria || 'Decoração',
                descricao: decoracao.observacao || null,
                isAtivo: true,
                produto: decoracao.nome,
                nome: decoracao.nome,
                id: decoracao.id,
                decoracaoId: decoracao.id,
                valor: 0, // Decorações geralmente não têm preço direto
                preco: 0,
                quantidade: 0,
                nomeDecoracao: decoracao.nome,
                categoriaDecoracao: decoracao.categoria || "",
                observacoesDecoracao: decoracao.observacao || "",
                observacao: decoracao.observacao || "",
                imagemUrl: decoracao.imagens?.[0] || null,
                imagens: decoracao.imagens || [],
                adicionais: decoracao.adicionais || []
            }));

            // Combinar fornadas e decorações
            setProducts([...fornadas, ...decoracoesMapeadas]);
        } catch (error) {
            console.error("Erro ao carregar produtos cadastrados:", error);
            // Fallback para o método antigo se o novo falhar
            try {
                const [bolos, produtosFornada] = await Promise.all([
                    findAllBolo(),
                    findAllFornada(),
                ]);
                setProducts([...(bolos || []), ...(produtosFornada || [])]);
            } catch (fallbackError) {
                console.error("Erro no fallback:", fallbackError);
                setProducts([]);
            }
        }
    };

    React.useEffect(() => {
        fetchProducts();
    }, []);

    const handleVisibility = async (row) => {
        if (!row) return;
        const key = `${row.tipo}-${row.id}`;
        if (updatingMap[key]) return; // evitar cliques repetidos
        setUpdatingMap((prev) => ({ ...prev, [key]: true }));
        const novoStatus = !Boolean(row.isAtivo);
        // otimista
        setProducts((prev) => prev.map(p => (p.id === row.id && p.tipo === row.tipo) ? { ...p, isAtivo: novoStatus } : p));

        const tipo = (row.tipo || '').toUpperCase();
        const ok = tipo === 'BOLO'
            ? await handleVisibilityBolo(row.id, novoStatus)
            : await handleVisibilityProdutoFornada(row.id, novoStatus);

        if (!ok) {
            setProducts((prev) => prev.map(p => (p.id === row.id && p.tipo === row.tipo) ? { ...p, isAtivo: !novoStatus } : p));
        } else {
            try {
                window.dispatchEvent(new CustomEvent('carambolo:visibility-changed', {
                    detail: { tipo, id: row.id, isAtivo: novoStatus }
                }));
            } catch {}
            fetchProducts();
        }
        setUpdatingMap((prev) => { const next = { ...prev }; delete next[key]; return next; });
    }

    const filteredProducts = products.filter(product => {
        const categoryFilter = localStorage.getItem('CATEGORY');
        const priceDe = parseFloat(localStorage.getItem('PRICE_DE')) || 0;
        const priceAte = parseFloat(localStorage.getItem('PRICE_ATE')) || Infinity;
        const qtdDe = parseInt(localStorage.getItem('QTD_DE')) || 0;
        const qtdAte = parseInt(localStorage.getItem('QTD_ATE')) || Infinity;
        const statusFilter = localStorage.getItem('STATUS');

        const categoryToSearch = (product.categoria ?? '').toLowerCase();

        const matchCategory = !categoryFilter || categoryFilter === '--' || product.categoria === categoryFilter;
        const matchPrice = product.valor >= priceDe && product.valor <= priceAte;
        const matchQuantity = product.quantidade >= qtdDe && product.quantidade <= qtdAte;
        const isBolo = (product.tipo || '').toUpperCase() === 'BOLO';
        const isFornada = !isBolo;

        let matchStatus = true;

        if (statusFilter === 'avaliable') {
            matchStatus = isBolo || (isFornada && product.quantidade > 0);
        } else if (statusFilter === 'unavaliable') {
            matchStatus = isBolo || (isFornada && product.quantidade <= 0);
        }

        const matchSearch = (product.produto ?? '').toLowerCase().includes(searchTerm.toLowerCase());

        return matchCategory && matchPrice && matchQuantity && matchStatus && matchSearch;
    });

    const formatCurrency = (value) => {
        return `R$ ${value?.toFixed(2).replace('.', ',') || '0,00'}`;
    };

    const determineInitialCategory = (row) => {
        if (!row) return '';
        const tipo = (row.tipo || '').toLowerCase();
        const categoria = (row.categoria || '').toLowerCase();
        
        // Se é decoração
        if (tipo.includes('decoracao')) return 'Decoracao';
        
        // Se é fornada
        if (categoria.includes('fornada') || tipo.includes('fornada')) return 'Fornada';
        
        // Se é bolo/carambolo
        if (categoria.includes('carambolo') || tipo.includes('carambolo') || tipo.includes('bolo')) return 'Decoracao';
        
        // fallback: if produto looks like a fornada by quantity
        if (typeof row.quantidade === 'number' && row.quantidade > 0) return 'Fornada';
        
        return categoria ? categoria.charAt(0).toUpperCase() + categoria.slice(1) : 'Decoracao';
    }

    return (
        <div className='flex flex-col w-[100%] h-[70%]'>
            <div className='flex flex-row justify-between items-center bg-gradient-blue h-[4.6875rem] w-full'>
                <h1 className='bg-gradient-gold text-transparent bg-clip-text pl-[5%] text-[1.5rem] font-bold'>Listagem de produtos</h1>
                <div className='flex flex-1 flex-row items-center justify-end pr-[5%]'>
                    <div className="relative flex items-center w-[250px] mr-2">
                        <input
                            type="text"
                            placeholder="Procurar produto"
                            className="h-[38px] w-full pl-2 pr-10 rounded-lg border border-gold focus:outline-none focus:border-blue transition-all duration-300 ease-in-out"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <LuSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-[1.625rem] text-[#A47032] pointer-events-none" />
                    </div>
                    <Button
                        text={'FILTRAR'}
                        children={<CiFilter className='text-[1.625rem]'/>}
                        onClick={() => setFilterModalOpen(true)}
                        className='flex flex-row items-center'
                    />
                    {isFilterModalOpen && (
                        <ModalFilterProduct products={products} setFilterModalOpen={setFilterModalOpen} onClose={() => setFilterModalOpen(false)} />
                    )}
                </div>
            </div>
            <Paper sx={{ width: '100%', maxHeight: '100%', overflow: 'hidden', border: 'none', boxShadow: 'none' }} >
                <TableContainer sx={{ maxHeight: 440 }} className='bg-[#FFE7DD]'>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        className={column.id === 'ativo' ? 'rounded-l-full' : undefined}
                                        style={{ minWidth: column.minWidth, height: '50px' }}
                                        sx={{
                                            backgroundColor: "#FFE7DD",
                                            fontWeight: "bold",
                                            boxShadow: "none",
                                            borderBottom: "none",
                                            padding: 0,
                                            ...(column.id === 'ativo' ? { paddingLeft: '1.25rem' } : { paddingTop: '0.5rem', paddingBottom: '0.5rem' })
                                        }}
                                    >
                                        {column.id === 'ativo' ? (
                                            <span
                                                style={{ display: 'inline-flex', alignItems: 'center' }}
                                                onMouseEnter={e => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    setBalloonPosition({
                                                        x: rect.left + rect.width / 2,
                                                        y: rect.top
                                                    });
                                                    setShowInfoBalloon(true);
                                                }}
                                                onMouseLeave={() => setShowInfoBalloon(false)}
                                            >
                                                <HiOutlineInformationCircle className="text-[#A47032] text-[1.625rem] cursor-pointer" />
                                            </span>
                                        ) : (
                                            column.label
                                        )}
                                        {column.id === 'ativo' && showInfoBalloon && ReactDOM.createPortal(
                                            <div
                                                style={{
                                                    position: 'fixed',
                                                    left: balloonPosition.x,
                                                    top: balloonPosition.y - 16,
                                                    transform: 'translate(-50%, -100%)',
                                                    zIndex: 99999,
                                                    pointerEvents: 'none',
                                                }}
                                            >
                                                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <div
                                                        style={{
                                                            background: 'white',
                                                            color: '#A47032',
                                                            borderRadius: 8,
                                                            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)',
                                                            padding: '18px 22px',
                                                            minWidth: 320,
                                                            maxWidth: 400,
                                                            textAlign: 'center',
                                                            fontSize: 15,
                                                            fontWeight: 500,
                                                            lineHeight: 1.4,
                                                        }}
                                                    >
                                                        Não quer disponibilizar um produto por agora? <br />Clique no olhinho para ocultar os produtos na página inicial sem precisar excluir.
                                                    </div>
                                                    <div
                                                        style={{
                                                            width: 0,
                                                            height: 0,
                                                            borderLeft: '14px solid transparent',
                                                            borderRight: '14px solid transparent',
                                                            borderTop: '16px solid white',
                                                            margin: '0 auto',
                                                            position: 'relative',
                                                            top: '-1px',
                                                            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.10))',
                                                        }}
                                                    />
                                                </div>
                                            </div>,
                                            document.body
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProducts.map((row, index) => (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={`${(row.tipo || 'PROD')}-${row.id}-${index}`}
                                    className={`${index % 2 === 0 ? 'bg-[#FFE7DD]' : ' bg-[#FFEEE7]'} h-10`}
                                    sx={{ boxShadow: "none", borderBottom: "none" }}
                                >
                                    {columns.map((column) => {
                                        if (column.id === 'ativo') {
                                            return (
                                                <TableCell key={column.id} align={column.align} className='rounded-l-full' sx={{ boxShadow: "none", borderBottom: "none", padding: 0, paddingLeft: '1.25rem' }}>
                                                    {row.isAtivo
                                                        ? <LuEye className={`w-5 cursor-pointer text-[#A47032] text-[1.625rem] ${updatingMap[`${row.tipo}-${row.id}`] ? 'opacity-50 pointer-events-none' : ''}`} onClick={() => handleVisibility(row)} />
                                                        : <LuEyeClosed className={`w-5 cursor-pointer text-[#A47032] text-[1.625rem] ${updatingMap[`${row.tipo}-${row.id}`] ? 'opacity-50 pointer-events-none' : ''}`} onClick={() => handleVisibility(row)} />}
                                                </TableCell>
                                            );
                                        }

                                        if (column.id === 'produto') {
                                            return (
                                                <TableCell key={column.id} align={column.align} sx={{ boxShadow: "none", borderBottom: "none", padding: 0 }}>
                                                    {row.produto}
                                                </TableCell>
                                            )
                                        }

                                        if (column.id === 'categoria') {
                                            return (
                                                <TableCell key={column.id} align={column.align} sx={{ boxShadow: "none", borderBottom: "none", padding: 0 }}>
                                                    {row.categoria}
                                                </TableCell>
                                            )
                                        }

                                        if (column.id === 'preco') {
                                            return (
                                                <TableCell key={column.id} align={column.align} sx={{ boxShadow: "none", borderBottom: "none", padding: 0 }}>
                                                    {formatCurrency(row.valor)}
                                                </TableCell>
                                            )
                                        }

                                        if (column.id === 'status') {
                                            const isBolo = (row.tipo || '').toUpperCase() === 'BOLO';
                                            const isFornada = !isBolo;
                                            
                                            let statusText = '';
                                            if (isBolo) {
                                                statusText = 'Disponível';
                                            } else if (isFornada) {
                                                statusText = row.quantidade > 0 ? 'Disponível' : 'Esgotado';
                                            }

                                            return (
                                                <TableCell key={column.id} align={column.align} sx={{ boxShadow: "none", borderBottom: "none", padding: 0 }}>
                                                    {statusText}
                                                </TableCell>
                                            )
                                        }

                                        if (column.id === 'edit') {
                                            return (
                                                <TableCell key={column.id} align={column.align} className="rounded-r-full" sx={{ boxShadow: "none", borderBottom: "none", padding: 0, paddingRight: '1.25rem' }}>
                                                    <FaRegEdit
                                                        className='cursor-pointer text-[#A47032] text-[1.625rem]'
                                                        onClick={() => {
                                                            setProdutoSelecionado(row);
                                                            setModalEdicaoOpen(true);
                                                        }}
                                                    />
                                                </TableCell>
                                            )
                                        }

                                        return null;
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {showConfirm && (
                <ConfirmToast
                    asModal={true}
                    customFunction={() => setShowConfirm(false)}
                    setShowConfirmToast={setShowConfirm}
                    message="Tem certeza que deseja excluir este produto?"
                    theme="light"
                    position="top-center"
                />
            )}

            {isModalEdicaoOpen && (
                <ModalEdicaoProduto
                    isOpen={isModalEdicaoOpen}
                    produto={produtoSelecionado}
                    initialCategoria={determineInitialCategory(produtoSelecionado)}
                    onProdutoEditado={fetchProducts}
                    onClose={() => {
                        setModalEdicaoOpen(false);
                        setProdutoSelecionado(null);
                        fetchProducts();
                    }}
                />
            )}
        </div>
    );
}

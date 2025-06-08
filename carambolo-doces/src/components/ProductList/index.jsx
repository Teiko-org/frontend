import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { axiosApi } from '../../provider/AxiosApi';
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { ConfirmToast } from 'react-confirm-toast';
import Button from '../Button';
import { CiFilter } from "react-icons/ci";
import ModalFilterProduct from '../ModalFilterProduct';
import { findAllBolo, findAllFornada, handleDeleteBolo, handleVisibilityBolo, handleVisibilityProdutoFornada } from '../../service/productService';
import { LuSearch } from "react-icons/lu";

const columns = [
    { id: 'ativo', label: '', minWidth: 50, align: 'left' },
    { id: 'produto', label: 'PRODUTO', minWidth: 100, align: 'left' },
    { id: 'categoria', label: 'CATEGORIA', minWidth: 100, align: 'left' },
    { id: 'preco', label: 'PREÇO', minWidth: 100, align: 'left' },
    { id: 'quantidade', label: 'QUANTIDADE', minWidth: 100, align: 'left' },
    { id: 'status', label: 'STATUS', minWidth: 100, align: 'center' },
    { id: 'edit', label: '', minWidth: 100 },

    // LÓGICA PARA DELEÇÃO DE PRODUTOS - TODO -> ADD LIXEIRA
    // { id: 'delete', label: '', minWidth: 100 },
];

export default function ProductList() {
    const [products, setProducts] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isFilterModalOpen, setFilterModalOpen] = React.useState(false);

    // LÓGICA PARA DELEÇÃO DE PRODUTOS - TODO -> ADD LIXEIRA
    // const [idToDelete, setIdToDelete] = React.useState(null);
    // const [categoryToDelete, setCategoryToDelete] = React.useState("")

    const [showConfirm, setShowConfirm] = React.useState(false);

    React.useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            console.log('Buscando produtos...');
            const fornadas = await findAllFornada();
            const bolos = await findAllBolo();
            console.log('Bolos retornados:', bolos);

            const responseProducts = [...(fornadas || []), ...(bolos || [])];
            setProducts(responseProducts);
        } catch (error) {
            console.log(error);
        }
    }

    //LÓGICA PARA DELEÇÃO DE PRODUTOS - TODO -> ADD LIXEIRA
    const handleDeleteRow = async (id) => {
        if (categoryToDelete.toLowerCase().includes("carambolo")) {
            handleDeleteBolo(id);
        }
        await getData();
        setShowConfirm(false);
        setIdToDelete(null);
    }

    const handleVisibility = (id, category) => {
        const productToChange = products.filter((product) => product.id == id && product.categoria == category);

        if (productToChange[0].isAtivo == true) {
            productToChange[0].isAtivo = false
        } else {
            productToChange[0].isAtivo = true
        }

        if (productToChange[0].categoria.toLowerCase().includes("carambolo")) {
            handleVisibilityBolo(productToChange, id);
        } else {
            handleVisibilityProdutoFornada(productToChange, id)
        }
        getData();
    }

    const filteredProducts = products.filter(product => {
        console.log(product);
        const categoryFilter = localStorage.getItem('CATEGORY');
        const priceDe = parseFloat(localStorage.getItem('PRICE_DE')) || 0;
        const priceAte = parseFloat(localStorage.getItem('PRICE_ATE')) || Infinity;
        const qtdDe = parseInt(localStorage.getItem('QTD_DE')) || 0;
        const qtdAte = parseInt(localStorage.getItem('QTD_ATE')) || Infinity;
        const statusFilter = localStorage.getItem('STATUS');

        const categoryToSearch = product.categoria?.toLowerCase?.() || '';

        const matchCategory = !categoryFilter || categoryFilter === '--' || product.categoria === categoryFilter;
        const matchPrice = product.valor >= priceDe && product.valor <= priceAte;
        const matchQuantity = product.quantidade >= qtdDe && product.quantidade <= qtdAte;
        const isFornada = categoryToSearch.includes('fornada');
        const isBolo = !isFornada;

        let matchStatus = true;

        if (statusFilter === 'avaliable') {
            matchStatus = isBolo || (isFornada && product.quantidade > 0);
        } else if (statusFilter === 'unavaliable') {
            matchStatus = isBolo || (isFornada && product.quantidade <= 0);
        }

        const matchSearch = product.produto.toLowerCase().includes(searchTerm.toLowerCase());

        return matchCategory && matchPrice && matchQuantity && matchStatus && matchSearch;
    });

    return (
        <div className='flex flex-col w-[100%] h-[70%]'>
            <div className='flex flex-row justify-between items-center bg-gradient-blue h-[4.6875rem] w-full'>
                <h1 className='bg-gradient-gold text-transparent bg-clip-text pl-[5%] text-[1.5rem] font-bold'>Listagem de produtos</h1>
                <div className='pr-[5%] w-[45%] flex flex-row justify-between'>
                    <div className='h-[100%] w-[60%] flex relative'>
                        <input
                            type="text"
                            placeholder='Procurar por produto'
                            className='h-[38px] w-[100%] pl-2 rounded-lg'
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    <LuSearch className='absolute left-[90%] top-1.5 text-[1.625rem] text-[#A47032]'/>
                    </div>
                    <Button text={'FILTRAR'} children={<CiFilter className='text-[1.625rem]'/>} onClick={() => setFilterModalOpen(true)} className='flex flex-row items-center' />
                    {
                        isFilterModalOpen && (
                            <ModalFilterProduct products={products} setFilterModalOpen={setFilterModalOpen} onClose={() => setFilterModalOpen(false)} />
                        )
                    }
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
                                        style={{ minWidth: column.minWidth, height: '50px' }}
                                        sx={{ backgroundColor: "transparent", fontWeight: "bold", boxShadow: "none", borderBottom: "none", paddingTop: "0.5rem", paddingBottom: "0.5rem", padding: 0}}
                                    >
                                        {column.label}
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
                                    key={`${row.id}-${row.categoria}`}
                                    className={`${index % 2 === 0 ? 'bg-[#FFE7DD]' : ' bg-[#FFEEE7]'} h-10`}
                                    sx={{ boxShadow: "none", borderBottom: "none" }}
                                >
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        if (column.id === 'ativo') {
                                            return (
                                                <TableCell key={column.id} align={column.align} className='rounded-l-full' sx={{ boxShadow: "none", borderBottom: "none", padding: 0, paddingLeft: '1.25rem' }}>
                                                    {row.isAtivo
                                                        ? <LuEye className='w-5 cursor-pointer text-[#A47032] text-[1.625rem]' onClick={() => handleVisibility(row.id, row.categoria)} />
                                                        : <LuEyeClosed className='w-5 cursor-pointer text-[#A47032] text-[1.625rem]' onClick={() => handleVisibility(row.id, row.categoria)} />}
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

                                        if (column.id == 'preco') {
                                            return (
                                                <TableCell key={column.id} align={column.align} sx={{ boxShadow: "none", borderBottom: "none", padding: 0 }}>
                                                    <span>{"R$: " + row.valor.toFixed(2)}</span>
                                                </TableCell>
                                            )
                                        }

                                        if (column.id === 'quantidade') {
                                            if (row.categoria.includes("carambolo")) {
                                                return <TableCell key={column.id} align={column.align} sx={{ boxShadow: "none", borderBottom: "none", padding: 0 }}>-</TableCell>;
                                            } else {
                                                return <TableCell key={column.id} align={column.align} sx={{ boxShadow: "none", borderBottom: "none", padding: 0 }}>{row.quantidade}</TableCell>
                                            }
                                        }

                                        if (column.id === 'status') {
                                            if (row.categoria.includes("carambolo")) {
                                                return <TableCell key={column.id} align={column.align} sx={{ boxShadow: "none", borderBottom: "none", padding: 0 }}>-</TableCell>;
                                            }

                                            return (
                                                <TableCell key={column.id} align={column.align} sx={{ boxShadow: "none", borderBottom: "none", padding: 0 }}>
                                                    <div className='flex flex-row justify-center items-center gap-2'>
                                                        <div className={`rounded-full min-w-2 min-h-2 ${row.quantidade <= 0 ? 'bg-[#D70000]' : 'bg-[#00AF2F]'}`} />
                                                        <span>{row.quantidade <= 0 ? 'Indisponível' : 'Disponível'}</span>
                                                    </div>
                                                </TableCell>
                                            );
                                        }

                                        if (column.id === 'edit') {
                                            return (
                                                <TableCell key={column.id} align={column.align} className='rounded-e-full items-center' sx={{ boxShadow: "none", borderBottom: "none", padding: 0, paddingRight: '1.25rem' }}>
                                                    <div className='flex justify-end'>
                                                        <FaRegEdit className='text-[#A47032] text-[1.625rem]' />
                                                    </div>
                                                </TableCell>
                                            );
                                        }

                                        // LÓGICA PARA DELEÇÃO DE PRODUTOS - TODO -> ADD LIXEIRA
                                        // if (column.id === 'delete') {
                                        //     return (
                                        //         <TableCell key={column.id} align={column.align} style={{ borderLeft: '.0625rem solid black' }} className='rounded-e-full'>
                                        //             <div className='flex justify-left'>
                                        //                 <RiDeleteBinLine
                                        //                     onClick={() => {
                                        //                         setIdToDelete(row.id);
                                        //                         setCategoryToDelete(row.categoria);
                                        //                         setShowConfirm(true);
                                        //                     }}
                                        //                     className='cursor-pointer'
                                        //                 />
                                        //             </div>
                                        //         </TableCell>
                                        //     );
                                        // }

                                    })}

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* LÓGICA PARA DELEÇÃO DE PRODUTOS - TODO -> ADD LIXEIRA */}
            {/* {showConfirm && (
                <ConfirmToast
                    buttonNoText='Não'
                    buttonYesText='Sim'
                    customFunction={() => handleDeleteRow(idToDelete)}
                    setShowConfirmToast={setShowConfirm}
                    showConfirmToast={showConfirm}
                    theme='light'
                    toastText='Deseja excluir o produto selecionado?'
                    className='z-10'
                />
            )} */}
        </div>
    );
}

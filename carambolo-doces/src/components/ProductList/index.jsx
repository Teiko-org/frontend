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

const columns = [
    { id: 'ativo', label: '', minWidth: 50, align: 'left' },
    { id: 'produto', label: 'PRODUTO', minWidth: 100, align: 'left' },
    { id: 'categoria', label: 'CATEGORIA', minWidth: 100, align: 'left' },
    { id: 'preco', label: 'PREÇO', minWidth: 100, align: 'left' },
    { id: 'quantidade', label: 'QUANTIDADE', minWidth: 100, align: 'left' },
    { id: 'status', label: 'STATUS', minWidth: 100, align: 'center' },
    { id: 'edit', label: '', minWidth: 100 },
    { id: 'delete', label: '', minWidth: 100 },
];

export default function ProductList() {
    const [products, setProducts] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isFilterModalOpen, setFilterModalOpen] = React.useState(false);
    const [idToDelete, setIdToDelete] = React.useState(null);
    const [showConfirm, setShowConfirm] = React.useState(false);

    React.useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const response = await axiosApi.get("/produtos");
        setProducts(response.data);
    };

    const handleDeleteRow = async (id) => {
        await axiosApi.delete(`/produtos/${id}`);
        await getData();
        setShowConfirm(false);
        setIdToDelete(null);
    };

    const handleVisibility = (id) => {
        axiosApi.get(`/produtos/${id}`).then((response) => {
            const updated = { ...response.data, status: !response.data.status };
            axiosApi.patch(`/produtos/${id}`, updated).then(() => getData());
        });
    };

    const filteredProducts = products.filter(product =>
        product.produto.toLowerCase().includes(searchTerm.toLowerCase()) &&
        product.categoria.toLowerCase() == localStorage.getItem('CATEGORY') &&
        product.preco >= localStorage.getItem('PRICE_DE') &&
        product.preco <= localStorage.getItem('PRICE_ATE') &&
        product.quantidade >= localStorage.getItem('QTD_DE') &&
        product.quantidade <= localStorage.getItem('QTD_ATE') &&
        product.status == localStorage.getItem('STATUS')
    );

    return (
        <div className='flex flex-col w-[100%] h-[70%]'>
            <div className='flex flex-row justify-between items-center bg-gradient-blue h-[4.6875rem] w-full'>
                <h1 className='bg-gradient-gold text-transparent bg-clip-text pl-[5%] text-[1.5rem]'>Listagem de produtos</h1>
                <div className='pr-[5%] w-[45%] flex flex-row justify-between'>
                    <div className='h-[100%] w-[60%]'>
                        <input
                            type="text"
                            placeholder='Procurar por produto'
                            className='h-[38px] w-[100%] pl-2 rounded-lg'
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button text={'FILTRAR'} icon={<CiFilter />} onClick={() => setFilterModalOpen(true)} />
                    {isFilterModalOpen && (
                        <ModalFilterProduct products={products} onClose={() => setFilterModalOpen(false)} />
                    )}
                </div>
            </div>

            <Paper sx={{ width: '100%', maxHeight: '100%', overflow: 'hidden', border: 'none', boxShadow: 'none' }} >
                <TableContainer sx={{ maxHeight: 440 }} className='bg-bgNativeHome'>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
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
                                    key={row.id}
                                    className={`${index % 2 === 0 ? 'bg-[#FFEEE7]' : 'bg-[#FFE7DD]'}`}
                                >
                                    {columns.map((column) => {
                                        const value = row[column.id];

                                        if (column.id === 'ativo') {
                                            return (
                                                <TableCell key={column.id} align={column.align} className='rounded-l-full'>
                                                    {row.status
                                                        ? <LuEye className='w-5 cursor-pointer' onClick={() => handleVisibility(row.id)} />
                                                        : <LuEyeClosed className='w-5 cursor-pointer' onClick={() => handleVisibility(row.id)} />}
                                                </TableCell>
                                            );
                                        }

                                        if (column.id === 'quantidade') {
                                            if (row.categoria.includes("carambolo")) {
                                                return <TableCell key={column.id} align={column.align}>-</TableCell>;
                                            }
                                        }

                                        if (column.id === 'status') {
                                            if (row.categoria.includes("carambolo")) {
                                                return <TableCell key={column.id} align={column.align}>-</TableCell>;
                                            }
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    <div className='flex flex-row justify-center items-center gap-2'>
                                                        <div className={`rounded-full min-w-2 min-h-2 ${row.quantidade <= 0 ? 'bg-[#D70000]' : 'bg-[#00AF2F]'}`} />
                                                        <span>{row.quantidade <= 0 ? 'Indisponível' : 'Disponível'}</span>
                                                    </div>
                                                </TableCell>
                                            );
                                        }

                                        if (column.id === 'edit') {
                                            return (
                                                <TableCell key={column.id} align={column.align} style={{ borderRight: '.0625rem solid black' }}>
                                                    <div className='flex justify-end'>
                                                        <FaRegEdit />
                                                    </div>
                                                </TableCell>
                                            );
                                        }

                                        if (column.id === 'delete') {
                                            return (
                                                <TableCell key={column.id} align={column.align} style={{ borderLeft: '.0625rem solid black' }} className='rounded-e-full'>
                                                    <div className='flex justify-left'>
                                                        <RiDeleteBinLine
                                                            onClick={() => {
                                                                setIdToDelete(row.id);
                                                                setShowConfirm(true);
                                                            }}
                                                            className='cursor-pointer'
                                                        />
                                                    </div>
                                                </TableCell>
                                            );
                                        }

                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number'
                                                    ? column.format(value)
                                                    : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {showConfirm && (
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
            )}
        </div>
    );
}

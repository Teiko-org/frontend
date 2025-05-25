import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { axiosApi } from '../../provider/AxiosApi';
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { ConfirmToast } from 'react-confirm-toast'
import Button from '../Button';
import { CiFilter } from "react-icons/ci";

const columns = [
    {
        id: 'ativo',
        label: '',
        minWidth: 50,
        align: 'left',
    },
    {
        id: 'produto',
        label: 'PRODUTO',
        minWidth: 100,
        align: 'left'
    },
    {
        id: 'categoria',
        label: 'CATEGORIA',
        minWidth: 100,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'preco',
        label: 'PREÇO',
        minWidth: 100,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'quantidade',
        label: 'QUANTIDADE',
        minWidth: 100,
        align: 'left',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'status',
        label: 'STATUS',
        minWidth: 100,
        align: 'center'
    },
    {
        id: 'edit',
        label: '',
        minWidth: 100,
    },
    {
        id: 'delete',
        label: '',
        minWidth: 100,

    }
];

export default function ProductList() {
    const [products, setProducts] = React.useState([]);
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        getData();
    }, []);

    React.useEffect(() => {
        getData();
    }, [products]);

    const getData = () => {
        axiosApi.get("/produtos")
            .then((response) => {
                setProducts(response.data)
            })
    }

    const handleToast = (id) => {
        setShow(true);
        handleDeleteRow(id);
    }

    const handleDeleteRow = (id) => {
        console.log(id)
        axiosApi.delete(`/produtos/${id}`)
            .then((response) => {
                getData();
            });
    }

    const handleVisibility = (id) => {
        axiosApi.get(`/produtos/${id}`)
            .then((response) => {
                switch (response.data.status) {
                    case true:
                        response.data.status = false;
                        break;
                    case false:
                        response.data.status = true;
                        break
                }

                axiosApi.patch(`/produtos/${id}`, response.data)
                getData();
            })
    }

    return (
        <div className='flex flex-col w-[80%] h-full'>
            <div className='flex flex-row justify-between items-center bg-gradient-blue h-[4.6875rem] w-full'>
                <h1 className='bg-gradient-gold text-transparent bg-clip-text pl-[5%]'>Listagem de produtos</h1>
                <div className='pr-[5%] w-[45%] flex flex-row justify-between'>
                    <input type="text" placeholder='Procurar por produto' className='h-[60%]' />
                    <Button text={'FILTRAR'} icon={<CiFilter />}/>
                </div>
            </div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }} >
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
                            {products
                                .map((row, index) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id} className={index % 2 === 0 ? 'bg-[#FFEEE7]' : 'bg-[#FFE7DD]'}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                if (column.id == 'ativo') {
                                                    if (row.status == true) {
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                <LuEye className='w-5' onClick={() => handleVisibility(row.id)} />
                                                            </ TableCell>
                                                        )
                                                    } else {
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                <LuEyeClosed className='w-5' onClick={() => handleVisibility(row.id)} />
                                                            </ TableCell>
                                                        )
                                                    }
                                                }
                                                if (column.id == 'quantidade') {
                                                    if (row.categoria.includes("carambolo")) {
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                <div className='flex'>
                                                                    -
                                                                </div>
                                                            </ TableCell>
                                                        );
                                                    }
                                                }
                                                if (column.id == 'status') {
                                                    if (row.categoria.includes("carambolo")) {
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                <div className='flex flex-row justify-center'>
                                                                    -
                                                                </div>
                                                            </ TableCell>
                                                        );
                                                    }
                                                    if (row.quantidade <= 0) {
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                <div className='flex flex-row'>
                                                                    <div className='rounded-full bg-[#D70000] min-w-5 min-h-2' />
                                                                    <span>Indisponível</span>
                                                                </div>
                                                            </ TableCell>
                                                        );
                                                    } else {
                                                        return (
                                                            <TableCell key={column.id} align={column.align} className='flex flex-col'>
                                                                <div className='flex flex-row'>
                                                                    <div className='rounded-full bg-[#00AF2F] min-w-5 min-h-2' />
                                                                    <span>Disponível</span>
                                                                </div>
                                                            </ TableCell>
                                                        );
                                                    }
                                                }
                                                if (column.id == 'edit') {
                                                    return (
                                                        <TableCell key={column.id} align={column.align} style={{ borderRight: '.0625rem solid black' }}>
                                                            <div className='flex justify-end'>
                                                                <FaRegEdit />
                                                            </div>
                                                        </ TableCell>
                                                    )
                                                }
                                                if (column.id == 'delete') {
                                                    return (
                                                        <TableCell key={column.id} align={column.align} style={{ borderLeft: '.0625rem solid black' }}>
                                                            <div className='flex justify-left'>
                                                                <ConfirmToast
                                                                    buttonNoText='Não'
                                                                    buttonYesText='Sim'
                                                                    customFunction={() => handleToast(row.id)}
                                                                    setShowConfirmToast={setShow}
                                                                    showConfirmToast={show}
                                                                    theme='light'
                                                                    toastText='Deseja excluir o produto selecionado?'
                                                                />
                                                                <RiDeleteBinLine onClick={setShow} />
                                                            </div>
                                                        </ TableCell>
                                                    )
                                                }
                                                return (
                                                    <TableCell key={column.id} align={column.align} >
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>

    );
}

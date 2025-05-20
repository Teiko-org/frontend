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
import { LuEye } from "react-icons/lu";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";

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
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleVisibility = (event) => {
        
    }

    React.useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axiosApi.get("/produtos")
            .then((response) => {
                setProducts(response.data)
            })
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
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
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            if (column.id == 'ativo') {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        <LuEye className='w-5' onClick={(e) => {handleVisibility(e.target)}}/>
                                                    </ TableCell>
                                                )
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
                                                    <TableCell key={column.id} align={column.align} style={{ borderRight: '1px solid black' }}>
                                                        <FaRegEdit />
                                                    </ TableCell>
                                                )
                                            }
                                            if (column.id == 'delete') {
                                                return (
                                                    <TableCell key={column.id} align={column.align} style={{ borderLeft: '1px solid black' }}>
                                                        <RiDeleteBinLine />
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
    );
}
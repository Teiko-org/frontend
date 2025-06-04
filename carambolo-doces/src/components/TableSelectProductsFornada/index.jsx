import { CiSearch } from "react-icons/ci";
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

// Sorting & selecting
const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 90,
    },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const paginationModel = { page: 0, pageSize: 5 };

function TableSelectProductsFornada(props) {

    return (
        <div
            className={`flex flex-col w-[1000px] h-[400px] border-2 border-gold rounded-2xl bg-bgNativeHome`}>

            <header className="flex items-center w-full justify-between bg-gradient-blue p-5 border-b-2 border-gold rounded-t-2xl">
                <h1 className="text-gold font-bold text-xl">Selecionar Produtos</h1>
                <div className="flex items-center h-9 w-80 bg-white rounded-xl p-2 px-4">
                    <input type="text" placeholder="Procurar produto" className="w-full h-auto" />
                    <button>
                        <CiSearch className="text-gold size-7" />
                    </button>
                </div>
            </header>

            <Paper sx={{ height: 300, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    sx={{ border: 0 }}
                />  
            </Paper>

        </div>
    );
}

export default TableSelectProductsFornada;
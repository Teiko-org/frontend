import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { productsThisFornadasService } from "../../service/productsFornadasService";

const columns = [
    { id: "produto", label: "PRODUTO", minWidth: 150, align: "left" },
    { id: "categoria", label: "CATEGORIA", minWidth: 50, align: "left" },
    { id: "valor", label: "PREÇO", minWidth: 50, align: "left" },
    { id: "quantidade", label: "QUANTIDADE", minWidth: 50, align: "left" },
];

export default function TableProductsThisFornada(props) {

    const [products, setProducts] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState(props.searchTerm || "");

    const getData = async () => {
        try {
            const response = await productsThisFornadasService(props.idFornada);
            console.log(response);

            setProducts(Array.isArray(response) ? response : []);
        } catch (error) {
            console.log(error);

            setProducts([]);
        }
    };

    React.useEffect(() => {
        getData();
    }, [props.idFornada]);

    React.useEffect(() => {
        setSearchTerm(props.searchTerm || "");
    }, [props.searchTerm]);

    // Filtrar produtos baseado no termo de busca
    const filteredProducts = (products || []).filter((product) => {
        if (!searchTerm) return true;
        
        const searchLower = searchTerm.toLowerCase();
        const matchProduct = product.produto
            .toLowerCase()
            .includes(searchLower);
        const matchCategory = product.categoria
            .toLowerCase()
            .includes(searchLower);

        return matchProduct || matchCategory;
    });

    return (
        <div className="flex flex-col w-[90%] h-[320px]">

            <div className="flex-1 overflow-hidden">
                <Paper
                    className="rounded-lg h-full"
                    sx={{
                        width: "100%",
                        height: "100%",
                        border: "2px solid #A47032",
                        borderRadius: "1rem",
                        borderTopLeftRadius: props.roundedTop ? "1rem" : 0,
                        borderTopRightRadius: props.roundedTop ? "1rem" : 0,
                        // overflow: "hidden",
                        boxShadow: "none",
                    }}
                >
                    <TableContainer
                        sx={{
                            height: "100%",
                            maxHeight: "100%",
                            overflow: "auto",
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: '#f1f1f1',
                                borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#C8A882',
                                borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                background: '#B8956F',
                            },
                        }}
                        className={`bg-bgHome p-2 rounded-2xl ${props.roundedTop ? "rounded-t-2xl" : "rounded-t-none"}`}
                    >
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                            sx={{
                                                backgroundColor: "#FFE7DD",
                                                fontWeight: "bold",
                                                boxShadow: "none",
                                                borderBottom: "1px solid #C8A882",
                                                paddingTop: "0.75rem",
                                                paddingBottom: "0.75rem",
                                                position: "sticky",
                                                top: 0,
                                                zIndex: 2,
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {filteredProducts?.map((row, index) => (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.id}
                                        className={`${index % 2 === 0 ? "bg-[#FFEEE7]" : "bg-none"}`}
                                        sx={{
                                            boxShadow: "none",
                                            borderBottom: "none",
                                            paddingTop: "0.5rem",
                                            paddingBottom: "0.5rem",
                                        }}
                                    >
                                        {columns.map((column) => {
                                            const value = row[column.id];

                                            if (column.id === "quantidade") {
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        className="rounded-r-full"
                                                        sx={{
                                                            borderBottom: "none",
                                                            boxShadow: "none",
                                                            paddingTop: "0.5rem",
                                                            paddingBottom: "0.5rem",
                                                        }}
                                                    >
                                                        {props.amountLeft ? (
                                                            <div className="flex gap-1 items-center">
                                                            <div className="flex items-center w-fit bg-bgNativeHome px-2 border-2 border-gold rounded-lg text-base">{row.quantidadeVendida || 0} / {row.quantidade}</div>
                                                            Restantes </div>)
                                                        : <div>{row.quantidadeVendida || 0}/{row.quantidade}</div>}
                                                    </TableCell>
                                                );
                                            }

                                            if (column.id === "valor") {
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        sx={{
                                                            borderBottom: "none",
                                                            boxShadow: "none",
                                                            paddingTop: "0.5rem",
                                                            paddingBottom: "0.5rem",
                                                        }}
                                                    >
                                                        {"R$" + row.valor.toFixed(2)}
                                                    </TableCell>
                                                );
                                            }

                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    sx={{
                                                        borderBottom: "none",
                                                        boxShadow: "none",
                                                        paddingTop: "0.5rem",
                                                        paddingBottom: "0.5rem",
                                                    }}
                                                >
                                                    {column.format && typeof value === "number"
                                                        ? column.format("R$" + value.toFixed(2))
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
            </div>
        </div>
    );
}
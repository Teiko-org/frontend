import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { productsThisFornadasService } from "../../service/productsFornadasService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function TableProductsThisFornada(props) {

    const storageKey = `fornada_table_pagination_${props.idFornada}`;
    const [products, setProducts] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState(props.searchTerm || "");
    const [currentPage, setCurrentPage] = React.useState(() => {
        const savedPage = sessionStorage.getItem(storageKey);
        return savedPage ? parseInt(savedPage, 10) : 0;
    });
    const [pageSize, setPageSize] = React.useState(props.pageSize || 10);
    const [totalPages, setTotalPages] = React.useState(0);
    const [totalElements, setTotalElements] = React.useState(0);
    const compact = !!props.compact; // modo compacto apenas na tela de "consultar fornadas"

    // Colunas conforme o modo
    const columns = compact
        ? [
            { id: "produto", label: "PRODUTO", minWidth: 240, align: "left" },
            { id: "valor", label: "PREÇO", minWidth: 80, align: "left" },
            { id: "quantidade", label: "TOTAL VENDIDO", minWidth: 90, align: "left" },
          ]
        : [
            { id: "produto", label: "PRODUTO", minWidth: 150, align: "left" },
            { id: "categoria", label: "CATEGORIA", minWidth: 50, align: "left" },
            { id: "valor", label: "PREÇO", minWidth: 50, align: "left" },
            { id: "quantidade", label: "QUANTIDADE", minWidth: 50, align: "left" },
          ];

    const getData = async (page = 0, size = pageSize) => {
        try {
            const response = await productsThisFornadasService(props.idFornada, page, size);
            
            // Handle both paginated response and direct array response
            if (response.content && Array.isArray(response.content)) {
                setProducts(response.content);
                setTotalPages(response.totalPages || 0);
                setTotalElements(response.totalElements || 0);
                setCurrentPage(page);
            } else if (Array.isArray(response)) {
                // Fallback for non-paginated responses
                setProducts(response);
                setTotalPages(1);
                setTotalElements(response.length);
                setCurrentPage(0);
            } else {
                setProducts([]);
                setTotalPages(0);
                setTotalElements(0);
            }
        } catch (error) {
            console.log(error);
            setProducts([]);
            setTotalPages(0);
            setTotalElements(0);
        }
    };

    React.useEffect(() => {
        setCurrentPage(0);
        getData(0, pageSize);
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

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            getData(currentPage + 1, pageSize);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            getData(currentPage - 1, pageSize);
        }
    };

    return (
        <div className={`flex flex-col ${compact ? "w-[720px] h-[280px] ml-auto mr-0" : "w-[90%] h-[420px]"} border-2 border-gold rounded-2xl overflow-hidden`}>

            <div className="flex-1 overflow-hidden">
                <Paper
                    className="h-full"
                    sx={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        borderRadius: "0",
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
                        <Table stickyHeader aria-label="sticky table" size={compact ? "small" : "medium"}>
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
                                                paddingTop: compact ? "0.35rem" : "0.75rem",
                                                paddingBottom: compact ? "0.35rem" : "0.75rem",
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
                                        key={row.fornadaDaVezId || `${row.id}-${index}`}
                                        className={`${index % 2 === 0 ? "bg-[#FFEEE7]" : "bg-none"}`}
                                        sx={{
                                            boxShadow: "none",
                                            borderBottom: "none",
                                            paddingTop: compact ? "0.25rem" : "0.5rem",
                                            paddingBottom: compact ? "0.25rem" : "0.5rem",
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
                                                            paddingTop: compact ? "0.25rem" : "0.5rem",
                                                            paddingBottom: compact ? "0.25rem" : "0.5rem",
                                                        }}
                                                    >
                                                        {(() => {
                                                            const vendidos = row.quantidadeVendida || 0;
                                                            const restante = row.quantidade || 0;
                                                            // Use o campo fixo quantidadeTotal do backend
                                                            const planejado = row.quantidadeTotal ?? (vendidos + restante);
                                                            if (compact) {
                                                                return (
                                                                    <div className="pr-2">{vendidos}/{planejado}</div>
                                                                );
                                                            }
                                                            if (props.amountLeft) {
                                                                return (
                                                                    <div className="flex gap-1 items-center">
                                                                      <div className="flex items-center w-fit bg-bgNativeHome px-2 border-2 border-gold rounded-lg text-base">{vendidos} / {planejado}</div>
                                                                      Restantes
                                                                    </div>
                                                                );
                                                            }
                                                            return (
                                                                <div>{vendidos}/{planejado}</div>
                                                            );
                                                        })()}
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
                                                            paddingTop: compact ? "0.25rem" : "0.5rem",
                                                            paddingBottom: compact ? "0.25rem" : "0.5rem",
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
                                                        paddingTop: compact ? "0.25rem" : "0.5rem",
                                                        paddingBottom: compact ? "0.25rem" : "0.5rem",
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

            {/* Pagination Controls */}
        
                <div className="flex justify-center items-center gap-4 mt-4 mb-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gold bg-bgHome text-blue font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:scale-105 transition-transform duration-200"
                    >
                        <FaChevronLeft /> Anterior
                    </button>

                    <span className="text-blue font-bold">
                        Página {currentPage + 1} de {totalPages}
                    </span>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages - 1}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gold bg-bgHome text-blue font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:scale-105 transition-transform duration-200"
                    >
                        Próxima <FaChevronRight />
                    </button>
                </div>
            
        </div>
    );
}
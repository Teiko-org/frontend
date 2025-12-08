import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { axiosApi } from "../../provider/AxiosApi";
import { FaMinus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import Button from "../Button";
import { CiSearch } from "react-icons/ci";
import { productsFornadasService } from "../../service/productsFornadasService";

const columns = [
  { id: "selecionado", label: "", minWidth: 10, align: "center" },
  { id: "produto", label: "PRODUTO", minWidth: 150, align: "left" },
  { id: "categoria", label: "CATEGORIA", minWidth: 50, align: "left" },
  { id: "valor", label: "PREÇO", minWidth: 50, align: "left" },
  { id: "quantidade", label: "QUANTIDADE", minWidth: 50, align: "left" },
];

// Função para remover acentos
const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export default function TableSelectProductsFornada() {
  const storageKey = "fornada_select_table_pagination";
  const [products, setProducts] = React.useState([]);
  const [allProducts, setAllProducts] = React.useState([]); // Todos os produtos para busca
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedProducts, setSelectedProducts] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(() => {
    const savedPage = sessionStorage.getItem(storageKey);
    return savedPage ? parseInt(savedPage, 10) : 0;
  });
  const [pageSize, setPageSize] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalElements, setTotalElements] = React.useState(0);
  const [isSearching, setIsSearching] = React.useState(false);

  React.useEffect(() => {
    const savedPage = sessionStorage.getItem(storageKey);
    const pageToLoad = savedPage ? parseInt(savedPage, 10) : 0;
    getData(pageToLoad);
    
    const produtosSalvos = JSON.parse(localStorage.getItem("selectedProducts") || "[]");
    if (produtosSalvos.length > 0) {
      setSelectedProducts(produtosSalvos);
    }

    // Listener para recarregar quando um produto for criado/atualizado
    const handleProductUpdate = () => {
      console.log('Evento de produto criado/atualizado recebido, recarregando lista...');
      const savedPage = sessionStorage.getItem(storageKey);
      const pageToLoad = savedPage ? parseInt(savedPage, 10) : 0;
      getData(pageToLoad);
    };

    // Listener para quando o modo de edição é ativado
    const handleEditModeActivated = () => {
      console.log('🔄 Modo de edição ativado, recarregando lista de produtos...');
      const savedPage = sessionStorage.getItem(storageKey);
      const pageToLoad = savedPage ? parseInt(savedPage, 10) : 0;
      getData(pageToLoad);
    };

    // Eventos customizados
    window.addEventListener('productCreated', handleProductUpdate);
    window.addEventListener('productUpdated', handleProductUpdate);
    window.addEventListener('fornadaEditModeActivated', handleEditModeActivated);
    
    // Recarregar quando a janela recebe foco (útil quando volta de outra aba)
    const handleFocus = () => {
      const savedPage = sessionStorage.getItem(storageKey);
      const pageToLoad = savedPage ? parseInt(savedPage, 10) : 0;
      getData(pageToLoad);
    };
    window.addEventListener('focus', handleFocus);

    // Recarregar quando o componente é montado novamente (útil ao entrar em modo de edição)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const savedPage = sessionStorage.getItem(storageKey);
        const pageToLoad = savedPage ? parseInt(savedPage, 10) : 0;
        getData(pageToLoad);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('productCreated', handleProductUpdate);
      window.removeEventListener('productUpdated', handleProductUpdate);
      window.removeEventListener('fornadaEditModeActivated', handleEditModeActivated);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const getData = async (page = 0) => {
    try {
      const response = await productsFornadasService(page, pageSize);
      
      // Handle both paginated response and direct array response
      if (response.content && Array.isArray(response.content)) {
        setProducts(response.content);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
        setCurrentPage(page);
        // Save pagination state to sessionStorage
        sessionStorage.setItem(storageKey, page.toString());
      } else if (Array.isArray(response)) {
        // Fallback for non-paginated responses
        setProducts(response);
        setTotalPages(1);
        setTotalElements(response.length);
        setCurrentPage(0);
        sessionStorage.setItem(storageKey, '0');
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

  // Buscar todos os produtos quando há termo de busca
  const getAllProductsForSearch = async () => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setAllProducts([]);
      return;
    }

    setIsSearching(true);
    try {
      // Buscar primeira página para saber quantas páginas existem
      const firstPage = await productsFornadasService(0, pageSize);
      const totalPagesCount = firstPage.totalPages || 1;
      
      // Buscar todas as páginas
      const allPagesPromises = [];
      for (let i = 0; i < totalPagesCount; i++) {
        allPagesPromises.push(productsFornadasService(i, pageSize));
      }
      
      const allPagesResults = await Promise.all(allPagesPromises);
      const allProductsList = allPagesResults.flatMap(result => 
        result.content && Array.isArray(result.content) ? result.content : (Array.isArray(result) ? result : [])
      );
      
      setAllProducts(allProductsList);
    } catch (error) {
      console.error("Erro ao buscar todos os produtos:", error);
      setAllProducts([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Effect para buscar todos os produtos quando há busca
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        getAllProductsForSearch();
      } else {
        setIsSearching(false);
        setAllProducts([]);
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filteredProducts = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return products || [];
    }

    // Se há termo de busca e allProducts tem dados, usar allProducts, senão usar products da página atual
    const productsToFilter = (searchTerm.trim() && allProducts.length > 0) ? allProducts : products;
    
    const searchNormalized = removeAccents(searchTerm.toLowerCase());
    
    return (productsToFilter || []).filter((product) => {
      const productNameNormalized = removeAccents((product.produto || "").toLowerCase());
      const categoryNormalized = removeAccents((product.categoria || "").toLowerCase());
      
      return productNameNormalized.includes(searchNormalized) || 
             categoryNormalized.includes(searchNormalized);
    });
  }, [searchTerm, products, allProducts]);

  React.useEffect(() => {
    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
    console.log("Selected products updated:", selectedProducts);
  }, [selectedProducts]);

  const handleSelect = (id) => {
    setSelectedProducts((prevSelected) => {
      const found = prevSelected.find((item) => item.id === id);
      if (found) {
        return prevSelected.filter((item) => item.id !== id);
      } else {
        return [...prevSelected, { id, quantidade: 1 }];
      }
    });
  };

  const handleQuantidade = (id, delta) => {
    setSelectedProducts((prevSelected) => {
      const item = prevSelected.find((item) => item.id === id);
      if (!item) return prevSelected;
      
      const novaQuantidade = item.quantidade + delta;
      
      if (novaQuantidade <= 0) {
        return prevSelected.filter((item) => item.id !== id);
      }
      
      return prevSelected.map((item) =>
        item.id === id
          ? { ...item, quantidade: novaQuantidade }
          : item
      );
    });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      getData(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      getData(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col w-[90%] h-[420px] border-2 border-gold bg-bgHome rounded-2xl overflow-hidden">
      <header className="flex flex-row justify-between px-20 items-center bg-gradient-blue h-[3.6875rem] w-full flex-shrink-0 rounded-t-2xl overflow-hidden relative z-10">
        <h1 className="text-gold text-[1.5rem] whitespace-nowrap">Selecionar Produtos</h1>

        <div className="flex w-96 px-3 py-2 items-center justify-between bg-white rounded-lg border border-gray-300 flex-shrink-0">
          <input
            type="text"
            placeholder="Procurar por produto"
            className="h-[24px] w-full pl-2 pr-2 text-gray-800 bg-transparent border-none outline-none focus:outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <CiSearch className="text-2xl text-gold font-bold flex-shrink-0" />
        </div>
      </header>

      <div className="flex-1 overflow-hidden bg-bgHome">
        <Paper
          className="h-full"
          sx={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            border: "none",
            boxShadow: "none",
            borderRadius: "0",
            backgroundColor: "transparent",
          }}
        >
          <TableContainer
            sx={{
              height: "100%",
              maxHeight: "100%",
              overflow: "auto",
              padding: "0",
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
            className="bg-bgHome"
          >
            <Table stickyHeader aria-label="sticky table" sx={{ margin: 0, padding: 0 }}>
              <TableHead sx={{ margin: 0, padding: 0 }}>
                <TableRow sx={{ margin: 0, padding: 0 }}>
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
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                        margin: 0,
                      }}
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

                      if (column.id === "selecionado") {
                        const checked = selectedProducts.some(
                          (item) => item.id === row.id
                        );
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            className="rounded-l-full relative"
                            sx={{
                              borderBottom: "none",
                              boxShadow: "none",
                              paddingTop: "0.5rem",
                              paddingBottom: "0.5rem",
                              paddingLeft: "1rem",
                              paddingRight: "0.5rem",
                            }}
                          >
                            <div className="relative w-5 h-5 flex items-center justify-center">
                              <input
                                onChange={() => handleSelect(row.id)}
                                type="checkbox"
                                checked={checked}
                                className="peer appearance-none w-5 h-5 border-2 border-gold rounded-full bg-white checked:bg-gold checked:border-gold cursor-pointer relative z-10"
                                style={{ outline: "none" }}
                              />
                              {checked && (
                                <span
                                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                                  style={{ zIndex: 20 }}
                                >
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className="block"
                                  >
                                    <path
                                      d="M5 10L9 14L15 7"
                                      stroke="white"
                                      strokeWidth="2.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </span>
                              )}
                            </div>
                          </TableCell>
                        );
                      }

                      if (column.id === "quantidade") {
                        const selected = selectedProducts.find(
                          (item) => item.id === row.id
                        );
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
                              paddingLeft: "0.5rem",
                              paddingRight: "1rem",
                            }}
                          >
                            <div className="flex items-center justify-evenly w-20 bg-bgNativeHome border border-gold rounded-xl">
                              <button
                                disabled={!selected}
                                onClick={() => handleQuantidade(row.id, 1)}
                                className="disabled:opacity-50"
                              >
                                <FaPlus />
                              </button>
                              <div className="bg-white h-full py-1 w-6 flex justify-center rounded-md font-bold text-base">
                                {selected ? selected.quantidade : 0}
                              </div>
                              <button
                                disabled={!selected}
                                className="disabled:opacity-50"
                                onClick={() => handleQuantidade(row.id, -1)}
                              >
                                <FaMinus />
                              </button>
                            </div>
                          </TableCell>
                        );
                      }

                      if (column.id === "valor") {
                        const selected = selectedProducts.find(
                          (item) => item.id === row.id
                        );
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            sx={{
                              borderBottom: "none",
                              boxShadow: "none",
                              paddingTop: "0.5rem",
                              paddingBottom: "0.5rem",
                              paddingLeft: "0.5rem",
                              paddingRight: "0.5rem",
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
                            paddingLeft: "0.5rem",
                            paddingRight: "0.5rem",
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
      {!searchTerm.trim() && totalPages > 1 && (
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
      )}
      {searchTerm.trim() && (
        <div className="flex justify-center items-center gap-4 mt-4 mb-4">
          <span className="text-blue font-bold">
            {filteredProducts.length} resultado(s) encontrado(s)
          </span>
        </div>
      )}
    </div>
  );
}

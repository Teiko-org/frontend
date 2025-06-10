import ModalBaseForm from "../ModalBaseForm";
import Button from "../Button";
import { useState } from "react";
import Select from "../Select";

export default function ModalFilterProduct(props) {
    const products = props.products;
    let categories = new Set();

    products.forEach(product => {
        categories.add(product.categoria);
    });

    const categoriesFiltered = [...categories];

    const [category, setCategory] = useState('');
    const [qtdDe, setQtdDe] = useState('');
    const [qtdAte, setQtdAte] = useState('');
    const [priceDe, setPriceDe] = useState('');
    const [priceAte, setPriceAte] = useState('');
    const [status, setStatus] = useState('');

    const handleFilter = () => {
        localStorage.setItem('CATEGORY', category);
        localStorage.setItem('QTD_DE', qtdDe);
        localStorage.setItem('QTD_ATE', qtdAte);
        localStorage.setItem('PRICE_DE', priceDe);
        localStorage.setItem('PRICE_ATE', priceAte);
        localStorage.setItem('STATUS', status);
        props.setFilterModalOpen(false);
    }

    return (
        <>
            <ModalBaseForm
                onClose={props.onClose}
                title={'Filtrar Produtos'}
            >
                <div className="flex flex-row ">
                    <div className="w-[50%]">
                        <h2 className="mb-6">Categoria</h2>
                        <div className="w-[80%]">
                            <Select
                                options={categoriesFiltered.map(category => ({ value: category, label: category }))}
                                // value={localStorage.getItem("CATEGORY")}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Selecione a categoria do produto"
                            />
                        </div>
                        <div>
                            <h2 className="mb-1">Quantidade</h2>
                            <div className="flex flex-row mb-3">
                                <div className="flex flex-col justify-start">
                                    <span>De:</span>
                                    <input
                                        className="border-2 border-gold rounded-lg px-4 py-2 w-[40%]"
                                        // value={localStorage.getItem("QTD_DE")}
                                        type="number"
                                        onChange={(e) => setQtdDe(e.target.value)}
                                        placeholder="999"
                                    />
                                </div>
                                <div className="flex flex-col justify-start">
                                    <span>Até:</span>
                                    <input
                                        className="border-2 border-gold rounded-lg px-4 py-2 w-[40%]"
                                        // value={localStorage.getItem("QTD_ATE")}
                                        type="number"
                                        onChange={(e) => setQtdAte(e.target.value)}
                                        placeholder="999"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-[50%]">
                        <div>
                            <h2>Preço</h2>
                            <div className="flex flex-row mb-3">
                                <div className="flex flex-col justify-start">
                                    <span>De:</span>
                                    <input
                                        className="border-2 border-gold rounded-lg px-4 py-2 w-[50%]"
                                        // value={localStorage.getItem("PRICE_DE")}
                                        type="number"
                                        onChange={(e) => setPriceDe(e.target.value)}
                                        placeholder="R$"
                                    />
                                </div>
                                <div className="flex flex-col justify-start">
                                    <span>Até:</span>
                                    <input
                                        className="border-2 border-gold rounded-lg px-4 py-2 w-[50%]"
                                        // value={localStorage.getItem("PRICE_ATE")}
                                        type="number"
                                        onChange={(e) => setPriceAte(e.target.value)}
                                        placeholder="R$"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-[80%]">
                            <h2 className="mb-7">Status</h2>
                            <Select
                                options={
                                    [
                                        { value: "avaliable", label: "Disponível" },
                                        { value: "unavaliable", label: "Indisponível" },

                                    ]
                                }
                                value={category}
                                onChange={(e) => setStatus(e.target.value)}
                                placeholder="Selecionar status"
                            />
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-end">
                    <Button text={'Filtrar'} onClick={() => handleFilter()} />
                </div>
            </ModalBaseForm>
        </>
    );
}

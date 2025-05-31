import ModalBaseForm from "../ModalBaseForm";
import Button from "../Button";
import { useState } from "react";

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
    }

    return (
        <>
            <ModalBaseForm
                onClose={props.onClose}
                title={'Filtrar Produtos'}
            >
                <div className="flex flex-row ">
                    <div className="w-[50%]">
                        <div>
                            <h2>Categoria</h2>
                            <select name="category" id="cartegory" onChange={(e) => setCategory(e.target.value)}>
                                <option value="--">--</option>
                                {
                                    categoriesFiltered.map((category) => {
                                        return (
                                            <option value={`${category}`} key={category}>{category}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <div>
                            <h2>Quantidade</h2>
                            <div>
                                <span>De:</span>
                                <input type="number" placeholder="999" onChange={(e) => setQtdDe(e.target.value)}/>
                            </div>
                            <div>
                                <span>Até:</span>
                                <input type="number" placeholder="999" onChange={(e) => setQtdAte(e.target.value)}/>
                            </div>
                        </div>
                    </div>

                    <div className="w-[50%]">
                        <div>
                            <h2>Preço</h2>
                            <div>
                                <span>De:</span>
                                <input type="text" placeholder="R$" onChange={(e) => setPriceDe(e.target.value)}/>
                            </div>
                            <div>
                                <span>Até:</span>
                                <input type="text" placeholder="R$" onChange={(e) => setPriceAte(e.target.value)}/>
                            </div>
                        </div>
                        <div>
                            <h2>Status</h2>
                            <select name="status" onChange={(e) => setStatus(e.target.value)}>
                                <option value="--">--</option>
                                <option value="avaliable">Disponível</option>
                                <option value="unavaliable">Indisponível</option>
                            </select>
                        </div>
                    </div>
                </div>
                <Button text={'Filtrar'} onClick={() => handleFilter()} />
            </ModalBaseForm>
        </>
    );
}

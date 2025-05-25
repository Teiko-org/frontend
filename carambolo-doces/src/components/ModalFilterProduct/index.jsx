import ModalBaseForm from "../ModalBaseForm";
import Button from "../Button";

export default function ModalFilterProduct(props) {
    return (
        <>
            <ModalBaseForm
                title={'Filtrar Produtos'}
            >
                <div className="flex flex-row ">
                    <div className="w-[50%]">
                        <div>
                            <h2>Categoria</h2>
                            <select name="category" id="cartegory">
                                <option value="">
                                    Selecione a categoria do produto
                                </option>
                                <option value="">aaaa</option>
                                <option value="">bbbb</option>
                                <option value="">aaaa</option>
                            </select>
                        </div>
                        <div>
                            <h2>Quantidade</h2>
                            <div>
                                <span>De:</span>
                                <input type="number" placeholder="999" />
                            </div>
                            <div>
                                <span>Até:</span>
                                <input type="number" placeholder="999" />
                            </div>
                        </div>
                    </div>

                    <div className="w-[50%]">
                        <div>
                            <h2>Preço</h2>
                            <div>
                                <span>De:</span>
                                <input type="text" placeholder="R$" />
                            </div>
                            <div>
                                <span>Até:</span>
                                <input type="text" placeholder="R$" />
                            </div>
                        </div>
                        <div>
                            <h2>Status</h2>
                            <select name="status">
                                <option value="">aaaaa</option>
                                <option value="">bbbb</option>
                                <option value="">cccc</option>
                            </select>
                        </div>
                    </div>

                </div>
                <Button text={'Filtrar'} />
            </ModalBaseForm>
        </>
    );
}
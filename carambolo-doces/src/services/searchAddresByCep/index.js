function searchAddresByCep (cep) {

    const searchAddresByCep = async (cep) => {
        try {
          const cepOnlyNumbers = typedCep.replace(/\D/g, "");
    
          if (cepOnlyNumbers.length !== 8) {
            return;
          }
    
          const response = await axios.get(
            `https://viacep.com.br/ws/${cepOnlyNumbers}/json/`
          );
    
          if (response.data && !response.data.erro) {
            setEstado(response.data.uf || "");
            setCidade(response.data.localidade || "");
            setBairro(response.data.bairro || "");
            setRua(response.data.logradouro || "");
          } else {
            console.error("CEP não encontrado.");
            cleanAddressFields();
          }
        } catch (error) {
          console.error("Erro ao buscar o CEP:", error);
          cleanAddressFields();
        }
      };
    
      const cleanAddressFields = () => {
        setEstado("");
        setCidade("");
        setBairro("");
        setRua("");
      };

}

export default searchAddresByCep;
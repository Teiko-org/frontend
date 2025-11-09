import React, { useState, useContext, useEffect } from "react";
import { FormContext } from "../../contexts/FormContext";
import Button from "../../components/Button";
import ModalMontagem from "../../components/ModalMontagem";
import ModalDecoracao from "../../components/ModalDecoracao";
import ModalAdicionais from "../../components/ModalAdicionais";
import ModalEntregaRetirada from "../../components/ModalEntregaRetirada";
import ModalFinalizar from "../../components/ModalFinalizar";
import ModalImagensReferencia from "../../components/ModalImagensReferencia";
import { FaEdit } from "react-icons/fa";

const Step5 = () => {
  const { prevStep, submitForm, formData, valorEstimado, appendFormData, setFormData } = useContext(FormContext);
  const [localFormData, setLocalFormData] = useState(formData);
  const [imageUrls, setImageUrls] = useState([]);
  
  useEffect(() => {
    if (formData) {
      setLocalFormData(formData);
    }
  }, [formData]);

  useEffect(() => {
    if (localFormData?.imagens && Array.isArray(localFormData.imagens)) {
      const urls = localFormData.imagens.map((imagem) => {
        if (imagem.preview) {
          return imagem.preview;
        } else if (imagem.file instanceof File) {
          return URL.createObjectURL(imagem.file);
        } else if (typeof imagem.file === 'string') {
          return imagem.file;
        } else if (imagem instanceof File) {
          return URL.createObjectURL(imagem);
        }
        return null;
      }).filter(Boolean);
      
      setImageUrls(urls);
      
      return () => {
        urls.forEach(url => {
          if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      };
    } else {
      setImageUrls([]);
    }
  }, [localFormData?.imagens]);
  
  if (!formData) {
    return null;
  }

  const formDataEntries = {
    ...localFormData, 
    imagens: Array.isArray(localFormData.imagens) ? localFormData.imagens : []
  };

  const [isModalMontagemOpen, setIsModalMontagemOpen] = useState(false);
  const [isModalDecoracaoOpen, setIsModalDecoracaoOpen] = useState(false);
  const [isModalAdicionaisOpen, setIsModalAdicionaisOpen] = useState(false);
  const [isModalEntregaRetiradaOpen, setIsModalEntregaRetiradaOpen] = useState(false);
  const [isModalFinalizarOpen, setIsModalFinalizarOpen] = useState(false);
  const [isModalImagensReferenciaOpen, setIsModalImagensReferenciaOpen] = useState(false);

  const formatString = (str) =>
    str.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const dateComponents = dateStr.split("/");

    if (dateComponents.length === 3) {
      const [year, month, day] = dateComponents;
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    }

    return dateStr;
  };

  const formatRecheio = (str) => {
    if (!str) return "";
    const parts = str.split("-");
    if (parts.length > 1) {
      const nome = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      const descricao = parts
        .slice(1)
        .join(" ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
      return `${nome} (${descricao})`;
    } else {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  };

  const montagemData = {
    tamanho: formDataEntries.tamanho || "",
    formato: formDataEntries.formato || "",
    massa: formatString(formDataEntries.massa) || "",
    recheio: formatRecheio(formDataEntries.recheio) || "",
  };

  const decoracaoData = `${formDataEntries.observacoes || "Nenhuma"}`

  const entregaRetiradaData = {
    tipo: formDataEntries.deliveryOption || "",
    nome: formDataEntries.nome || "",
    telefone: formDataEntries.telefone || "",
    data: formDataEntries.data ? formatDate(formDataEntries.data) : "",
    cep: formDataEntries.cep || "",
    estado: formDataEntries.estado || "",
    cidade: formDataEntries.cidade || "",
    bairro: formDataEntries.bairro || "",
    rua: formDataEntries.rua || "",
    numero: formDataEntries.numero || "",
    complemento: formDataEntries.complemento || "",
    horario: formDataEntries.horario || "",
  };

  const handlePrev = () => {
    prevStep();
  };

  const handleFinalizar = () => {
  setIsModalFinalizarOpen(true);
};

const handleConfirmFinalizar = async () => {
  try {
    await submitForm();
  } finally {
    setIsModalFinalizarOpen(false);
  }
};

  return (
    <div className="p-6 bg-bgNativeHome rounded-lg shadow-md">
      <h2 className="text-blue text-2xl mb-6 font-bold">Revise seu pedido</h2>

      {/* MONTAGEM */}
      <div className="mb-5 pb-4 border-b border-gray-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg text-blue">MONTAGEM</h3>
          <FaEdit
            className="text-gold cursor-pointer"
            onClick={() => setIsModalMontagemOpen(true)}
          />
          {isModalMontagemOpen && (
            <ModalMontagem
              isOpen={isModalMontagemOpen}
              onClose={() => setIsModalMontagemOpen(false)}
              selectedSize={montagemData.tamanho}
              selectedShape={montagemData.formato}
              selectedMass={formDataEntries.massa}
              selectedFilling={formDataEntries.recheio}
              onSave={(newData) => {
                // Atualizar os dados de montagem no FormContext
                appendFormData({
                  tamanho: newData.size,
                  formato: newData.shape,
                  massa: newData.mass,
                  recheio: newData.filling,
                  massaId: newData.mass, // Assumindo que o ID é o mesmo que o valor
                  recheioId: newData.filling // Assumindo que o ID é o mesmo que o valor
                }, 'dadosMontagem');
                setIsModalMontagemOpen(false);
              }}
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-10 mb-6">
            <div className="flex flex-col gap-2">
              <span className="text-blue font-semibold">TAMANHO</span>
              <span className="badge">{montagemData.tamanho}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-blue font-semibold">FORMATO</span>
              <span className="badge">{montagemData.formato}</span>
            </div>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col">
              <span className="text-blue font-semibold">MASSA</span>
              {montagemData.massa}
            </div>
            <div className="flex flex-col">
              <span className="text-blue font-semibold">RECHEIO</span>
              {montagemData.recheio}
            </div>
          </div>
        </div>
      </div>

      {/* DECORAÇÃO */}
      <div className="mb-5 pb-4 border-b border-gray-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg text-blue">DECORAÇÃO</h3>
          <FaEdit
            className="text-gold cursor-pointer"
            onClick={() => setIsModalDecoracaoOpen(true)}
          />
          {isModalDecoracaoOpen && (
            <ModalDecoracao 
              isOpen={isModalDecoracaoOpen}
              onClose={() => setIsModalDecoracaoOpen(false)}
              initialObservations={formDataEntries.observacoes}
              onSave={(newData) => {
                // Atualizar as observações no FormContext
                appendFormData({
                  observacoes: newData.observacoes || ""
                }, 'dadosMontagem');
                setIsModalDecoracaoOpen(false);
              }}
            />
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-blue font-semibold">OBSERVAÇÕES</span>
            <div className="mt-1">{decoracaoData}</div>
          </div>
          {formDataEntries.imagens && formDataEntries.imagens.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue font-semibold">IMAGENS DE REFERÊNCIA</span>
                <FaEdit
                  className="text-gold cursor-pointer"
                  onClick={() => setIsModalImagensReferenciaOpen(true)}
                />
              </div>
              {isModalImagensReferenciaOpen && (
                <ModalImagensReferencia
                  isOpen={isModalImagensReferenciaOpen}
                  onClose={() => setIsModalImagensReferenciaOpen(false)}
                  initialImages={formDataEntries.imagens}
                  onSave={(newImages) => {
                    // Atualizar as imagens no FormContext
                    // Substituir as imagens existentes pelas novas
                    const imageFiles = newImages.map(img => img.file || img);
                    setFormData(imageFiles, 'imagens');
                    setIsModalImagensReferenciaOpen(false);
                  }}
                />
              )}
              <div className="flex flex-wrap gap-4 mt-2">
                {formDataEntries.imagens.map((imagem, index) => {
                  const imageUrl = imageUrls[index] || null;

                  return (
                    <div key={index} className="relative text-center group">
                      <div className="relative inline-block">
                        {imageUrl && (
                          <img 
                            src={imageUrl} 
                            alt={imagem.name || imagem.file?.name || `Imagem ${index + 1}`}
                            className="h-20 w-20 object-cover rounded-lg mb-2 group-hover:opacity-75 transition-opacity"
                          />
                        )}
                      </div>
                      <span className="text-blue text-sm block truncate max-w-[80px]">
                        {imagem.name || imagem.file?.name || `Imagem ${index + 1}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ADICIONAIS */}
      <div className="mb-5 pb-4 border-b border-gray-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg text-blue">ADICIONAIS</h3>
          <FaEdit
            className="text-gold cursor-pointer"
            onClick={() => setIsModalAdicionaisOpen(true)}
          />
        </div>
        <div className="flex flex-wrap gap-6">
          {[
            { label: "CEREJA", name: "cereja", checked: formDataEntries.adicionais?.cereja || false },
            { label: "GLITTER", name: "glitter", checked: formDataEntries.adicionais?.glitter || false },
            { label: "PEROLADO", name: "perolado", checked: formDataEntries.adicionais?.perolado || false },
            { label: "LACINHOS", name: "lacinhos", checked: formDataEntries.adicionais?.lacinhos || false },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-blue text-sm font-semibold">
              <span
                className="w-5 h-5 rounded-sm p-[1px]"
                style={{
                  background: "linear-gradient(180deg, #A47032 0%, #D4B076 100%)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  className="w-full h-full rounded-[1px] flex items-center justify-center"
                  style={{
                    background: item.checked
                      ? "linear-gradient(180deg, #A47032 0%, #D4B076 100%)"
                      : "#fff",
                    transition: "all 0.2s ease",
                  }}
                >
                  {item.checked && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
              </span>
              {item.label}
            </div>
          ))}
        </div>
        
        {isModalAdicionaisOpen && (
          <ModalAdicionais
            isOpen={isModalAdicionaisOpen}
            onClose={() => setIsModalAdicionaisOpen(false)}
            initialAddons={{
              cereja: formDataEntries.adicionais?.cereja || false,
              glitter: formDataEntries.adicionais?.glitter || false,
              perolado: formDataEntries.adicionais?.perolado || false,
              lacinhos: formDataEntries.adicionais?.lacinhos || false,
            }}
            onSave={(newData) => {
              // Atualizar os adicionais no FormContext
              appendFormData({ adicionais: newData }, 'dadosMontagem');
              setIsModalAdicionaisOpen(false);
            }}
          />
        )}
      </div>


      {/* ENTREGA/RETIRADA */}
      <div className="mb-5 pb-4 border-b border-gray-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg text-blue">DADOS ENTREGA</h3>
          <FaEdit
            className="text-gold cursor-pointer"
            onClick={() => setIsModalEntregaRetiradaOpen(true)}
          />
          {isModalEntregaRetiradaOpen && (
            <ModalEntregaRetirada
              isOpen={isModalEntregaRetiradaOpen}
              onClose={() => setIsModalEntregaRetiradaOpen(false)}
              selectedData={formDataEntries.data}
              selectedTelefone={formDataEntries.telefone}
              selectedNome={formDataEntries.nome}
              selectedCep={formDataEntries.cep}
              selectedUf={formDataEntries.estado}
              selectedCidade={formDataEntries.cidade}
              selectedBairro={formDataEntries.bairro}
              selectedRua={formDataEntries.rua}
              selectedNumero={formDataEntries.numero}
              selectedComplemento={formDataEntries.complemento}
              selectedTipoEntrega={formDataEntries.deliveryOption}
              selectedHorario={formDataEntries.horario}
              onSave={(newData) => {
                setFormData(newData, 'dadosEntrega');
                setIsModalEntregaRetiradaOpen(false);
              }}
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-y-4 mb-4 text-blue">
          <div>
            <span className="font-semibold">SEU PEDIDO SERÁ:</span>{" "}
            {entregaRetiradaData.tipo}
          </div>
          <div>
            <span className="font-semibold">DATA:</span>{" "}
            {entregaRetiradaData.data}
          </div>
          <div>
            <span className="font-semibold">NOME:</span>{" "}
            {entregaRetiradaData.nome}
          </div>
          <div>
            <span className="font-semibold">TELEFONE:</span>{" "}
            {entregaRetiradaData.telefone}
          </div>
        </div>

        {entregaRetiradaData.tipo === "Entrega" ? (
          <>
            <div className="grid grid-cols-3 mb-4 text-blue">
              <div>
                <span className="font-semibold">CEP:</span>{" "}
                {entregaRetiradaData.cep}
              </div>
              <div>
                <span className="font-semibold">ESTADO:</span>{" "}
                {entregaRetiradaData.estado}
              </div>
              <div>
                <span className="font-semibold">CIDADE:</span>{" "}
                {entregaRetiradaData.cidade}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-4 text-blue">
              <div>
                <span className="font-semibold">BAIRRO:</span>{" "}
                {entregaRetiradaData.bairro}
              </div>
              <div>
                <span className="font-semibold">RUA:</span>{" "}
                {entregaRetiradaData.rua}
              </div>
              <div>
                <span className="font-semibold">NÚMERO:</span>{" "}
                {entregaRetiradaData.numero}
              </div>
              <div>
                <span className="font-semibold">COMPLEMENTO:</span>{" "}
                {entregaRetiradaData.complemento}
              </div>
            </div>
          </>
        ) : (
          <div className="text-blue mt-2">
            <span className="font-semibold">Horário para retirada:</span>{" "}
            {entregaRetiradaData.horario}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="text-gradient font-bold text-lg">
          VALOR ESTIMADO: R$ {valorEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div>
          <Button
            text="Voltar"
            className="mr-4 px-6 py-1"
            onClick={handlePrev}
            bgColor="bg-gradient-to-l from-darkGoldButton to-goldButton"
          />
          <Button
            text="Finalizar Pedido"
            className="px-6 py-1"
            onClick={handleFinalizar}
            bgColor="bg-gradient-to-l from-darkGoldButton to-goldButton"
          />
          {isModalFinalizarOpen && (
            <ModalFinalizar
              isOpen={isModalFinalizarOpen}
              onClose={() => setIsModalFinalizarOpen(false)}
              onFinalize={handleConfirmFinalizar}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Step5;
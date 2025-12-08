import React, { useContext, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FormContext } from "../../contexts/FormContext";
import { useFormContext, Controller } from "react-hook-form";
import Button from "../../components/Button";
import InputOption from "../../components/InputOption";
import { getAdicionaisByDecoracao } from "../../service/decoracaoService";

const Step3 = () => {
  const location = useLocation();
  const { nextStep, prevStep, appendFormData, formData, valorEstimado, dadosMontagem } =
    useContext(FormContext);
  const { control, handleSubmit, getValues, watch } = useFormContext();
  const [adicionais, setAdicionais] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchedDecoracao = useRef(null);

  useEffect(() => {
    // Try to use cached adicionais from dadosMontagem first
    const fetchAdicionais = async () => {
      console.log("🎯 Checking for cached adicionais in dadosMontagem");
      
      // Check if we have cached adicionais from the initial decoration load
      if (dadosMontagem?.adicionaisDisponiveis && Array.isArray(dadosMontagem.adicionaisDisponiveis)) {
        console.log("✅ Using cached adicionais:", dadosMontagem.adicionaisDisponiveis);
        setAdicionais(dadosMontagem.adicionaisDisponiveis);
        fetchedDecoracao.current = dadosMontagem.decoracaoId;
        return;
      }
      
      // Fallback: Fetch adicionais via API if not cached
      const decoracaoId = dadosMontagem?.decoracaoId || location.state?.decoracao?.id;
      
      console.log("useEffect triggered, dadosMontagem:", dadosMontagem);
      console.log("Decoration ID from location state:", location.state?.decoracao?.id);
      console.log("Using decoracaoId:", decoracaoId);
      
      // Only fetch if we haven't already fetched this decoration
      if (decoracaoId && fetchedDecoracao.current !== decoracaoId) {
        fetchedDecoracao.current = decoracaoId;
        setLoading(true);
        try {
          console.log("Fetching adicionais for decoracaoId:", decoracaoId);
          const adicionaisData = await getAdicionaisByDecoracao(decoracaoId);
          console.log("Adicionais fetched successfully:", adicionaisData);
          setAdicionais(adicionaisData);
        } catch (error) {
          console.error("Erro ao carregar adicionais:", error);
          setAdicionais([]);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("⚠️ decoracaoId not available or already fetched");
        console.log("dadosMontagem value:", dadosMontagem);
        console.log("location.state value:", location.state);
      }
    };

    fetchAdicionais();
  }, [dadosMontagem?.decoracaoId, location.state?.decoracao?.id]);

  const handleNext = (data) => {
    const { adicionaisSelecionados } = data;

    // Collect selected adicionais (now they have id and descricao)
    const adicionaisArray = [];
    if (adicionaisSelecionados) {
      Object.entries(adicionaisSelecionados).forEach(([key, isSelected]) => {
        if (isSelected) {
          // key is the index in the adicionais array
          const adicionalIndex = parseInt(key);
          if (adicionalIndex >= 0 && adicionalIndex < adicionais.length) {
            // Store the full adicional object (with id and descricao)
            adicionaisArray.push(adicionais[adicionalIndex]);
          }
        }
      });
    }

    console.log("Selected adicionais to save:", adicionaisArray);
    // Save adicionais to form data
    appendFormData({ adicionais: adicionaisArray }, "dadosMontagem");

    nextStep();
  };

  const handlePrev = () => {
    prevStep();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse">
          <p className="text-blue text-lg">Carregando adicionais...</p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(handleNext)(e);
      }}
    >
      <div className="mb-4">
        <h2 className="font-semibold tracking-wider text-lg text-blue">
          ADICIONAIS
        </h2>
        <p className="text-blue mb-4">
          Selecione quantos adicionais você quiser no seu Carambolo para que ele
          fique ainda mais perfeito
        </p>
        <div className="flex flex-col gap-2">
          {adicionais.length > 0 ? (
            adicionais.map((adicional, index) => (
              <Controller
                key={`${adicional.id}-${index}`}
                name={`adicionaisSelecionados.${index}`}
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <InputOption
                    type="checkbox"
                    label={adicional.descricao}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              Nenhum adicional disponível para esta decoração.
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-16">
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
            text="Continuar"
            className="px-6 py-1"
            type="submit"
            bgColor="bg-gradient-to-l from-darkGoldButton to-goldButton"
          />
        </div>
      </div>
    </form>
  );
};

export default Step3;

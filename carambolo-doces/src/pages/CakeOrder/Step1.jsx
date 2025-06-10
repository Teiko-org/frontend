import React, { useContext, useEffect } from "react";
import { FormContext } from "../../contexts/FormContext";
import { useFormContext, Controller } from "react-hook-form";
import Button from "../../components/Button";
import Select from "../../components/Select";

const Step1 = () => {
  const { nextStep, appendFormData } = useContext(FormContext);
  const { control, handleSubmit, setValue, getValues, watch, formState: { errors } } = useFormContext();

  const onSubmit = (data) => {
    console.log('Step 1 data:', data);
    appendFormData(data);
    nextStep();
  };

  const sizes = ["11cm", "13cm", "15cm", "17cm"];
  const formats = ["Redondo", "Coração"];

  const handleButtonClick = (field, value) => (event) => {
    event.preventDefault();
    setValue(field, value);
  };

  const createSlug = (text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ç/g, 'c')
      .replace(/[^a-zA-Z0-9]+/g, '-') 
      .replace(/(^-|-$)/g, '')
      .toLowerCase();
  };

  const availableRecheios = {
    cacau: ['Zanza (Ganache meio-amargo e redução de frutas vermelhas)', 'Marilia (Brigadeiro meio-amargo)', 'Hugo (Brigadeiro meio-amargo e Brigadeiro de ninho)', 'Bia Benego (Cocada cremosa de coco queimado)', 'Gislaine (Brigadeiro meio-amargo e redução de morango)', 'Nancy (Cocada cremosa e compota de abacaxi)', 'Priscila (Ganache, caramelo salgado e amendoim tostado)', 'Sara (Brigadeiro de maracujá e Ganache meio-amargo)', 'João Donato (Ganache meio-amargo e cupuaçu)'],
    cacau_expresso: ['Devil\'s Cake (Ganache meio-amargo)',],
    baunilha: ['Brunna (Brigadeiro de limão siciliano)', 'Duda (Brigadeiro de Doce de leite)', 'Giovanna (Brigadeiro de Pistache)', 'Juliana (Creme 4 leites e redução de frutas vermelhas)', 'Ana (Brigadeiro de limão siciliano e redução de frutas vermelhas)', 'Stefan (Brigadeiro de pistache e Brigadeiro de limão siciliano)', 'Dora (Brigadeiro de ninho e redução de frutas vermelhas)', 'Tiramissu (Creamcheese frosting e nuvem de cacau)'],
    red_velvet: ['Creamcheese Frosting']
  };

  const massaSelecionada = watch('massa', '');

  useEffect(() => {
    if (!massaSelecionada) {
      setValue('recheio', '');
    }
  }, [massaSelecionada, setValue]);

  const recheiosOptions = [
    'Creamcheese Frosting', 
    'Devil\'s Cake (Ganache meio-amargo)', 
    'Zanza (Ganache meio-amargo e redução de frutas vermelhas)',
    'Brunna (Brigadeiro de limão siciliano)', 
    'Marilia (Brigadeiro meio-amargo)', 
    'Hugo (Brigadeiro meio-amargo e Brigadeiro de ninho)', 
    'Bia Benego (Cocada cremosa de coco queimado)', 
    'Duda (Brigadeiro de Doce de leite)', 
    'Giovanna (Brigadeiro de Pistache)', 
    'Juliana (Creme 4 leites e redução de frutas vermelhas)', 
    'Ana (Brigadeiro de limão siciliano e redução de frutas vermelhas)', 
    'Stefan (Brigadeiro de pistache e Brigadeiro de limão siciliano)', 
    'Dora (Brigadeiro de ninho e redução de frutas vermelhas)', 
    'Gislaine (Brigadeiro meio-amargo e redução de morango)', 
    'Nancy (Cocada cremosa e compota de abacaxi)', 
    'Priscila (Ganache, caramelo salgado e amendoim tostado)', 
    'Sara (Brigadeiro de maracujá e Ganache meio-amargo)', 
    'Tiramissu (Creamcheese frosting e nuvem de cacau)', 
    'João Donato (Ganache meio-amargo e cupuaçu)'
  ];

  const filteredRecheios = recheiosOptions
    .filter(recheio => availableRecheios[massaSelecionada] && availableRecheios[massaSelecionada].includes(recheio))
    .map(recheio => ({ value: createSlug(recheio), label: recheio }));

  useEffect(() => {
    // Listener para preencher os campos do Step1 ao receber evento
    const fillFromBolo = (e) => {
      const bolo = e.detail;
      // Preenche os campos de acordo com os dados do bolo
      if (bolo.tamanho) setValue('tamanho', bolo.tamanho);
      if (bolo.formato) setValue('formato', bolo.formato);
      if (bolo.saborMassa) setValue('massa', bolo.saborMassa);
      if (bolo.saborRecheio) setValue('recheio', bolo.saborRecheio);
    };
    window.addEventListener('fillStep1FromBolo', fillFromBolo);
    return () => window.removeEventListener('fillStep1FromBolo', fillFromBolo);
  }, [setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-8">
        <h2 className="font-semibold tracking-wider text-lg text-blue">TAMANHO</h2>
        <div className="flex flex-wrap mt-2 gap-2">
          {sizes.map((size) => (
            <Controller
              key={size}
              name="tamanho"
              control={control}
              rules={{ required: "Tamanho é obrigatório" }}
              render={({ field }) => (
                <Button
                  type="button"
                  text={size}
                  onClick={handleButtonClick('tamanho', size)}
                  bgColor={getValues('tamanho') === size ? "bg-gradient-to-l from-darkGoldButton to-goldButton" : "bg-white"}
                />
              )}
            />
          ))}
        </div>
        {/* Mantendo a estrutura alinhada sem alterações */}
        <div style={{ height: '6px' }}>
          {errors.tamanho && (
            <span className="text-red text-sm">
              {errors.tamanho.message}
            </span>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-semibold tracking-wider text-lg text-blue">FORMATO</h2>
        <div className="flex mt-2 gap-2">
          {formats.map((format) => (
            <Controller
              key={format}
              name="formato"
              control={control}
              rules={{ required: "Formato é obrigatório" }}
              render={({ field }) => (
                <Button
                  type="button"
                  text={format}
                  onClick={handleButtonClick('formato', format)}
                  bgColor={getValues('formato') === format ? "bg-gradient-to-l from-darkGoldButton to-goldButton" : "bg-white"}
                />
              )}
            />
          ))}
        </div>
        <div style={{ height: '6px' }}>
          {errors.formato && (
            <span className="text-red text-sm">
              {errors.formato.message}
            </span>
          )}
        </div>
      </div>

      <div className="mb-8">
        <Controller
          name="massa"
          control={control}
          defaultValue=""
          rules={{ required: "Massa é obrigatória" }}
          render={({ field }) => (
            <Select 
              {...field}
              label="MASSA"
              options={[
                { value: 'cacau', label: 'Cacau' },
                { value: 'cacau_expresso', label: 'Cacau Expresso' },
                { value: 'baunilha', label: 'Baunilha' },
                { value: 'red_velvet', label: 'Red Velvet' }
              ]}
              placeholder="Selecione a massa"
              width="25%"
            />
          )}
        />
        {/* Usaremos o estilo flexível para manter a altura */}
        <div style={{ height: '6px' }}>
          {errors.massa && (
            <span className="text-red text-sm">
              {errors.massa.message}
            </span>
          )}
        </div>
      </div>
      
      <div className="mb-12">
        <Controller
          name="recheio"
          control={control}
          defaultValue=""
          rules={{ required: "Recheio é obrigatório" }}
          render={({ field }) => (
            <Select 
              {...field}
              label="RECHEIO"
              options={filteredRecheios}
              placeholder="Selecione o Recheio"
              width="100%"
            />
          )}
        />
        <div style={{ height: '4px' }}>
          {errors.recheio && (
            <span className="text-red text-sm">
              {errors.recheio.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-">
        <div className="text-gradient font-bold text-lg">VALOR ESTIMADO: R$ 999,99</div>
        <Button
          text="Continuar"
          className="px-6 py-1"
          type="submit"
          bgColor="bg-gradient-to-l from-darkGoldButton to-goldButton"
        />
      </div>
    </form>
  );
};

export default Step1;
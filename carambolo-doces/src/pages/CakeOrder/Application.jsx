import React, { useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FormProvider, FormContext } from '../../contexts/FormContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Stepper from '../../components/Stepper';
import Carousel from '../../components/Carousel';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import { getDecoracaoById } from '../../service/decoracaoService';
import cakeImage1 from '../../assets/image_cake.png';
import cakeImage2 from '../../assets/image_cake.png';
import cakeImage3 from '../../assets/image_cake.png';

const slides = [
  { id: 1, image: cakeImage1, title: 'Slide 1' },
  { id: 2, image: cakeImage2, title: 'Slide 2' },
  { id: 3, image: cakeImage3, title: 'Slide 3' },
];

const steps = [Step1, Step2, Step3, Step4, Step5];

const Application = () => {
  const location = useLocation();
  const { currentStep, appendFormData } = useContext(FormContext);
  const StepComponent = steps[currentStep - 1];
  const [selectedBoloName, setSelectedBoloName] = React.useState("CARAMBOLO VINTAGE");
  const [carouselSlides, setCarouselSlides] = React.useState(slides);
  const decoracaoIdRef = useRef(null);

  useEffect(() => {
    // Check if decoration was passed via route state
    const decoracao = location.state?.decoracao;
    if (decoracao && decoracao.id) {
      // Only set once if not already set
      if (decoracaoIdRef.current !== decoracao.id) {
        console.log("Decoration found in route state, ID:", decoracao.id);
        decoracaoIdRef.current = decoracao.id;
        
        // Store decoration in FormContext for Step3 to access
        appendFormData({ decoracaoId: decoracao.id }, "dadosMontagem");
        
        // Scroll to top only on initial decoration load
        window.scrollTo(0, 0);
        
        // Fetch full decoration data to get all images and adicionais
        const fetchDecoracao = async () => {
          try {
            const fullDecoracao = await getDecoracaoById(decoracao.id);
            if (fullDecoracao) {
              console.log("✅ Full decoration loaded:", fullDecoracao);
              
              // Store full decoration data in FormContext for Steps to access
              const decoracaoData = {
                decoracaoId: decoracao.id,
                decoracaoCompleta: fullDecoracao
              };
              
              // Extract adicionais if available in the full decoration data
              let adicionaisExtraidos = [];
              if (fullDecoracao.adicionaisPossiveis && Array.isArray(fullDecoracao.adicionaisPossiveis)) {
                adicionaisExtraidos = fullDecoracao.adicionaisPossiveis;
                console.log("📦 Adicionais extraídos de adicionaisPossiveis:", adicionaisExtraidos);
              } else if (fullDecoracao.adicionais && Array.isArray(fullDecoracao.adicionais)) {
                adicionaisExtraidos = fullDecoracao.adicionais;
                console.log("📦 Adicionais extraídos de adicionais:", adicionaisExtraidos);
              }
              
              // Store adicionais if found
              if (adicionaisExtraidos.length > 0) {
                decoracaoData.adicionaisDisponiveis = adicionaisExtraidos;
                console.log(`✅ ${adicionaisExtraidos.length} adicionais armazenados no contexto`);
              }
              
              appendFormData(decoracaoData, "dadosMontagem");
              
              // Set carousel images
              if (fullDecoracao.imagens && fullDecoracao.imagens.length > 0) {
                setSelectedBoloName(fullDecoracao.nome || decoracao.nome || "CARAMBOLO VINTAGE");
                const decoracaoSlides = fullDecoracao.imagens.map((imagem, index) => ({
                  id: index + 1,
                  image: typeof imagem === 'object' && imagem.url ? imagem.url : imagem,
                  title: `${fullDecoracao.nome} - ${index + 1}`
                }));
                setCarouselSlides(decoracaoSlides);
              }
            }
          } catch (error) {
            console.warn("Erro ao carregar decoração:", error);
          }
        };
        fetchDecoracao();
      }
    } else {
      // Original behavior: check localStorage for selectedBolo
      const selectedBolo = localStorage.getItem('selectedBolo');
      if (selectedBolo) {
        try {
          const bolo = JSON.parse(selectedBolo);
          if (bolo.produto || bolo.nome) {
            setSelectedBoloName(bolo.produto || bolo.nome);
          }
          if (bolo.imagens && bolo.imagens.length > 0) {
            const boloSlides = bolo.imagens.map((imagem, index) => ({
              id: index + 1,
              image: typeof imagem === 'object' && imagem.url ? imagem.url : imagem,
              title: `${bolo.produto || bolo.nome} - ${index + 1}`
            }));
            setCarouselSlides(boloSlides);
          }
          setTimeout(() => {
            const event = new CustomEvent('fillStep1FromBolo', { detail: bolo });
            window.dispatchEvent(event);
          }, 100);
          localStorage.removeItem('selectedBolo');
          window.scrollTo(0, 0);
        } catch {
          // Ignore JSON parse errors
        }
      }
    }
  }, [location.state?.decoracao?.id, appendFormData]);

  return (
    <div>
      <Header />
      <div className="max-w-screen mx-auto px-6 py-8 bg-bgNativeHome">
        <div className="flex items-center gap-12">
          <h1 className="text-blue font-bold text-4xl mb-6">{selectedBoloName.toUpperCase()}</h1>
          <p className="text-blue text-lg mb-8">
            Personalize seu bolo escolhendo tamanho, formato, massa e recheio
          </p>
        </div>
        <div className="grid grid-cols-8 gap-8">
          <div className="col-span-3">
            <Carousel slides={carouselSlides} imageHeightClass="h-[400px]" itemsPerView={1} showTitles={false} />
          </div>
          <div className="col-span-4 ml-8 mr-8 min-h-[32.625rem]">
            <StepComponent />
          </div>
          <div className="col-span-1">
            <Stepper currentStep={currentStep - 1} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const WrappedApplication = () => (
  <FormProvider>
    <Application />
  </FormProvider>
);

export default WrappedApplication;
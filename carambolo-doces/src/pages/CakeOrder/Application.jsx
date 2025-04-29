import React, { useEffect, useContext } from 'react';
import { FormProvider, FormContext } from '../../contexts/FormContext';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Stepper from "../../components/Stepper";
import Carousel from "../../components/Carousel";
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';

const steps = [Step1, Step2, Step3, Step4, Step5];

const Application = () => {
  const { currentStep, slides } = useContext(FormContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const StepComponent = steps[currentStep - 1];

  return (
    <div>
      <Header />
      <div className="max-w-screen mx-auto px-6 py-8 bg-bgNativeHome">
        <div className="flex items-center gap-12">
          <h1 className="text-blue font-bold text-4xl mb-6">CARAMBOLO VINTAGE</h1>
          <p className="text-blue text-lg mb-8">
            Frase específica para gerar um pouco de interação com o usuário
          </p>
        </div>
        <div className="grid grid-cols-8 gap-8">
          <div className="col-span-2 w-[25rem]">
            <Carousel slides={slides} />
          </div>
          <div className="col-span-5 ml-16 mr-8 min-h-[32.625rem]">
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
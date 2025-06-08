import React, { createContext, useState, useRef } from 'react';
import { useForm, FormProvider as RHFProvider } from 'react-hook-form';

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const methods = useForm({ defaultValues: {} });

  const formDataRef = useRef(new FormData());

  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const appendFormData = (data) => {
    for (const key in data) {
      formDataRef.current.append(key, data[key]);
    }
  };

  const submitForm = async () => {
    try {
      const response = await fetch('/your-endpoint', {
        method: 'POST',
        body: formDataRef.current,
      });
      if (!response.ok) {
        throw new Error('Erro ao enviar o formulário');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RHFProvider {...methods}>
      <FormContext.Provider value={{ currentStep, nextStep, prevStep, appendFormData, submitForm, formData: formDataRef.current }}>
        {children}
      </FormContext.Provider>
    </RHFProvider>
  );
};
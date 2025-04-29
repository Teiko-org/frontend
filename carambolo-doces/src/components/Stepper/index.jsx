import React from 'react';

const steps = [
  { name: "MONTAGEM", completed: true },
  { name: "DECORAÇÃO", completed: false },
  { name: "ADICIONAIS", completed: false },
  { name: "DADOS ENTREGA", completed: false },
  { name: "REVISAR PEDIDO", completed: false }
];

const Stepper = ({ currentStep }) => {
  return (
    <div className="flex flex-col items-end">
      {steps.map((step, index) => {
        const isCurrent = currentStep === index;
        return (
          <div className="flex mb-2" key={index}>
            <span
              className={`mr-4 mt-1 text-right whitespace-nowrap ${
                isCurrent ? 'text-blue font-bold' : 'text-blue'
              }`}
            >
              {step.name}
            </span>
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  isCurrent ? 'bg-pink border-blue' : 'bg-blue border-gold'
                }`}
              >
                {isCurrent && (
                  <div className="w-4 h-4 bg-pink rounded-full"></div>
                )}
              </div>
              {index !== steps.length - 1 && (
                <div className="h-16 border-l-2 border-gold"></div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
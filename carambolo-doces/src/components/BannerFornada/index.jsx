import React, { useState, useEffect } from 'react';
import { getFornadaAtiva } from '../../service/fornadaService';

const BannerFornada = ({ fornada }) => {
  const [fornadaData, setFornadaData] = useState(fornada);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!fornada) {
      const fetchFornadaAtiva = async () => {
        try {
          const fornadaAtiva = await getFornadaAtiva();
          if (fornadaAtiva && fornadaAtiva.dataFim) {
            setFornadaData(fornadaAtiva);
          }
        } catch (error) {
          console.error('Erro ao buscar fornada ativa:', error);
        }
      };
      fetchFornadaAtiva();
    } else {
      setFornadaData(fornada);
    }
  }, [fornada]);

  useEffect(() => {
    if (!fornadaData || !fornadaData.dataFim) {
      return;
    }

    const calculateTimeLeft = () => {
      let endDate;
      const dataFim = fornadaData.dataFim;
      
      if (dataFim.includes('T') || dataFim.includes(' ')) {
        endDate = new Date(dataFim);
      } else {
        endDate = new Date(dataFim + "T23:59:59");
      }
      
      if (isNaN(endDate.getTime())) {
        console.error('❌ Data inválida para timer:', dataFim);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [fornadaData]);

  const formatEndDate = () => {
    if (!fornadaData || !fornadaData.dataFim) {
      return "";
    }
    
    const date = new Date(fornadaData.dataFim);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <section className="relative h-[150px] w-full bg-cover bg-center m-auto items-end" style={{ backgroundImage: 'url(src/assets/img_banner_fornada.png)' }}>
      <div className="flex justify-between h-full w-full items-center justify-end pl-[300px] pr-[70px]">
        <div className="text-white flex flex-col w-1/2 mx-auto">
          <h2 className="text-xl font-bold mb-2 text-pink">Fornada</h2>
          <p>Aproveite a nossa Fornada com doces exclusivos!</p>
          <p>Disponível por tempo limitado até {formatEndDate()}</p>
        </div>
        <div className="text-white text-2xl flex gap-x-8">
          <span>{String(timeLeft.days).padStart(2, '0')}D</span>
          <span>:</span>
          <span>{String(timeLeft.hours).padStart(2, '0')}H</span>
          <span>:</span>
          <span>{String(timeLeft.minutes).padStart(2, '0')}M</span>
          <span>:</span>
          <span>{String(timeLeft.seconds).padStart(2, '0')}S</span>
        </div>
      </div>
    </section>
  );
};

export default BannerFornada;
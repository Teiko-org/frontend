import React, { useState, useEffect } from 'react';
import { getFornadaAtiva } from '../../service/fornadaService';
import bannerFornada from '../../assets/img_banner_fornada.png';

const BannerFornada = ({ fornada }) => {
  const [fornadaData, setFornadaData] = useState(fornada);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isFornadaFutura, setIsFornadaFutura] = useState(false);

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
        const [y, m, d] = String(dataFim).split('-').map(Number);
        endDate = new Date(y, m - 1, d, 23, 59, 59, 999);
      }
      
      if (isNaN(endDate.getTime())) {
        console.error('❌ Data inválida para timer:', dataFim);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const now = new Date();
      
      // Verificar se a fornada ainda não começou (é futura)
      const [yi, mi, di] = String(fornadaData.dataInicio).split('-').map(Number);
      const dataInicio = new Date(yi, mi - 1, di, 0, 0, 0, 0);
      const isFutura = now < dataInicio;
      setIsFornadaFutura(isFutura);
      
      // Se for futura, calcular tempo até o início
      const targetDate = isFutura ? dataInicio : endDate;
      const difference = targetDate.getTime() - now.getTime();

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
    
    const [y, m, d] = String(fornadaData.dataFim).split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('pt-BR');
  };

  const formatStartDate = () => {
    if (!fornadaData || !fornadaData.dataInicio) {
      return "";
    }
    
    const [y, m, d] = String(fornadaData.dataInicio).split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('pt-BR');
  };

  const isAtivaAgora = (() => {
    try {
      if (!fornadaData?.dataInicio || !fornadaData?.dataFim) return false;
      const [yi, mi, di] = String(fornadaData.dataInicio).split('-').map(Number);
      const [yf, mf, df] = String(fornadaData.dataFim).split('-').map(Number);
      const ini = new Date(yi, mi - 1, di, 0, 0, 0, 0);
      const fim = new Date(yf, mf - 1, df, 23, 59, 59, 999);
      const now = new Date();
      return now >= ini && now <= fim;
    } catch { return false; }
  })();

  const timerLegenda = isFornadaFutura
    ? 'Até a próxima fornada'
    : isAtivaAgora
      ? 'Tempo restante'
      : 'Aguardando próxima fornada';

  return (
    <section
      className="relative h-[150px] w-full bg-cover bg-center m-auto items-end"
      style={{ backgroundImage: `url(${bannerFornada})` }}
    >
      <div className="flex justify-between h-full w-full items-center pl-[350px] pr-[70px]">
        <div className="text-white flex flex-col w-1/2 mx-auto justify-center">
          <h2 className="text-xl font-bold mb-3 text-pink">Fornada</h2>
          {(() => {
            if (isFornadaFutura && fornadaData) {
              return (
                <>
                  <p className="mb-2">Nova fornada chegando em breve!</p>
                  <p className="mb-2">
                    Inicia em {formatStartDate()} e vai até {formatEndDate()} (fim da sessão de fornadas)
                  </p>
                </>
              );
            }
            if (isAtivaAgora && fornadaData) {
              return (
                <>
                  <p className="mb-2">Aproveite a nossa Fornada com doces exclusivos!</p>
                  <p>
                    Disponível por tempo limitado até {formatEndDate()} (fim da sessão de fornadas)
                  </p>
                </>
              );
            }
            // Nenhuma fornada ativa ou futura conhecida
            return (
              <>
                <p className="mb-2">Fique atento! Em breve teremos uma nova fornada.</p>
              </>
            );
          })()}
        </div>
        {fornadaData && (
          <div className="text-white flex flex-col items-center">
            <div className="text-2xl flex gap-x-8">
              <span>{String(timeLeft.days).padStart(2, '0')}D</span>
              <span>:</span>
              <span>{String(timeLeft.hours).padStart(2, '0')}H</span>
              <span>:</span>
              <span>{String(timeLeft.minutes).padStart(2, '0')}M</span>
              <span>:</span>
              <span>{String(timeLeft.seconds).padStart(2, '0')}S</span>
            </div>
            <span className="text-sm mt-1">{timerLegenda}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default BannerFornada;
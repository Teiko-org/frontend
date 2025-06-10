import React, { useState, useEffect } from 'react';
import { getLastFornada } from '../../service/fornadaService';

const BannerFornada = () => {
  const [dataFim, setDataFim] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});

  // Busca a última fornada e salva a dataFim
  useEffect(() => {
    const fetchLastFornada = async () => {
      const lastFornada = await getLastFornada();
      if (lastFornada && lastFornada.dataFim) {
        setDataFim(lastFornada.dataFim);
      }
    };
    fetchLastFornada();
  }, []);

  // Calcula o tempo restante sempre que dataFim mudar
  useEffect(() => {
    if (!dataFim) return;

    const calculateTimeLeft = () => {
      const endDate = new Date(dataFim);
      const now = new Date();
      const difference = endDate - now;
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return timeLeft;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [dataFim]);

  return (
    <section className="relative h-[150px] w-full bg-cover bg-center m-auto items-end" style={{ backgroundImage: 'url(src/assets/img_banner_fornada.png)' }}>
      <div className="flex justify-between h-full w-full items-center justify-end pl-[300px] pr-[70px]">
        <div className="text-white flex flex-col w-1/2 mx-auto">
          <h2 className="text-xl font-bold mb-2 text-pink">Fornada</h2>
          <p>Aproveite a nossa Fornada com doces exclusivos!</p>
          <p>Disponível por tempo limitado até {dataFim ? new Date(dataFim).toLocaleDateString() : '--/--/----'}</p>
        </div>
        <div className="text-white text-2xl flex gap-x-8">
          <span>{timeLeft.days || '0'}D</span>
          <span>:</span>
          <span>{timeLeft.hours || '0'}H</span>
          <span>:</span>
          <span>{timeLeft.minutes || '0'}M</span>
          <span>:</span>
          <span>{timeLeft.seconds || '0'}S</span>
        </div>
      </div>
    </section>
  );
};


export default BannerFornada;
import React, { useState, useEffect } from 'react';

const BannerFornada = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[150px] w-full bg-cover bg-center m-auto items-end" style={{ backgroundImage: 'url(src/assets/img_banner_fornada.png)' }}>
      <div className="flex justify-between h-full w-full items-center justify-end pl-[300px] pr-[70px]">
        <div className="text-white flex flex-col w-1/2 mx-auto">
          <h2 className="text-xl font-bold mb-2 text-pink">Fornada</h2>
          <p>Aproveite a nossa Fornada com doces exclusivos!</p>
          <p>Disponível por tempo limitado até 02/05/2025</p>
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

const calculateTimeLeft = () => {
  const endDate = new Date("2025-05-02:00:00");
  const difference = +endDate - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export default BannerFornada;
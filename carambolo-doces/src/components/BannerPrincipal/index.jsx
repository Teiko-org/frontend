import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const BannerPrincipal = () => {
  return (
    <section className="relative h-[450px] bg-cover bg-center" style={{ backgroundImage: 'url(src/assets/img_banner.png)' }}>
      <div className="absolute inset-0 flex items-center justify-end px-24">
        <div className="relative">
          <img
            src="src/assets/banner_card.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-transparent">
            <p className="text-center text-xl px-16 py-4 bg-blueMedium">
              Na carambolo você pode personalizar o seu bolo para ficar com a
              sua cara!
            </p>
          </div>
          <div className="absolute inset-0 flex justify-center items-end pb-10">
            <button className="flex items-center space-x-2 justify-center bg-gradient-to-l from-gold to-darkGold text-blue font-bold border-gold border-2 py-2 px-6 rounded-full shadow-lg">
              <span className="uppercase">Ver Temas</span>
              <span>
                <FaArrowRight />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerPrincipal;
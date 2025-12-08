import React, { useEffect, useRef, useState } from "react";
import { BsFillArrowRightCircleFill, BsFillArrowLeftCircleFill } from "react-icons/bs";

export default function Carousel({ slides, autoPlay = true, interval = 4000, showIndicators = false, imageHeightClass = 'h-[270px]', itemsPerView = 3, showTitles = true, onSlideClick }) {
  const [current, setCurrent] = useState(0);
  const cardWidthPercent = itemsPerView === 1 ? 85 : 24;
  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const slidesContainerRef = useRef(null);
  const itemRefs = useRef([]);

  const previous = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleSlideClick = (slide) => {
    if (onSlideClick) {
      onSlideClick(slide);
    }
  };

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, interval);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [autoPlay, interval, slides.length]);

  // Calcular translateX em pixels quando current mudar
  useEffect(() => {
    if (!containerRef.current || !slidesContainerRef.current || slides.length <= itemsPerView) {
      return;
    }

    const updateTranslate = () => {
      const container = containerRef.current;
      const slidesContainer = slidesContainerRef.current;
      
      if (!container || !slidesContainer) return;

      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const slidesContainerWidth = slidesContainer.scrollWidth;
      
      if (slidesContainerWidth <= containerWidth) {
        slidesContainer.style.transform = 'translateX(0px)';
        return;
      }

      // Calcular gap e largura do card em pixels
      const gapPx = itemsPerView === 1 ? 8 : 54;
      const cardPaddingPx = 8;
      const cardWidthPx = (containerWidth * cardWidthPercent) / 100;
      const itemTotalWidth = cardWidthPx + (cardPaddingPx * 2) + gapPx;

      // Calcular posição desejada para centralizar o item atual
      let desiredPx = current * itemTotalWidth + cardWidthPx / 2 + cardPaddingPx - containerWidth / 2;

      // Calcular maxTranslate primeiro
      const maxTranslatePx = slidesContainerWidth - containerWidth;
      
      // Se estamos nos últimos itens, garantir que o último item fique totalmente visível
      const lastVisibleIndex = slides.length - itemsPerView;
      let clampedPx;
      
      if (current >= lastVisibleIndex) {
        // Primeiro, aplicar maxTranslatePx
        clampedPx = maxTranslatePx;
        slidesContainer.style.transform = `translateX(-${clampedPx}px)`;
        
        // Aguardar um frame e verificar se o último item está visível
        requestAnimationFrame(() => {
          if (itemRefs.current[slides.length - 1]) {
            const lastItem = itemRefs.current[slides.length - 1];
            const lastItemRect = lastItem.getBoundingClientRect();
            const containerRight = containerRect.right;
            const containerPaddingRight = itemsPerView === 1 ? 16 : 48;
            const visibleRight = containerRight - containerPaddingRight;
            
            // Se o último item ainda está cortado
            if (lastItemRect.right > visibleRight) {
              // Calcular o translateX atual do slidesContainer
              const slidesContainerRect = slidesContainer.getBoundingClientRect();
              const currentTranslate = containerRect.left - slidesContainerRect.left;
              
              // Calcular quanto mais precisamos mover
              const overflow = lastItemRect.right - visibleRight;
              const adjustedTranslate = currentTranslate + overflow;
              
              slidesContainer.style.transform = `translateX(-${adjustedTranslate}px)`;
            }
          }
        });
        
        return; // Já aplicamos o transform acima
      } else {
        // Para outros itens, calcular normalmente
        clampedPx = Math.min(Math.max(desiredPx, 0), maxTranslatePx);
      }
      
      slidesContainer.style.transform = `translateX(-${clampedPx}px)`;
    };

    // Aguardar frames para garantir que o DOM esteja atualizado
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(updateTranslate);
      });
    });
  }, [current, slides.length, cardWidthPercent, itemsPerView]);

  return (
    <div ref={containerRef} className="relative w-full overflow-x-hidden overflow-y-visible pb-8" style={{ overflow: 'hidden' }}>
      <div
        ref={slidesContainerRef}
        className={`flex transition-transform ease-out duration-500 ${itemsPerView === 1 ? 'gap-x-8 px-4' : 'gap-x-[54px] px-6 md:px-12'}`}
        style={{ overflow: 'visible' }}
      >
        {slides.map((slide, index) => {
          const isCenter = index === current;
          const cardClasses = isCenter
            ? "scale-[1.02] translate-y-3 z-20 shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
            : "scale-[0.98] -translate-y-1 z-10 opacity-95 shadow-[0_6px_14px_rgba(0,0,0,0.12)]";

          return (
            <div
              key={`${slide.title ?? 'slide'}-${index}`}
              ref={(el) => {
                if (el) itemRefs.current[index] = el;
              }}
              className="flex-none flex justify-center"
              style={{ width: `${cardWidthPercent}%`, overflow: 'visible', padding: '8px' }}
            >
              <div
                className={`relative rounded-lg overflow-hidden border border-gold bg-white transition-all duration-500 ${cardClasses} ${onSlideClick ? 'cursor-pointer' : ''}`}
                style={{ overflow: 'visible' }}
                onClick={() => handleSlideClick(slide)}
              >
                <img
                  src={slide.image}
                  alt={slide.title || `Slide ${index + 1}`}
                  className={`w-full object-cover ${imageHeightClass}`}
                  onError={(e) => {
                    console.warn(`Erro ao carregar imagem do slide ${index + 1}`);
                  }}
                />
                {showTitles && slide.title && (
                  <div className={`absolute left-1/2 -translate-x-1/2 ${
                    isCenter ? 'bottom-3' : 'bottom-4'
                  } w-full flex justify-center px-2`}>
                    <span
                      title={slide.title}
                      className={`inline-block rounded-[12px] border border-[#D4B076] shadow-[0_4px_12px_rgba(0,0,0,0.16)] backdrop-blur-sm font-montserrat font-normal whitespace-nowrap overflow-hidden text-ellipsis leading-tight ${
                        isCenter
                          ? 'px-5 py-2 text-[clamp(12px,1.1vw,16px)] max-w-[88%]'
                          : 'px-4 py-1.5 text-[clamp(10px,0.95vw,14px)] max-w-[80%]'
                      }`}
                      style={{
                        background: 'rgba(255, 232, 196, 0.8)',
                        color: '#8A541C',
                      }}
                    >
                      {slide.title}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        aria-label="anterior"
        onClick={previous}
        className="absolute top-1/2 -translate-y-1/2 z-40 text-3xl text-gold hover:scale-110 transition-transform"
        style={{ left: '16px' }}
      >
        <BsFillArrowLeftCircleFill />
      </button>
      <button
        aria-label="próximo"
        onClick={next}
        className="absolute top-1/2 -translate-y-1/2 z-40 text-3xl text-gold hover:scale-110 transition-transform"
        style={{ right: '16px' }}
      >
        <BsFillArrowRightCircleFill />
      </button>

      {showIndicators && (
        <div className="absolute bottom-0 py-2 flex justify-center gap-2 w-full">
          {slides.map((_, i) => (
            <button
              aria-label={`ir para slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              key={`dot-${i}`}
              className={`rounded-full w-2 h-2 ${i === current ? 'bg-gold' : 'bg-blue'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

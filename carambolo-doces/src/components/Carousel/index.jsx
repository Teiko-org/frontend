import React, { useEffect, useRef, useState } from "react";
import { BsFillArrowRightCircleFill, BsFillArrowLeftCircleFill } from "react-icons/bs";

export default function Carousel({ slides, autoPlay = true, interval = 4000, showIndicators = false, imageHeightClass = 'h-[270px]', itemsPerView = 3, showTitles = true, onSlideClick }) {
  const [current, setCurrent] = useState(0);
  const cardWidthPercent = itemsPerView === 1 ? 100 : 24;
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
    if (!containerRef.current || !slidesContainerRef.current) {
      return;
    }

    const updateTranslate = () => {
      const container = containerRef.current;
      const slidesContainer = slidesContainerRef.current;
      
      if (!container || !slidesContainer) return;

      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      
      // Se itemsPerView === 1, não fazer nenhuma transformação
      // O slide atual já é renderizado e está centralizado via flexbox
      if (itemsPerView === 1) {
        slidesContainer.style.transform = 'translateX(0px)';
        return;
      }
      
      const slidesContainerWidth = slidesContainer.scrollWidth;
      
      if (slidesContainerWidth <= containerWidth) {
        slidesContainer.style.transform = 'translateX(0px)';
        return;
      }
      
      if (slidesContainerWidth <= containerWidth) {
        slidesContainer.style.transform = 'translateX(0px)';
        return;
      }

      // Calcular gap e largura do card em pixels
      const gapPx = 54;
      const cardPaddingPx = 8;
      // Usar largura fixa do card (280px) igual ao card de CARAMBOLOS MAIS PEDIDOS
      const cardWidthPx = itemsPerView > 1 ? 280 : (containerWidth * cardWidthPercent) / 100;
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
    <div ref={containerRef} className="relative w-full overflow-hidden pb-8 flex justify-center" style={{ paddingLeft: '0', paddingRight: '0' }}>
      <div
        ref={slidesContainerRef}
        className={`flex transition-transform ease-out duration-500 ${itemsPerView === 1 ? 'justify-center items-center' : 'gap-x-[54px] px-6 md:px-12'}`}
        style={{ 
          overflow: 'visible',
          width: itemsPerView === 1 ? '100%' : 'auto'
        }}
      >
        {slides.map((slide, index) => {
          const isCenter = index === current;
          
          // Se itemsPerView === 1, renderizar apenas o slide atual
          if (itemsPerView === 1 && !isCenter) {
            return null;
          }
          
          // Destaque visual para o item ativo quando itemsPerView > 1
          const cardClasses = itemsPerView === 1
            ? "z-20"
            : (isCenter
                ? "z-20 scale-[1.05] shadow-[0_12px_24px_rgba(0,0,0,0.2)] border-2"
                : "z-10 scale-[0.95] opacity-80");

          return (
            <div
              key={`${slide.title ?? 'slide'}-${index}`}
              ref={(el) => {
                if (el) itemRefs.current[index] = el;
              }}
              className="flex-none flex justify-center items-center"
              style={{ 
                width: itemsPerView === 1 ? '280px' : '296px', 
                overflow: 'visible', 
                padding: '8px',
                flexShrink: 0,
                minWidth: itemsPerView === 1 ? '280px' : '296px',
                maxWidth: itemsPerView === 1 ? '280px' : '296px',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              <div
                className={`relative rounded-lg overflow-hidden border border-gold bg-white transition-all duration-500 ${cardClasses} ${onSlideClick ? 'cursor-pointer' : ''}`}
                style={{ 
                  overflow: 'hidden',
                  width: '280px',
                  maxWidth: '280px',
                  height: showTitles ? '320px' : '300px',
                  alignSelf: 'center',
                  boxShadow: isCenter && itemsPerView > 1 ? '0 12px 24px rgba(0, 0, 0, 0.2)' : '0 6px 14px rgba(0, 0, 0, 0.12)',
                  borderWidth: isCenter && itemsPerView > 1 ? '2px' : '1px'
                }}
                onClick={() => handleSlideClick(slide)}
              >
                <div className="relative w-full" style={{ height: '100%' }}>
                  <img
                    src={slide.image}
                    alt={slide.title || `Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                    style={{
                      display: 'block',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      width: '100%',
                      height: '100%'
                    }}
                    onError={(e) => {
                      console.warn(`Erro ao carregar imagem do slide ${index + 1}`);
                    }}
                  />
                  {showTitles && slide.title && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-3 w-full flex justify-center px-2">
                      <span
                        title={slide.title}
                        className="inline-block rounded-[12px] border border-[#D4B076] shadow-[0_4px_12px_rgba(0,0,0,0.16)] backdrop-blur-sm font-montserrat font-normal whitespace-nowrap overflow-hidden text-ellipsis leading-tight px-5 py-2 text-[clamp(12px,1.1vw,16px)] max-w-[88%]"
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
            </div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <>
          <button
            aria-label="anterior"
            onClick={previous}
            className="absolute top-1/2 z-40 text-4xl text-gold hover:scale-110 transition-transform"
            style={{ 
              left: itemsPerView === 1 ? '16px' : '16px',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <BsFillArrowLeftCircleFill />
          </button>
          <button
            aria-label="próximo"
            onClick={next}
            className="absolute top-1/2 z-40 text-4xl text-gold hover:scale-110 transition-transform"
            style={{ 
              right: itemsPerView === 1 ? '16px' : '16px',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <BsFillArrowRightCircleFill />
          </button>
        </>
      )}

      {showIndicators && slides.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 py-2 flex justify-center gap-2 z-30">
          {slides.map((_, i) => (
            <button
              aria-label={`ir para slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              key={`dot-${i}`}
              className={`rounded-full w-2.5 h-2.5 transition-all ${i === current ? 'bg-gold w-3 h-3' : 'bg-blue opacity-60 hover:opacity-100'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

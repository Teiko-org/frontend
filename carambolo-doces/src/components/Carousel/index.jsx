import React, { useEffect, useMemo, useRef, useState } from "react";
import { BsFillArrowRightCircleFill, BsFillArrowLeftCircleFill } from "react-icons/bs";

export default function Carousel({ slides, autoPlay = true, interval = 4000, showIndicators = false }) {
  const [current, setCurrent] = useState(0);
  const cardWidthPercent = 30.5;
  const timerRef = useRef(null);

  const previous = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, interval);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [autoPlay, interval, slides.length]);

  const translatePercent = useMemo(() => {
    const totalWidth = slides.length * cardWidthPercent;
    const maxTranslate = Math.max(0, totalWidth - 100);
    const desired = current * cardWidthPercent + cardWidthPercent / 2 - 50;
    const clamped = Math.min(Math.max(desired, 0), maxTranslate);
    return clamped;
  }, [current, slides.length]);

  return (
    <div className="relative w-full overflow-x-hidden overflow-y-visible pb-12">
      <div
        className="flex transition-transform ease-out duration-500 gap-x-[54px] px-6 md:px-12"
        style={{ transform: `translateX(-${translatePercent}%)` }}
      >
        {slides.map((slide, index) => {
          const isCenter = index === current;
          const cardClasses = isCenter
            ? "scale-[1.02] translate-y-3 z-20 shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
            : "scale-[0.98] -translate-y-1 z-10 opacity-95 shadow-[0_6px_14px_rgba(0,0,0,0.12)]";

          return (
            <div
              key={`${slide.title ?? "slide"}-${index}`}
              className="flex-none"
              style={{ width: `${cardWidthPercent}%` }}
            >
              <div
                className={`relative rounded-lg overflow-hidden border border-gold bg-white transition-all duration-500 ${cardClasses}`}
              >
                <img
                  src={slide.image}
                  alt={slide.title || `Slide ${index + 1}`}
                  className="w-full h-[320px] object-cover"
                />
                {slide.title && (
                  <div className={`absolute left-1/2 -translate-x-1/2 ${
                    isCenter ? "bottom-3" : "bottom-4"
                  }`}>
                    <span
                      className={`inline-block rounded-[12px] border border-[#D4B076] shadow-[0_4px_12px_rgba(0,0,0,0.16)] backdrop-blur-sm font-montserrat font-normal ${
                        isCenter
                          ? "px-5 py-2 text-base"
                          : "px-4 py-1.5 text-sm"
                      }`}
                      style={{
                        background: "rgba(255, 232, 196, 0.8)",
                        color: "#8A541C",
                        lineHeight: 1.2,
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
        style={{ left: "16px" }}
      >
        <BsFillArrowLeftCircleFill />
      </button>
      <button
        aria-label="próximo"
        onClick={next}
        className="absolute top-1/2 -translate-y-1/2 z-40 text-3xl text-gold hover:scale-110 transition-transform"
        style={{ right: "16px" }}
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
              className={`rounded-full w-2 h-2 ${i === current ? "bg-gold" : "bg-blue"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
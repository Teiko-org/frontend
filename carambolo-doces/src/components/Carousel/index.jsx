import { useState } from "react";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
} from "react-icons/bs";

export default function Carousel({ slides = ["src/assets/image_cake.png", "src/assets/image_cake.png", "src/assets/image_cake.png"] }) {
  let [current, setCurrent] = useState(0);

  let previousSlide = () => {
    if (current === 0) setCurrent(slides.length - 1);
    else setCurrent(current - 1);
  };

  let nextSlide = () => {
    if (current === slides.length - 1) setCurrent(0);
    else setCurrent(current + 1);
  };

  return (
    <div className="overflow-hidden relative">
      <div
        className="flex transition ease-out duration-300"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {slides.map((s, index) => (
          <img key={index} src={s} alt={`Imagem Ilustrativa ${index}`} />
        ))}
      </div>

      <div className="absolute top-0 h-full w-full justify-between items-center flex text-pink px-6 text-2xl">
        <button onClick={previousSlide}>
          <BsFillArrowLeftCircleFill/>
        </button>
        <button onClick={nextSlide}>
          <BsFillArrowRightCircleFill />
        </button>
      </div>

      <div className="absolute bottom-0 py-4 flex justify-center gap-3 w-full">
        {slides.map((s, i) => (
          <div
            onClick={() => { setCurrent(i); }}
            key={"circle" + i}
            className={`rounded-full w-3 h-3 cursor-pointer mb-4 ${i === current ? "bg-pink" : "bg-blue"}`}
          ></div>
        ))}
      </div>
    </div>
  );
}
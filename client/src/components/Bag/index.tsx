import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { SDK } from "@dojoengine/sdk";
import { Beast, Schema } from "../../dojo/bindings.ts";
import { useBeast } from '../../hooks/useBeasts.tsx';
import initials from "../../data/initials.tsx";
import './main.css';

function Bag({ sdk }: { sdk: SDK<Schema> }) {
  const { beasts } = useBeast(sdk);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = beasts.length;
  const touchStartX = useRef<number | null>(null); 
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchEndX.current - touchStartX.current;

      if (deltaX > 50) {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (deltaX < -50) {
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const getSlideContent = (beast: typeof beasts[0]) => (
    <div className="beast-slide">
      <div className="beast">
        <div className="beast-header">
          <h2>{beast.name}</h2>
        </div>
        <div className="beast-pic d-flex align-items-end">
          <img src={initials[beast.specie - 1].idlePicture} alt="beast" />
        </div>
        <div className="beast-description-container">
          <p className="beast-description">{beast.description}</p>
        </div>
        <div className="spawn-button-container">
          <Link to={`/play/${beast.beast_id}`} className="spawn-button">
            PLAY
          </Link>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const bodyElement = document.querySelector('.body') as HTMLElement;
    if (bodyElement) {
      bodyElement.classList.remove('day', 'night');
      bodyElement.style.backgroundSize = 'cover';
    }
  }, []);

  return (
    <div className="bag">
      <div className="eggs">
        <div className="carousel">
          <div
            className="slides"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {beasts.map((beast: Beast, index:number) => (
              <div key={index} className="slide">
                {getSlideContent(beast)}
              </div>
            ))}
          </div>
          <div className="carousel-controls">
            <div className="indicators">
              {beasts.map((_: any, index:number) => (
                <div
                  key={index}
                  className={`indicator ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bag;

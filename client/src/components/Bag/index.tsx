import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { SDK } from "@dojoengine/sdk";
import { Beast, Schema } from "../../dojo/bindings.ts";
import { useBeast } from "../../hooks/useBeasts.tsx";
import ControllerConnectButton from "../CartridgeController/ControllerConnectButton.tsx";
import initials from "../../data/initials.tsx";
import "./main.css";

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

  const getSlideContent = (beast: (typeof beasts)[0]) => (
    <>
      <div className="beast-slide">
        <div className="beast">
          <div className="beast-header">
            <h2>{beast.name}</h2>
          </div>
          <div className="beast-pic d-flex align-items-end">
            <img src={initials[beast.specie - 1].idlePicture} alt="beast" />
          </div>
          <div className="initial-info">
            <h4>
              {initials[beast.specie - 1].name} Lvl {beast.level}
            </h4>
            <p>
              Your are close to evolve {initials[beast.specie - 1].name}, keep
              playing to reach the next level
            </p>
          </div>
          <Link to={`/play/${beast.beast_id}`} className="button">
            PLAY
          </Link>
        </div>
      </div>
    </>
  );

  useEffect(() => {
    const bodyElement = document.querySelector(".body") as HTMLElement;
    if (bodyElement) {
      bodyElement.classList.remove("day", "night");
      bodyElement.style.backgroundSize = "cover";
      bodyElement.style.padding = "80px 15px 30px";
    }
  }, []);

  return (
    <div className="bag">
      <div className="d-flex justify-content-between align-items-center">
        <p className={"title"}>
          Collect them all!
          <span className="d-block">There are many species</span>
        </p>
        <ControllerConnectButton />
      </div>
      <div className="carousel">
        <div
          className="slides"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {beasts.map((beast: Beast, index: number) => (
            <div key={index} className="slide">
              {getSlideContent(beast)}
            </div>
          ))}
        </div>
        <div className="carousel-controls">
          <div className="indicators">
            {beasts.map((_: any, index: number) => (
              <div
                key={index}
                className={`indicator ${currentSlide === index ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bag;

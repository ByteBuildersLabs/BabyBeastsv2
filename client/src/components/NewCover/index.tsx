import { useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import SpawnBeast from "../SpawnBeast/index.tsx";
import { DeveloperCode } from "../DeveloperCode/index.tsx";
import "./styles.css";

const VennDiagram = () => {
  const { account } = useAccount();
  const [currentCircle, setCurrentCircle] = useState("play");
  const [showDeveloperCode, setShowDeveloperCode] = useState(false);

  useEffect(() => {
    const bodyElement = document.querySelector(".body") as HTMLElement;
    bodyElement.style.padding = "0";
  }, []);

  useEffect(() => {
    const sequence = ["play", "raise", "evolve"];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % sequence.length;
      setCurrentCircle(sequence[currentIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (account) {
    return <SpawnBeast />;
  }

  return (
    <div className="venn-container">
      <h1 className="venn-title">Your Baby Beast Awaits!</h1>

      <div className="venn-diagram">
        <svg viewBox="0 0 400 400">
          <defs>
            <radialGradient
              id="raiseGradient"
              gradientUnits="userSpaceOnUse"
              cx="200"
              cy="160"
              r="100"
              fx="200"
              fy="160"
            >
              <stop offset="0%" stopColor="#ff69b4" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#ff69b4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ff69b4" stopOpacity="0" />
            </radialGradient>

            <radialGradient
              id="playGradient"
              gradientUnits="userSpaceOnUse"
              cx="130"
              cy="280"
              r="100"
              fx="130"
              fy="280"
            >
              <stop offset="0%" stopColor="#9370db" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#9370db" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#9370db" stopOpacity="0" />
            </radialGradient>

            <radialGradient
              id="evolveGradient"
              gradientUnits="userSpaceOnUse"
              cx="270"
              cy="280"
              r="100"
              fx="270"
              fy="280"
            >
              <stop offset="0%" stopColor="#87ceeb" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#87ceeb" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#87ceeb" stopOpacity="0" />
            </radialGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Estrellas */}
          <g className="stars">
            {/* Izquierda */}
            <circle className="star" cx="50" cy="150" r="3" />
            <circle className="star" cx="70" cy="180" r="2" />
            <path
              className="twinkle"
              transform="translate(10)"
              d="M60 130 L65 140 L70 130 L65 120 Z"
            />

            {/* Derecha */}
            <circle className="star" cx="350" cy="180" r="3" />
            <circle className="star" cx="325" cy="140" r="2" />
            <path
              className="twinkle"
              transform="translate(-25, 40)"
              d="M340 130 L345 140 L350 130 L345 120 Z"
            />
          </g>

          {/* Diagrama Venn */}
          <g className="circle-group">
            <circle cx="200" cy="160" r="100" className="circle-base" />
            <circle
              cx="200"
              cy="160"
              r="100"
              fill="url(#raiseGradient)"
              className={`circle-gradient ${currentCircle === "raise" ? "active" : ""}`}
              filter="url(#glow)"
            />
            <text x="200" y="160" className="circle-text">
              RAISE
            </text>
          </g>

          <g className="circle-group">
            <circle cx="130" cy="280" r="100" className="circle-base" />
            <circle
              cx="130"
              cy="280"
              r="100"
              fill="url(#playGradient)"
              className={`circle-gradient ${currentCircle === "play" ? "active" : ""}`}
              filter="url(#glow)"
            />
            <text x="130" y="280" className="circle-text">
              PLAY
            </text>
          </g>

          <g className="circle-group">
            <circle cx="270" cy="280" r="100" className="circle-base" />
            <circle
              cx="270"
              cy="280"
              r="100"
              fill="url(#evolveGradient)"
              className={`circle-gradient ${currentCircle === "evolve" ? "active" : ""}`}
              filter="url(#glow)"
            />
            <text x="270" y="280" className="circle-text">
              EVOLVE
            </text>
          </g>
        </svg>
      </div>
      <div className="mt-4 px-3 w-100">
        <button
          className="button mb-4"
          onClick={() => setShowDeveloperCode(true)}
        >
          CONNECT
        </button>
        {showDeveloperCode && <DeveloperCode />}
      </div>
    </div>
  );
};

export default VennDiagram;

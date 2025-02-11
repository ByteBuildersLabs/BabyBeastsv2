// PokedexGrid.tsx
import React, { useState, useEffect } from 'react';
import beastsData from '../../data/dex/BeastsDex.json';
import DexCarousel from './index';
import './pokedexGrid.css';

interface Beast {
  Name: string;
  BeastsType: string;
  // ... (otros campos si los necesitas)
}

interface BeastWithIndex {
  beast: Beast;
  index: number;
}

const PokedexGrid: React.FC = () => {
  const [beastImages, setBeastImages] = useState<Record<string, string>>({});
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Cargamos las imágenes de cada beast
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: Record<string, string> = {};
      for (const beast of beastsData.BeastsDex) {
        try {
          const imagePath = `../../assets/beasts/${beast.Name}-idle.gif`;
          const imageModule = await import(/* @vite-ignore */ imagePath);
          loadedImages[beast.Name] = imageModule.default;
        } catch (error) {
          console.error(`Error loading image for ${beast.Name}:`, error);
          loadedImages[beast.Name] = '';
        }
      }
      setBeastImages(loadedImages);
    };

    loadImages();
  }, []);

  // Agregamos el índice a cada beast para mantener el orden original
  const beastsWithIndex: BeastWithIndex[] = beastsData.BeastsDex.map((beast, index) => ({
    beast,
    index,
  }));

  // Separamos los beasts en 3 filas (round-robin)
  const rows: BeastWithIndex[][] = [[], [], []];
  beastsWithIndex.forEach((item, idx) => {
    rows[idx % 3].push(item);
  });

  // Maneja el clic en una “card” del grid
  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
  };

  // Para volver al grid desde el detalle
  const handleCloseDetail = () => {
    setSelectedIndex(null);
  };

  return (
    <div className="container pokedex-grid-container">
      <h1 className="text-center my-4">BeastsDex</h1>
      {selectedIndex === null ? (
        // Renderizamos la vista de grid
        rows.map((row, rowIndex) => (
          <div className="row mb-4" key={rowIndex}>
            {row.map(({ beast, index }) => (
              <div className="col" key={index}>
                <div
                  className="card beast-card"
                  onClick={() => handleCardClick(index)}
                  style={{ cursor: 'pointer' }}
                >
                  {beastImages[beast.Name] ? (
                    <img
                      src={beastImages[beast.Name]}
                      className="card-img-top beast-card-img"
                      alt={beast.Name}
                    />
                  ) : (
                    <div className="beast-card-img-placeholder">No Image</div>
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{beast.Name}</h5>
                    <p className="card-text">{beast.BeastsType}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        // Renderizamos la vista de detalle con DexCarousel
        <div className="detail-view">
          <button className="btn btn-secondary mb-3" onClick={handleCloseDetail}>
            Volver
          </button>
          <DexCarousel initialSlide={selectedIndex} />
        </div>
      )}
    </div>
  );
};

export default PokedexGrid;

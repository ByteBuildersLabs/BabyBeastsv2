import React, { useState, useEffect, useRef } from 'react';
import './main.css';

function MemoryChallenge() {
  const initialGridSize = 2;
  const maxGridSize = 6;
  const [gridSize, setGridSize] = useState<number>(initialGridSize);
  const [cards, setCards] = useState<number[]>(Array(initialGridSize * initialGridSize).fill(0));
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isShowing, setIsShowing] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [sequenceLength, setSequenceLength] = useState<number>(2);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const colors = ['#f5c242', '#e4a101'];

  useEffect(() => {
    startNewGame();
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, [gridSize]);

  const startNewGame = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];

    const newSequence = Array.from({ length: sequenceLength }, () => Math.floor(Math.random() * (gridSize * gridSize)));
    setSequence(newSequence);
    setUserSequence([]);
    setMessage('');
    setCards(Array(gridSize * gridSize).fill(0));
    showSequence(newSequence);
  };

  const showSequence = (sequence: number[]) => {
    setIsShowing(true);
    let delay = 0;

    sequence.forEach((index, i) => {
      const showTimeout = setTimeout(() => {
        setCards(prev => prev.map((card, idx) => (idx === index ? 1 : card)));
        
        const hideTimeout = setTimeout(() => {
          setCards(prev => prev.map((card, idx) => (idx === index ? 0 : card)));
          if (i === sequence.length - 1) setIsShowing(false);
        }, 500);
        
        timeoutsRef.current.push(hideTimeout);
      }, delay);
      
      timeoutsRef.current.push(showTimeout);
      delay += 1000;
    });
  };

  const handleCardClick = (index: number) => {
    if (isShowing || userSequence.length >= sequence.length) return;

    setUserSequence([...userSequence, index]);

    if (sequence[userSequence.length] !== index) {
      setMessage('Incorrect! Try again.');
      setUserSequence([]);
    } else if (userSequence.length + 1 === sequence.length) {
      setUserSequence([]);
      setMessage('Next level');
      setSequenceLength(prev => prev + 1);
      if (gridSize < maxGridSize) {
        setGridSize(prev => prev + 1);
      }
      startNewGame();
    }
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100vh' }}>
      <h1>Memory Challenge</h1>
      {message && <div className="message">{message}</div>}
      <div className="card-grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gap: '10px' }}>
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card ${card ? 'active' : ''}`}
            style={{
              width: '60px',
              height: '60px',
              backgroundColor: card ? colors[index % colors.length] : undefined,
              backgroundImage: card ? undefined : 'url(src/assets/img/logo.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
      {message === 'Incorrect! Try again.' && (
        <button onClick={startNewGame} className="restart-button">Restart Game</button>
      )}
    </div>
  );
}

export default MemoryChallenge;

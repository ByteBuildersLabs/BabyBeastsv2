import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dragon from '/src/assets/img/logo.jpeg';
import './MiniGamesModal.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

export interface Game {
    id: string;
    title: string;
    image: string;
    isActive: boolean;
    route: string;
}

export const games: Game[] = [
    {
        id: 'dragon-eggs',
        title: 'Memory Challenge',
        image: '/src/assets/img/scenario-light.jpeg',
        isActive: true,
        route: '/'
    },
    {
        id: 'dark-forest',
        title: 'Dark Forest',
        image: '/path/to/dark-forest-image.jpg',
        isActive: false,
        route: '/games/dark-forest'
    },
    {
        id: 'fire-caves',
        title: 'Fire Caves',
        image: '/path/to/fire-caves-image.jpg',
        isActive: false,
        route: '/games/fire-caves'
    },
    {
        id: 'magic-portal',
        title: 'Magic Portal',
        image: '/path/to/magic-portal-image.jpg',
        isActive: false,
        route: '/games/magic-portal'
    },
    {
         id: 'magic-portal2',
        title: 'Magic Portal',
        image: '/path/to/magic-portal-image.jpg',
        isActive: false,
       route: '/games/magic-portal'
    }
];

interface MiniGamesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAction: () => void;
}

const MiniGamesModal: React.FC<MiniGamesModalProps> = ({ isOpen, onClose, onAction }) => {

    const navigate = useNavigate();
    const isSliderMode = games.length > 4;

    const onGameClick = (route: string) => {
        onClose();
        onAction();
        !isOpen && navigate(route); //modify when we have the routes and the games
    };

    const swiperConfig = {
        modules: [Navigation],
        spaceBetween: 30,
        slidesPerView: 4,
        navigation: true,
        grabCursor: true,
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            480: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 25
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 30
            }
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        isOpen && (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">Choose a Minigame</h2>
                    <button onClick={onClose} className="modal-close-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="games-container">
                    {isSliderMode ? (
                        <Swiper {...swiperConfig} className="games-slider">
                            {games.map((game) => (
                                <SwiperSlide key={game.id}>
                                    <GameCard {...game} onClick={() => onGameClick(game.route)} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="games-grid">
                            {games.map((game) => (
                                <GameCard key={game.id} {...game} onClick={() => onGameClick(game.route)} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
        )
    );
};

export default MiniGamesModal;

export interface GameCardProps {
    title: string;
    image: string;
    isActive: boolean;
    onClick?: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ title, image, isActive, onClick }) => {
    return (
        <div 
            className={`game-card ${isActive ? 'active' : 'locked'}`}
            onClick={isActive ? onClick : undefined}
        >
            <img src={!isActive ? dragon : image} alt={title} className="game-image" />
            <div className="game-info">
                {isActive && <h3 className="game-title">{title}</h3>}
                {isActive ? (
                    <button className="play-button">Click to Play</button>
                ) : (
                    <div className="coming-soon">
                        <svg className="lock-icon" viewBox="0 0 24 24">
                            <path d="M12 17a2 2 0 100-4 2 2 0 000 4z" />
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H8.9V6z" />
                        </svg>
                        <span>Coming Soon</span>
                    </div>
                )}
            </div>
        </div>
    );
};

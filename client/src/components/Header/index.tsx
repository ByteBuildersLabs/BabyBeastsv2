import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Music from "../Music";
import monster from "../../assets/img/logo.jpg";
import trophy from "../../assets/img/trophy.svg";
import logout from "../../assets/img/logout.svg";
import menuIcon from "../../assets/img/Menu.svg";
import closeIcon from "../../assets/img/Close.svg";
import { useBeasts } from "../../hooks/useBeasts";
import { usePlayer } from "../../hooks/usePlayers";
import ControllerConnectButton from "../CartridgeController/ControllerConnectButton";
import "./main.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [route, setRoute] = useState('/');
  const { beasts } = useBeasts();
  const { player } = usePlayer();

  useEffect(() => {
    const beast = beasts.find(beast => beast?.player === player?.address);
    if (beast) setRoute('/play');
  }, [beasts]);

  return (
    <nav className="navbar">
      <Link to={route} className="logo">
        <img src={monster} alt="Logo" />
      </Link>
      
      <div className="side-menu-container">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="menu-toggle"
          aria-label="Toggle menu"
        >
          <img 
            src={isOpen ? closeIcon : menuIcon} 
            alt={isOpen ? "Close menu" : "Open menu"}
            className="toggle-icon"
          />
        </button>
        <div className={`side-menu ${isOpen ? 'expanded' : ''}`}>
          <Link className="item" to={'/leaderboard'} >
            <div className="leader-icon">
              <img src={trophy} alt="Leaderboard" />
            </div>
            <span>Leaderboard</span>
          </Link>
          <div className="item">
            <Music />
            <span>Music</span>
          </div>
          <div className="item">
            <div className="lore-icon">
              <img src={logout} alt="Beast Lore" />
            </div>
            <ControllerConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;

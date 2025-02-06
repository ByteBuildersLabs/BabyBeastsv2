import React, { useState } from "react";
import useSound from "use-sound";
import backgroundMusic from "../../assets/sounds/chillBeast.mp3";
import music from "../../assets/img/music.svg";
import "./main.css";

function Music() {
  const [isMuted, setIsMuted] = useState(false);
  const [play, { stop, sound }] = useSound(backgroundMusic, {
    loop: true,
    volume: isMuted ? 0 : 0.3,
  });

  React.useEffect(() => {
    play();
    return () => stop();
  }, [play, stop]);

  const toggleMute = () => {
    if (sound) {
      setIsMuted((prev) => !prev);
    }
  };

  return (
    <>
      <button onClick={toggleMute} className="sound-button">
        <img src={music} className={isMuted ? "muted" : ""} />
      </button>
    </>
  );
}

export default Music;

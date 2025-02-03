import { useEffect, useState } from "react";
import { Account } from "starknet";
import { useAccount } from "@starknet-react/core";
import { SDK } from "@dojoengine/sdk";
import { Beast, Schema } from "../../dojo/bindings";
import { Card } from '../../components/ui/card';
import { useDojo } from "../../dojo/useDojo.tsx";
import { useBeast } from "../../hooks/useBeasts.tsx";
import { useParams } from "react-router-dom";
import initials from "../../data/initials.tsx";
import Hints from "../Hints/index.tsx";
import dead from '../../assets/img/dead.gif';
import Stats from "./Stats/index.tsx";
import Actions from "./Actions/index.tsx";
import Status from "./Status/index.tsx";
import useSound from 'use-sound';
import feedSound from '../../assets/sounds/bbeating.mp3';
import cleanSound from '../../assets/sounds/bbshower.mp3';
import sleepSound from '../../assets/sounds/bbsleeps.mp3';
import playSound from '../../assets/sounds/bbjump.mp3';
import reviveSound from '../../assets/sounds/bbrevive.mp3';
import toggle from '../../assets/img/x.svg';
import './main.css';
import Joyride, { Placement } from "react-joyride";


function Tamagotchi({ sdk }: { sdk: SDK<Schema> }) {
  const { beasts } = useBeast(sdk);
  const { beastId } = useParams();
  const beast = beasts.find((beast: Beast) => String(beast.beast_id) === beastId);
  
  const loadingTime = 6000;
  const [isLoading, setIsLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Add sound hooks
  const [playFeed] = useSound(feedSound, { volume: 0.7, preload: true });
  const [playClean] = useSound(cleanSound, { volume: 0.7, preload: true });
  const [playSleep] = useSound(sleepSound, { volume: 0.7, preload: true });
  const [playPlay] = useSound(playSound, { volume: 0.7, preload: true });
  const [playRevive] = useSound(reviveSound, { volume: 0.7, preload: true });

  const {
    setup: { client },
  } = useDojo();

  useEffect(() => {
    const updateBackground = () => {
      const hour = new Date().getHours();
      const isDayTime = hour > 6 && hour < 18;
      const bodyElement = document.querySelector('.body') as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.add(`${isDayTime ? 'day' : 'night'}`);
        bodyElement.style.backgroundSize = 'inherit';
      }
    };
    updateBackground();
  }, []);

  const { account } = useAccount();

  // Animations
  const [currentImage, setCurrentImage] = useState(
    beast ? initials[beast.specie - 1].idlePicture : ""
  );
  const [firstTime, isFirstTime] = useState(true);

  useEffect(() => {
    if (firstTime && beast) {
      setCurrentImage(beast ? initials[beast.specie - 1].idlePicture : "");
      isFirstTime(false);
    }
  }, [beast]);

  const showAnimation = (gifPath: string) => {
    setCurrentImage(gifPath);
    setTimeout(() => {
      setCurrentImage(beast ? initials[beast.specie - 1].idlePicture : "");
    }, loadingTime);
  };
  const showDeathAnimation = () => {
    setCurrentImage(dead);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (beast?.is_alive && account) {
        await client.actions.decreaseStats(account as Account);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [beast?.is_alive]);

  useEffect(() => {
    if (beast?.is_alive == false) {
      showDeathAnimation();
    }
  }, [beast?.is_alive]);

  // Helper to wrap Dojo actions with toast
  const handleAction = async (
    actionName: string,
    actionFn: () => Promise<{ transaction_hash: string } | undefined>,
    animation: string
  ) => {
    setIsLoading(true);
    showAnimation(animation);

    // Trigger sound based on action
    switch (actionName) {
      case 'Feed': playFeed(); break;
      case 'Clean': playClean(); break;
      case 'Sleep': playSleep(); break;
      case 'Play': playPlay(); break;
      case 'Revive': playRevive(); break;
      case 'Wake up':
        console.warn('Missing sound for awake action');
        break;
    }
    actionFn();
  };

  const [{ run, steps }] = useState({
    run: true,
    steps: [
      {
        content: <h2>Caring for your creature!</h2>,
        placement: "right" as Placement,
        target: "#step-3",
        title: "Baby beast Toturial",
      },
    ],
  });

  return (
    <>
      <div className="tamaguchi">
      <Joyride
          run={run}
          steps={steps}
          hideCloseButton
          scrollToFirstStep
          showProgress
          showSkipButton
          styles={{
            options: {
              backgroundColor: "#370001",
              overlayColor: "rgba(79, 26, 0, 0.4)",
              primaryColor: "#000",
              textColor: "white",
              width: 500,
              zIndex: 1000,
            },
          }}
        />
        <>{beast &&
          <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <Status beast={beast} />
            <div>
              <div className="scenario flex justify-center items-column">
                <img src={currentImage} alt="Tamagotchi" className="w-40 h-40" />
              </div>
              <img src={toggle} onClick={() => setShowStats(prev => !prev)} width={40} />
              {showStats
                ? <Stats beast={beast} />
                : <Actions handleAction={handleAction} isLoading={isLoading} beast={beast} account={account} client={client} />
              }
              <Hints />
            </div>
          </Card>
        }</>
      </div>
    </>
  );
}

export default Tamagotchi;

import { useEffect, useState } from "react";
import { Heart, Pizza, Coffee, Bath, Gamepad2, Sun, Swords, ShieldPlus, TestTubeDiagonal, CircleGauge, } from 'lucide-react';
import { Account } from "starknet";
import { useAccount } from "@starknet-react/core";
import { SDK } from "@dojoengine/sdk";
import { Schema } from "../../dojo/bindings";
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useDojo } from "../../dojo/useDojo.tsx";
import { useBeast } from "../../hooks/useBeasts.tsx";
import { toast } from "react-hot-toast";
import initials from "../../data/initials.tsx";
import Hints from "../Hints/index.tsx";
import dead from '../../assets/img/dead.gif';
import './main.css';
import useSound from 'use-sound';
import feedSound from '../../assets/sounds/bbeating.mp3';
import cleanSound from '../../assets/sounds/bbshower.mp3';
import sleepSound from '../../assets/sounds/bbsleeps.mp3';
import playSound from '../../assets/sounds/bbjump.mp3';
import reviveSound from '../../assets/sounds/bbrevive.mp3';

function Tamagotchi({ sdk }: { sdk: SDK<Schema> }) {
  const beast = useBeast(sdk);
  const loadingTime = 6000;
  const [isLoading, setIsLoading] = useState(false);

  // Add sound hooks
  const [playFeed] = useSound(feedSound, { volume: 0.7, preload: true });
  const [playClean] = useSound(cleanSound, { volume: 0.7, preload: true });
  const [playSleep] = useSound(sleepSound, { volume: 0.7, preload: true });
  const [playPlay] = useSound(playSound, { volume: 0.7, preload: true });
  const [playRevive] = useSound(reviveSound, { volume: 0.7, preload: true });

  const {
    setup: { client },
  } = useDojo();

  const { account } = useAccount();

  // Animations
  const [currentImage, setCurrentImage] = useState(beast ? initials[beast.specie - 1].idlePicture : '');
  const [firstTime, isFirstTime] = useState(true);
  
  useEffect(() => {
    if (firstTime && beast) {
      setCurrentImage(beast ? initials[beast.specie - 1].idlePicture : '')
      isFirstTime(false);
    }
  }, [beast]);

  const showAnimation = (gifPath: string) => {
    setCurrentImage(gifPath);
    setTimeout(() => {
      setCurrentImage(beast ? initials[beast.specie - 1].idlePicture : '');
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
  const handleAction = async (actionName: string, actionFn: () => Promise<{ transaction_hash: string } | undefined>, animation: string) => {
    setIsLoading(true);
    showAnimation(animation);

    // Trigger sound based on action
    switch(actionName) {
      case 'Feed': playFeed(); break;
      case 'Clean': playClean(); break;
      case 'Sleep': playSleep(); break;
      case 'Play': playPlay(); break;
      case 'Revive': playRevive(); break;
      case 'Wake up': 
        console.warn('Missing sound for awake action');
        break;
    }

    try {
      await toast.promise(
        actionFn(),
        {
          loading: `Performing ${actionName}...`,
          success: `${actionName} completed successfully!`,
          error: `Failed to perform ${actionName}. Please try again.`,
        }
      );
      setTimeout(() => setIsLoading(false), loadingTime);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error(`An error occurred while performing ${actionName}`);
    }
  };

  return (
    <>
      <div className="tamaguchi">
        <>{beast &&
          <Card>
            <CardContent>
              <div className="space-y-6">
                {/* Centered Tamagotchi Image */}
                <div className="scenario flex justify-center items-column">
                  <h2 className="level">
                    Lvl <span>{beast.level}</span>
                  </h2>
                  <div className="stats">
                    <div className="item">
                      <div>
                        <Swords />
                        <span>{Math.round(beast.attack)}</span>
                      </div>
                      <p>Attack</p>
                    </div>
                    <div className="item">
                      <div>
                        <ShieldPlus />
                        <span>{Math.round(beast.defense)}</span>
                      </div>
                      <p>Defense</p>
                    </div>
                    <div className="item">
                      <div>
                        <CircleGauge />
                        <span>{Math.round(beast.speed)}</span>
                      </div>
                      <p>Speed</p>
                    </div>
                    <div className="item">
                      <div>
                        <TestTubeDiagonal />
                        <span>{(beast.experience)}</span>
                      </div>
                      <p>Experience</p>
                    </div>
                  </div>
                  <div className={`tamagotchi-image-container ${isLoading ? "glow" : ""}`}>
                    <img src={currentImage} alt="Tamagotchi" className="w-40 h-40" />
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <div className="status">
                    <div className="item">
                      <div>
                        <Heart />
                        <span>{Math.round(beast.energy)}%</span>
                      </div>
                      < p>Energy</p>
                    </div>
                    <div className="item">
                      <div>
                        <Coffee />
                        <span  >{Math.round(beast.hunger)}%</span>
                      </div>
                      <p>Hunger</p>
                    </div>
                    <div className="item">
                      <div>
                        <Gamepad2 />
                        <span  >{Math.round(beast.happiness)}%</span>
                      </div>
                      <p>Happiness</p>
                    </div>
                    <div className="item">
                      <div>
                        <Bath />
                        <span>{Math.round(beast.hygiene)}%</span>
                      </div>
                      <p>Hygiene</p>
                    </div>
                  </div>
                </div>
                <div className="actions mb-0">
                <Button
                    onClick={() => handleAction("Feed", () => client.actions.feed(account as Account), initials[beast.specie - 1].eatPicture)}
                    disabled={isLoading || !beast.is_alive}
                    className="flex items-center button"
                  >
                    <Pizza /> Feed
                  </Button>
                  <Button
                    onClick={() => handleAction("Sleep", () => client.actions.sleep(account as Account), initials[beast.specie - 1].sleepPicture)}
                    disabled={isLoading || !beast.is_alive}
                    className="flex items-center button"
                  >
                    <Coffee /> Sleep
                  </Button>
                  <Button
                    onClick={() => handleAction("Clean", () => client.actions.clean(account as Account), initials[beast.specie - 1].cleanPicture)}
                    disabled={isLoading || !beast.is_alive}
                    className="flex items-center button"
                  >
                    <Bath /> Clean
                  </Button>
                  <Button
                    onClick={() => handleAction("Play", () => client.actions.play(account as Account), initials[beast.specie - 1].playPicture)}
                    disabled={isLoading || !beast.is_alive}
                    className="flex items-center button"
                  >
                    <Gamepad2 /> Play
                  </Button>
                  <Button
                    onClick={() => handleAction("Wake up", () => client.actions.revive(account as Account), initials[beast.specie - 1].idlePicture)}
                    disabled={isLoading || !beast.is_alive}
                    className="flex items-center button"
                  >
                    <Sun /> Wake up
                  </Button>
                  <Button
                    onClick={() => handleAction("Revive", () => client.actions.revive(account as Account), initials[beast.specie - 1].idlePicture)}
                    disabled={isLoading || beast.is_alive}
                    className="flex items-center button"
                  >
                    <Sun /> Revive
                  </Button>
                </div>
                <Hints />
              </div>
            </CardContent>
          </Card>
        }</>
      </div>
    </>
  );
}

export default Tamagotchi;

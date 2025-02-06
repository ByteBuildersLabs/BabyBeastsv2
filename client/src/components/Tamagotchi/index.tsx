import { useEffect, useState } from "react";
import { Account } from "starknet";
import { useAccount } from "@starknet-react/core";
import { SDK } from "@dojoengine/sdk";
import { Beast, Schema } from "../../dojo/bindings";
import { Card } from "../../components/ui/card";
import { useDojo } from "../../dojo/useDojo.tsx";
import { useBeast } from "../../hooks/useBeasts.tsx";
import { useParams } from "react-router-dom";
import initials from "../../data/initials.tsx";
import message from "../../assets/img/message.svg";
import dead from "../../assets/img/dead.gif";
import Stats from "./Stats/index.tsx";
import Actions from "./Actions/index.tsx";
import Status from "./Status/index.tsx";
import Food from "./Food/index.tsx";
import Whispers from "./Whispers/index.tsx";
import useSound from "use-sound";
import feedSound from "../../assets/sounds/bbeating.mp3";
import cleanSound from "../../assets/sounds/bbshower.mp3";
import sleepSound from "../../assets/sounds/bbsleeps.mp3";
import playSound from "../../assets/sounds/bbjump.mp3";
import reviveSound from "../../assets/sounds/bbrevive.mp3";
import monster from "../../assets/img/logo.svg";
import "./main.css";
import Joyride, { CallBackProps, STATUS } from "react-joyride";
import { steps } from "./constants/TutorialSteps.tsx";

function Tamagotchi({ sdk }: { sdk: SDK<Schema> }) {
  const { beasts } = useBeast(sdk);
  const { beastId } = useParams();
  const beast = beasts.find(
    (beast: Beast) => String(beast.beast_id) === beastId,
  );

  // Joyride
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const loadingTime = 6000;
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState("actions");

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
      const bodyElement = document.querySelector(".body") as HTMLElement;
      if (bodyElement) {
        bodyElement.classList.add(`${isDayTime ? "day" : "night"}`);
        bodyElement.style.backgroundSize = "inherit";
        bodyElement.style.padding = "80px 15px 30px";
      }
    };
    updateBackground();
  }, []);

  const { account } = useAccount();

  // Animations
  const [currentImage, setCurrentImage] = useState(
    beast ? initials[beast.specie - 1].idlePicture : "",
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
    }, 10000000);

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
    animation: string,
  ) => {
    setIsLoading(true);
    showAnimation(animation);

    // Trigger sound based on action
    switch (actionName) {
      case "Feed":
        playFeed();
        break;
      case "Clean":
        playClean();
        break;
      case "Sleep":
        playSleep();
        break;
      case "Play":
        playPlay();
        break;
      case "Revive":
        playRevive();
        break;
      case "Wake up":
        console.warn("Missing sound for awake action");
        break;
    }
    actionFn();
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      setStepIndex(0);
    } else if (action === "next" && index < steps.length - 1) {
      setStepIndex(index + 1);
    } else if (action === "prev" && index > 0) {
      setStepIndex(index - 1);
    } else if (type === "tour:end") {
      setRun(false);
      setStepIndex(0);
    }
  };

  return (
    <>
      <Joyride
        run={run}
        steps={steps}
        stepIndex={stepIndex}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        hideCloseButton={true}
        callback={handleJoyrideCallback}
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

      <div className="tamaguchi">
        <div
          style={{ display: "flex", justifyContent: "end", marginBottom: 4 }}
        >
          <button
            className="btn-dark"
            type="button"
            onClick={() => setRun(true)}
          >
            Start Tutorial
          </button>
        </div>

        <>
          {beast && (
            <Card
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "90%",
              }}
            >
              <Status beast={beast} />
              <div>
                <div className="scenario flex justify-center items-column">
                  <img
                    src={currentImage}
                    alt="Tamagotchi"
                    className="w-40 h-40"
                  />
                </div>
                <Whispers beast={beast} expanded={currentView === "chat"} />
                {currentView === "stats" ? (
                  <Stats beast={beast} />
                ) : currentView === "actions" ? (
                  <Actions
                    handleAction={handleAction}
                    isLoading={isLoading}
                    beast={beast}
                    account={account}
                    client={client}
                    setCurrentView={setCurrentView}
                  />
                ) : currentView === "chat" ? (
                  <></>
                ) : currentView === "food" ? (
                  <Food
                    handleAction={handleAction}
                    beast={beast}
                    account={account}
                    client={client}
                    showAnimation={showAnimation}
                  />
                ) : (
                  <></>
                )}
                <div className="beast-interaction">
                  <img
                    src={monster}
                    onClick={() =>
                      setCurrentView(
                        currentView !== "actions" ? "actions" : "stats",
                      )
                    }
                  />
                  <img src={message} onClick={() => setCurrentView("chat")} />
                </div>
              </div>
            </Card>
          )}
        </>
      </div>
    </>
  );
}

export default Tamagotchi;

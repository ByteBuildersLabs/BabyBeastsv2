import { useAccount } from "@starknet-react/core";
import { useSystemCalls } from "../../dojo/useSystemCalls.ts";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import ControllerConnectButton from "../CartridgeController/ControllerConnectButton.tsx";
import Egg from "../../assets/img/egg.gif";
import Hints from "../Hints/index.tsx";
import './main.css';
import { useState } from "react";
import Joyride, { Placement } from "react-joyride";

function SpawnBeast() {
  const { spawn } = useSystemCalls();
  const { account } = useAccount();
  const [{ run, steps }] = useState({
    run: true,
    steps: [
      {
        content: <h2>Spawn your creature!</h2>,
        placement: "button" as Placement,
        target: "#step-1",
        title: "Baby beast Toturial",
      },
    ],
  });

  const navigate = useNavigate();

  const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const randomNumber = getRandomNumber(1, 3);

  const notify = () => {
    toast("Your egg is hatching!", { duration: 5000 });
  }

  return (
    <div className="spawn-beast">
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

      <div className='d-flex'>
        <p className={'title'}>
          Collect them all!
          <span className='d-block'>There are many species</span>
        </p>
        <ControllerConnectButton />
      </div>
      <div className="initial-beast">
        <img src={Egg} alt="beast" />
        <div className="initial-info">
          <h4>
            This is a random beast
          </h4>
          <p>
            Hatch your own Babybeasts and take care of it! Collect them all!
          </p>
        </div>
        <button
          disabled={account ? false : true}
          className="button"
          onClick={async () => {
            notify();
            await spawn(randomNumber);
            await new Promise(resolve => setTimeout(resolve, 5500));
            navigate("/bag");
          }}>Hatch your egg
        </button>
        <Hints />
        <Toaster position="bottom-center" />
      </div>
    </div>
  );
}

export default SpawnBeast;

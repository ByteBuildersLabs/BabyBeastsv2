import { useState } from "react";
import Joyride, { CallBackProps, STATUS } from "react-joyride";
import './main.css';

const HatchJR = () => {
  const [run, setRun] = useState(true);

  const steps = [
    {
      target: ".initial-beast",
      content: "Welcome to ByteBeasts Tamagotchi",
    },
    {
      target: ".initial-beast",
      content: "Create a player and Hatch your Egg",
    },
    {
      target: ".navbar .logo img",
      content: "Once you have a baby beast, you will access the Tamagotchi screen here",
    },
    {
      target: ".sound-button",
      content: "Enable and disable the sound",
    },
    {
      target: ".dex-icon",
      content: "Here is your Beasts Dex",
    },
    {
      target: ".bag-icon",
      content: "Here will be your baby beasts once you hatch your egg",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as "finished" | "skipped")) {
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      callback={handleJoyrideCallback}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          zIndex: 10000,
        },
      }}
    />
  );
};

export default HatchJR;

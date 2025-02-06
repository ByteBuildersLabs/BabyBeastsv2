import { Placement } from "react-joyride";

export const steps = [
  {
    title: "Welcome to your Tamagotchi!",
    content: <h2>Here you can take care of your Baby Beast.</h2>,
    placement: "center" as Placement,
    target: "#step-Energy",
  },
  {
    title: "Energy",
    content: (
      <h2>Represents the Tamagotchi's energy; it recovers by sleeping</h2>
    ),
    placement: "center" as Placement,
    target: "#step-Energy",
  },
  {
    title: "Hunger",
    content: <h2>Measures the hunger level; decreases by eating</h2>,
    placement: "center" as Placement,
    target: "#step-Hunger",
  },
  {
    title: "Happiness",
    content: (
      <h2>
        Indicates how happy it is; increases by playing and getting attention
      </h2>
    ),
    placement: "center" as Placement,
    target: "#step-Happiness",
  },
  {
    title: "Hygiene",
    content: (
      <h2>
        Reflects cleanliness; decreases over time and is restored by bathing
      </h2>
    ),
    placement: "center" as Placement,
    target: "#step-Hygiene",
  },
  {
    title: "Feed",
    content: <h2>Give food to your Tamagotchi to satisfy its hunger.</h2>,
    placement: "center" as Placement,
    target: "#step-Feed",
  },
  {
    title: "Sleep",
    content: <h2>Put your Tamagotchi to sleep to recover energy.</h2>,
    placement: "center" as Placement,
    target: "#step-Sleep",
  },
  {
    title: "Clean",
    content: <h2>Use this to keep your Tamagotchi clean and happy.</h2>,
    placement: "center" as Placement,
    target: "#step-Clean",
  },
  {
    title: "Play",
    content: <h2>Play with your Tamagotchi to increase its happiness.</h2>,
    placement: "center" as Placement,
    target: "#step-Play",
  },
  {
    title: "Wake Up",
    content: <h2>Wake up your Tamagotchi to get it active again.</h2>,
    placement: "center" as Placement,
    target: "#step-Wake-up",
  },
  {
    title: "Revive",
    content: <h2>If your Tamagotchi is down, you can revive it here.</h2>,
    placement: "center" as Placement,
    target: "#step-Revive",
  },
];

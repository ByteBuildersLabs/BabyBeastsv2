import babyWolfIdle from "../assets/beasts/BabyWolf-idle.gif";
import babyWolfEat from "../assets/beasts/BabyWolf-Eat.gif";
import babyWolfPlay from "../assets/beasts/BabyWolf- jump.gif";
import babyWolfSleep from "../assets/beasts/BabyWolf-sleep.gif";
import babyWolfClean from "../assets/beasts/BabyWolf-shower.gif";
import babyFoxIdle from "../assets/beasts/BabyFox-Run.gif";
import babyFoxEat from "../assets/beasts/BabyFox-Eat.gif";
import babyFoxPlay from "../assets/beasts/BabyFox-Run.gif";
import babyFoxSleep from "../assets/beasts/BabyFox-Sleep.gif";
import babyFoxClean from "../assets/beasts/BabyFox-Shower.gif";
import babyBirdIdle from "../assets/beasts/BabyEagle-idle.gif";
import babyBirdEat from "../assets/beasts/BabyEagle-eat.gif";
import babyBirdPlay from "../assets/beasts/BabyEagle-happy.gif";
import babyBirdSleep from "../assets/beasts/BabyEagle-sleep.gif";
import babyBirdClean from "../assets/beasts/BabyEagle-bath.gif";

export interface Initial {
  name: string;
  description: string;
  specie: number;
  idlePicture: string;
  eatPicture: string;
  playPicture: string;
  sleepPicture: string;
  cleanPicture: string;
}

const initials: Initial[] = [
  {
    name: "BabyWolf",
    description: "The wolf is a social animal that lives in packs",
    specie: 0,
    idlePicture: babyWolfIdle,
    eatPicture: babyWolfEat,
    playPicture: babyWolfPlay,
    sleepPicture: babyWolfSleep,
    cleanPicture: babyWolfClean,
  },
  {
    name: "BabyFox",
    description:
      "The fox is a small carnivorous mammal that is found in many parts of the world",
    specie: 1,
    idlePicture: babyFoxIdle,
    eatPicture: babyFoxEat,
    playPicture: babyFoxPlay,
    sleepPicture: babyFoxSleep,
    cleanPicture: babyFoxClean,
  },
  {
    name: "BabyBird",
    description:
      "The eagle is a large bird of prey that is found in many parts of the world",
    specie: 2,
    idlePicture: babyBirdIdle,
    eatPicture: babyBirdEat,
    playPicture: babyBirdPlay,
    sleepPicture: babyBirdSleep,
    cleanPicture: babyBirdClean,
  },
];

export default initials;

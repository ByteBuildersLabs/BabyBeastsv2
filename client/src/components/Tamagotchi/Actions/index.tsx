import { Account } from "@dojoengine/torii-wasm";
import { Button } from "../../../components/ui/button";
import Food from "../../../assets/img/food.png";
import Sleep from "../../../assets/img/sleep.png";
import Clean from "../../../assets/img/clean.png";
import Play from "../../../assets/img/play.png";
import WakeUp from "../../../assets/img/wakeup.png";
import initials from "../../../data/initials";
import "./main.css";

type PictureKey =
  | "eatPicture"
  | "sleepPicture"
  | "cleanPicture"
  | "playPicture"
  | "idlePicture";

const actionButtons: {
  label: string;
  img: string | null;
  action: string;
  pictureKey: PictureKey;
  isRevive?: boolean;
}[] = [
  { label: "Feed", img: Food, action: "feed", pictureKey: "eatPicture" },
  { label: "Sleep", img: Sleep, action: "sleep", pictureKey: "sleepPicture" },
  { label: "Clean", img: Clean, action: "clean", pictureKey: "cleanPicture" },
  { label: "Play", img: Play, action: "play", pictureKey: "playPicture" },
  {
    label: "Wake up",
    img: WakeUp,
    action: "revive",
    pictureKey: "idlePicture",
  },
  {
    label: "Revive",
    img: null,
    action: "revive",
    pictureKey: "idlePicture",
    isRevive: true,
  },
];

const Actions = ({
  handleAction,
  isLoading,
  beast,
  account,
  client,
  setCurrentView,
}: {
  handleAction: any;
  isLoading: any;
  beast: any;
  account: any;
  client: any;
  setCurrentView: (view: string) => void;
}) => {
  return (
    <div className="actions mb-0">
      {actionButtons.map(({ label, img, action, pictureKey, isRevive }) => (
        <Button
          id={`step-${label.replace(/\s+/g, "-")}`}
          key={label}
          onClick={() => {
            if (action === "feed") {
              setCurrentView("food"); // Change view to food
            } else {
              handleAction(
                label,
                () => client.actions[action](account as Account),
                initials[beast.specie - 1][pictureKey],
              );
            }
          }}
          disabled={isLoading || (isRevive ? beast.is_alive : !beast.is_alive)}
        >
          {img && <img src={img} />} {label}
        </Button>
      ))}
    </div>
  );
};

export default Actions;

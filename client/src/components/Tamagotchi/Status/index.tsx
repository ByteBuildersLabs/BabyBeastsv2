import { Beast } from "../../../dojo/bindings";
import Energy from "../../../assets/img/Energy.png";
import Happyness from "../../../assets/img/Happyness.png";
import Hygienne from "../../../assets/img/Hygienne.png";
import Hunger from "../../../assets/img/Hunger.png";
import "./main.css";

const statusItems = [
  {
    label: "Energy",
    value: (beast: Beast) => Math.round(beast.energy),
    pic: Energy,
  },
  {
    label: "Hunger",
    value: (beast: Beast) => Math.round(beast.hunger),
    pic: Hunger,
  },
  {
    label: "Happiness",
    value: (beast: Beast) => Math.round(beast.happiness),
    pic: Happyness,
  },
  {
    label: "Hygiene",
    value: (beast: Beast) => Math.round(beast.hygiene),
    pic: Hygienne,
  },
];

const Status = ({ beast }: { beast: Beast }) => {
  return (
    <div className="status">
      {statusItems.map(({ label, value, pic }) => (
        <div className="item" key={label} id={`step-${label}`}>
          <p className="mb-1">{label}</p>
          <div className="pic">
            <img src={pic} />
          </div>
          <p className="value">{value(beast)}%</p>
        </div>
      ))}
    </div>
  );
};

export default Status;

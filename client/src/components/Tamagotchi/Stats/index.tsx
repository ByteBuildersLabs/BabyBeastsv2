import { Beast } from "../../../dojo/bindings";
import Attack from "../../../assets/img/Attack.svg";
import Defense from "../../../assets/img/Defence.svg";
import Speed from "../../../assets/img/Speed.svg";
import Experience from "../../../assets/img/Experience.svg";
import "./main.css";

const statsItems = [
  {
    label: "Attack",
    value: (beast: Beast) => Math.round(beast.attack),
    pic: Attack,
  },
  {
    label: "Defense",
    value: (beast: Beast) => Math.round(beast.defense),
    pic: Defense,
  },
  {
    label: "Speed",
    value: (beast: Beast) => Math.round(beast.speed),
    pic: Speed,
  },
  {
    label: "Experience",
    value: (beast: Beast) => beast.experience,
    pic: Experience,
  },
];

const Stats = ({ beast }: { beast: Beast }) => {
  return (
    <div className="stats">
      {statsItems.map(({ label, value, pic }) => (
        <div className="item" key={label}>
          <div className="stats-label">
            <img src={pic} />
            <label>{label}</label>
          </div>
          <div className={`stats-value ${label}`}>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${value(beast) * 10}%` }}
              ></div>
            </div>
            <span>{value(beast)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;

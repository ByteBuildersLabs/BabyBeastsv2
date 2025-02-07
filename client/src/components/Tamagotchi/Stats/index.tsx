import { BeastStats } from "../../../dojo/bindings";
import Attack from '../../../assets/img/Attack.svg';
import Defense from '../../../assets/img/Defence.svg';
import Speed from '../../../assets/img/Speed.svg';
import Experience from '../../../assets/img/Experience.svg';
import './main.css';

const statsItems = [
  { label: "Attack", value: (beastsStats: BeastStats) => Math.round(beastsStats.attack), pic: Attack },
  { label: "Defense", value: (beastsStats: BeastStats) => Math.round(beastsStats.defense), pic: Defense },
  { label: "Speed", value: (beastsStats: BeastStats) => Math.round(beastsStats.speed), pic: Speed },
  { label: "Experience", value: (beastsStats: BeastStats) => beastsStats.experience, pic: Experience }
];

function Stats({ beastStats }: { beastStats: BeastStats }) {

  if (beastStats) {
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
                <div className="progress" style={{ width: `${value(beastStats) * 10}%` }}></div>
              </div>
              <span>{value(beastStats)}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Stats;

import rolo from "../../assets/img/rol.jpg";
import juan from "../../assets/img/juan.jpeg";
import cox from "../../assets/img/marco.jpeg";
import luis from "../../assets/img/Luis.png";
import daniel from "../../assets/img/daniel.jpeg";

import "./main.css";

function Footer() {
  return (
    <>
      <div className="team mt-5 mb-4">
        <a href="https://github.com/RolandoDrRobot" target="_blank">
          <img src={rolo} className="footer-team" />
        </a>
        <a href="https://github.com/juandiegocv27" target="_blank">
          <img src={juan} className="footer-team" />
        </a>
        <a href="https://github.com/coxmars" target="_blank">
          <img src={cox} className="footer-team" />
        </a>
        <a href="https://github.com/jimenezz22" target="_blank">
          <img src={luis} className="footer-team" />
        </a>
        <a href="https://github.com/danielcdz" target="_blank">
          <img src={daniel} className="footer-team" />
        </a>
      </div>
    </>
  );
}

export default Footer;

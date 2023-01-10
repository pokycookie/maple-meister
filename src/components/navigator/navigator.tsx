import "./navigator.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChartLine,
  faDatabase,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";

function Navigator() {
  return (
    <div className="nav">
      <div className="nav-icon-area">
        <FontAwesomeIcon className="nav-icon" icon={faArrowRight} />
      </div>
      <div className="nav-divider"></div>
      <div className="nav-icon-area">
        <FontAwesomeIcon className="nav-icon" icon={faClock} />
      </div>
      <div className="nav-icon-area">
        <FontAwesomeIcon className="nav-icon" icon={faChartLine} />
      </div>
      <div className="nav-icon-area">
        <FontAwesomeIcon className="nav-icon" icon={faDatabase} />
      </div>
    </div>
  );
}

export default Navigator;

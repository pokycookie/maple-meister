import "./navigator.css";
import {
  faArrowRight,
  faChartLine,
  faCube,
  faGear,
  faRightLeft,
  faScroll,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import NavigatorIcon from "./navigatorIcon";

function Navigator() {
  return (
    <div className="nav">
      <div className="top">
        <NavigatorIcon icon={faArrowRight} />
        <div className="nav-divider"></div>
        <NavigatorIcon page="timer" icon={faClock} />
        <NavigatorIcon page="chart" icon={faChartLine} />
        <NavigatorIcon page="recipe" icon={faScroll} />
        <div className="nav-divider"></div>
        <NavigatorIcon page="ledger" icon={faRightLeft} />
        <NavigatorIcon page="item" icon={faCube} />
      </div>
      <div className="bottom">
        <NavigatorIcon page="setting" icon={faGear} />
      </div>
    </div>
  );
}

export default Navigator;

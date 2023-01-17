import "./navigator.css";
import {
  faArrowRight,
  faChartLine,
  faCube,
  faRightLeft,
  faScroll,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import NavigatorIcon from "./navigatorIcon";

function Navigator() {
  return (
    <div className="nav">
      <NavigatorIcon icon={faArrowRight} />
      <div className="nav-divider"></div>
      <NavigatorIcon page="timer" icon={faClock} />
      <NavigatorIcon page="chart" icon={faChartLine} />
      <NavigatorIcon page="ledger" icon={faRightLeft} />
      <div className="nav-divider"></div>
      <NavigatorIcon page="item" icon={faCube} />
      <NavigatorIcon page="recipe" icon={faScroll} />
    </div>
  );
}

export default Navigator;

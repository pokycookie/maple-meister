import "./navigator.css";
import {
  faArrowRight,
  faChartLine,
  faDatabase,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import NavigatorIcon from "./navigatorIcon";

function Navigator() {
  return (
    <div className="nav">
      <NavigatorIcon icon={faArrowRight} />
      <div className="nav-divider"></div>
      <NavigatorIcon page="timer" icon={faClock} />
      <NavigatorIcon page="ledger" icon={faChartLine} />
      <NavigatorIcon icon={faDatabase} />
    </div>
  );
}

export default Navigator;

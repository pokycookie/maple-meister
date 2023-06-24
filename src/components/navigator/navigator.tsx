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
import { motion } from "framer-motion";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavigatorMenu from "./navigatorMenu";

function Navigator() {
  const [isExtended, setIsExtended] = useState(false);

  return (
    <motion.div className="nav" animate={{ width: isExtended ? 250 : 70 }}>
      <div className="top">
        <div className="menu">
          <motion.div
            className="nav-icon-area expendIcon"
            animate={{ rotate: isExtended ? 180 : 0 }}
            onClick={() => setIsExtended((prev) => !prev)}
          >
            <FontAwesomeIcon className="nav-icon" icon={faArrowRight} />
          </motion.div>
        </div>
        <div className="nav-divider"></div>
        <NavigatorMenu page="timer" icon={faClock} title="타이머" />
        <NavigatorMenu page="chart" icon={faChartLine} title="차트" />
        <NavigatorMenu page="recipe" icon={faScroll} title="레시피" />
        <div className="nav-divider"></div>
        <NavigatorMenu page="ledger" icon={faRightLeft} title="거래 기록" />
        <NavigatorMenu page="item" icon={faCube} title="아이템" />
      </div>
      <div className="bottom">
        <NavigatorMenu page="setting" icon={faGear} title="환경설정" />
      </div>
    </motion.div>
  );
}

export default Navigator;

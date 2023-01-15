import { IDBTimer, db } from "../../db";
import "./timerList.css";
import { getTimeText } from "../../lib/time";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface IProps {
  data: IDBTimer;
  refresh: () => void;
  setTimer: (time: number) => void;
}

function TimerList(props: IProps) {
  const deleteHandler = async () => {
    await db.timer.delete(props.data.id!);
    props.refresh();
  };

  const clickHandler = () => {
    props.setTimer(props.data.time);
  };

  return (
    <div className="timer-list" onClick={clickHandler}>
      <div className="content-area">
        <p className="title"></p>
        <p className="time">{getTimeText(props.data.time)}</p>
      </div>
      <button className="delete-btn" onClick={deleteHandler}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
}

export default TimerList;

import { useEffect, useState } from "react";
import { ITime } from "../types";
import { useInterval } from "../hooks";
import TimePicker from "../components/timePicker/timePicker";
import "../styles/pages/timer.scss";
import { db } from "../db";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faList } from "@fortawesome/free-solid-svg-icons";
import { Store } from "react-notifications-component";

function TimerPage() {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [start, setStart] = useState(false);
  const [pause, setPause] = useState(false);
  const [time, setTime] = useState(0);

  const subtractTime = () => {
    if (time > 0) {
      setTime((prev) => prev - 1);
    } else {
      setTime(timeToNumber({ hour, minute, second }));
      new Notification("Time's up");
    }
  };

  const startHandler = () => {
    if (start) {
      // STOP
      setStart(false);
      setPause(false);
    } else {
      // START
      if (time > 0) {
        setStart(true);
        setPause(false);
      } else {
        Store.addNotification({
          message: `0초 이상으로 시간을 설정해주세요`,
          type: "warning",
          insert: "top",
          container: "top-right",
          dismiss: {
            duration: 3000,
          },
        });
      }
    }
  };

  const presetAddHandler = () => {
    if (time > 0) {
      try {
        db.timer.add({
          title: "",
          time: timeToNumber({ hour, minute, second }),
        });
        Store.addNotification({
          title: `${getTimeText(timeToNumber({ hour, minute, second }))}`,
          message: `타이머 프리셋이 저장되었습니다`,
          type: "success",
          insert: "top",
          container: "top-right",
          dismiss: {
            duration: 3000,
          },
        });
      } catch (err) {
        console.error(err);
        Store.addNotification({
          title: "Error",
          message: `타이머 프리셋을 저장하지 못했습니다`,
          type: "danger",
          insert: "top",
          container: "top-right",
          dismiss: {
            duration: 3000,
          },
        });
      }
    } else {
      Store.addNotification({
        message: `0초 이상으로 시간을 설정해주세요`,
        type: "warning",
        insert: "top",
        container: "top-right",
        dismiss: {
          duration: 3000,
        },
      });
    }
  };

  // Timer interval
  useInterval(subtractTime, start && !pause ? 1000 : null);

  useEffect(() => {
    setTime(timeToNumber({ hour, minute, second }));
  }, [hour, minute, second]);

  // Permission
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="timer-page">
      <div className="timer-area">
        <div className="indicator">
          {start ? (
            <p className={pause ? "pause" : ""}>{getTimeText(time)}</p>
          ) : (
            <>
              <p className="time-number">{getDoubleDigit(hour)}</p>
              <p>:</p>
              <p className="time-number">{getDoubleDigit(minute)}</p>
              <p>:</p>
              <p className="time-number">{getDoubleDigit(second)}</p>
            </>
          )}
        </div>
        {start ? null : (
          <TimePicker
            default={{ hour, minute, second }}
            onChange={(time) => {
              setHour(time.hour);
              setMinute(time.minute);
              setSecond(time.second);
            }}
          />
        )}
        <div className="controlArea">
          {start ? (
            <button onClick={() => setPause((prev) => (prev ? false : true))}>
              {pause ? "start" : "pause"}
            </button>
          ) : null}
          <button onClick={startHandler}>{start ? "stop" : "start"}</button>
        </div>
      </div>
      {!start ? (
        <div className="preset-area">
          <div className="preset-list-area"></div>
          <div className="btn-area">
            <button className="add-btn circleBtn" onClick={presetAddHandler}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button className="preset-btn circleBtn">
              <FontAwesomeIcon icon={faList} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getDoubleDigit(value: number) {
  if (value < 10) return `0${value}`;
  else return `${value}`;
}

function timeToNumber(timeObj: ITime) {
  const H = timeObj.hour * 3600;
  const M = timeObj.minute * 60;
  return H + M + timeObj.second;
}

function numberToTime(time: number): ITime {
  const hour = Math.floor(time / 3600);
  const minute = Math.floor((time - hour * 3600) / 60);
  const second = Math.floor(time - hour * 3600 - minute * 60);
  return { hour, minute, second };
}

function getTimeText(time: number) {
  const H = numberToTime(time).hour || 0;
  const M = numberToTime(time).minute || 0;
  const S = numberToTime(time).second || 0;
  return `${getDoubleDigit(H)}:${getDoubleDigit(M)}:${getDoubleDigit(S)}`;
}

export default TimerPage;

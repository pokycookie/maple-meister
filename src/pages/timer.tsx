import { useEffect, useState } from "react";
import { ITime } from "../types";
import { useInterval } from "../hooks";
import TimePicker from "../components/timePicker/timePicker";
import "../styles/pages/timer.scss";

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
        alert("시간을 설정해주세요.");
      }
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

import { useEffect, useState } from "react";
import Slider from "./components/slider";
import { useInterval } from "./hooks";
import "./styles/app.scss";

interface ITime {
  hour: number;
  minute: number;
  second: number;
}

export default function App() {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [isStart, setIsStart] = useState(false);
  const [pause, setPause] = useState(false);
  const [time, setTime] = useState(0);

  const subtractTime = () => {
    if (time > 0) {
      setTime((prev) => prev - 1);
    } else {
      setTime(timeToNumber({ hour, minute, second }));
      const notification = new Notification("Maple meister");
    }
  };

  const startHandler = () => {
    if (isStart) {
      // STOP
      setIsStart(false);
      setPause(false);
    } else {
      // START
      if (time > 0) {
        setIsStart(true);
        setPause(false);
      } else {
        alert("시간을 설정해주세요.");
      }
    }
  };

  useInterval(subtractTime, isStart && !pause ? 1000 : null);

  useEffect(() => {
    setTime(timeToNumber({ hour, minute, second }));
  }, [hour, minute, second]);

  return (
    <div className="App">
      <div className="main">
        <div className="indicator">
          {isStart ? (
            <p className={pause ? "pause" : ""}>{getTimeText(time)}</p>
          ) : (
            <p>{getTimeText(timeToNumber({ hour, minute, second }))}</p>
          )}
        </div>
        {isStart ? null : (
          <div className="sliderArea">
            <Slider min={0} max={23} default={hour} onChange={(value) => setHour(value)} />
            <Slider min={0} max={59} default={minute} onChange={(value) => setMinute(value)} />
            <Slider min={0} max={59} default={second} onChange={(value) => setSecond(value)} />
          </div>
        )}
        <div className="controlArea">
          {isStart ? (
            <button onClick={() => setPause((prev) => (prev ? false : true))}>
              {pause ? "start" : "pause"}
            </button>
          ) : null}
          <button onClick={startHandler}>{isStart ? "stop" : "start"}</button>
        </div>
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

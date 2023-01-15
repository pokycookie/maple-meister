import { useEffect, useState } from "react";
import { useInterval } from "../hooks";
import TimePicker from "../components/timePicker/timePicker";
import "../styles/pages/timer.scss";
import { db } from "../db";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faList } from "@fortawesome/free-solid-svg-icons";
import { Store } from "react-notifications-component";
import { IDBTimer } from "../db";
import { getDoubleDigit, getTimeText, numberToTime, timeToNumber } from "../lib/time";
import TimerList from "../components/timerList/timerList";

function TimerPage() {
  // Timer set time
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  // Timer start flag
  const [start, setStart] = useState(false);
  // Timer pause flag
  const [pause, setPause] = useState(false);
  // Current time
  const [time, setTime] = useState(0);
  // Preset list open
  const [presetOpen, setPresetOpen] = useState(false);
  // Preset DB
  const [presetDB, setPresetDB] = useState<IDBTimer[]>([]);

  const subtractTime = () => {
    if (time > 0) {
      setTime((prev) => prev - 1);
    } else {
      setTime(timeToNumber({ hour, minute, second }));
      new Notification("Time's up");
    }
  };

  const refreshDB = async () => {
    const data = await db.timer.toArray();
    setPresetDB(data);
  };

  const setTimerTime = (time: number) => {
    const timeObj = numberToTime(time);
    setHour(timeObj.hour);
    setMinute(timeObj.minute);
    setSecond(timeObj.second);
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

  const presetListHandler = () => {
    setPresetOpen((prev) => (prev ? false : true));
    refreshDB();
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
            default={timeToNumber({ hour, minute, second })}
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
          <div className={`list-area${presetOpen ? " open" : ""}`}>
            {presetDB.map((e) => {
              return <TimerList key={e.id} data={e} refresh={refreshDB} setTimer={setTimerTime} />;
            })}
          </div>
          <div className="btn-area">
            <button className="add-btn circleBtn" onClick={presetAddHandler}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button className="preset-btn circleBtn" onClick={presetListHandler}>
              <FontAwesomeIcon icon={faList} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default TimerPage;

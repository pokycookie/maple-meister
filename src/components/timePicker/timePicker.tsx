import "./timePicker.css";
import { useEffect, useState } from "react";
import { ITime } from "../../types";
import { numberToTime } from "../../lib/time";
import Wheel2 from "./wheel2";

interface IProps {
  default?: number;
  onChange?: (time: ITime) => void;
}

function TimePicker(props: IProps) {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  useEffect(() => {
    if (props.onChange) props.onChange({ hour, minute, second });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour, minute, second]);

  useEffect(() => {
    if (props.default) {
      const timeObj = numberToTime(props.default);
      setHour(timeObj.hour);
      setMinute(timeObj.minute);
      setSecond(timeObj.second);
    }
  }, [props.default]);

  return (
    <div className="time-picker">
      <div className="time-picker-btn-area"></div>
      <div className="time-picker-wheel-area">
        <div className="time-picker-overlay"></div>
        <Wheel2 value={hour} max={23} onChange={(hr) => setHour(hr)} />
        <Wheel2 value={minute} max={59} onChange={(min) => setMinute(min)} />
        <Wheel2 value={second} max={59} onChange={(sec) => setSecond(sec)} />
      </div>
    </div>
  );
}

export default TimePicker;

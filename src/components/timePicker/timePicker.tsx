import Wheel from "./wheel";
import "./timePicker.css";
import { useEffect, useState } from "react";
import { ITime } from "../../types";

interface IProps {
  default?: ITime;
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

  return (
    <div className="time-picker">
      <div className="time-picker-btn-area"></div>
      <div className="time-picker-wheel-area">
        <div className="time-picker-overlay"></div>
        <Wheel default={props.default?.hour} max={23} onChange={(hr) => setHour(hr)} />
        <Wheel default={props.default?.minute} onChange={(min) => setMinute(min)} />
        <Wheel default={props.default?.second} onChange={(sec) => setSecond(sec)} />
      </div>
    </div>
  );
}

export default TimePicker;

import { useEffect, useState } from "react";
import { getDoubleDigit } from "../../lib/time";

interface IProps {
  max: number;
  value: number;
  onChange?: (value: number) => void;
}

function Wheel2(props: IProps) {
  const [value, setValue] = useState(props.value);
  const [cellArr, setCellArr] = useState<number[]>(getCellRange(props.value, props.max));

  const wheelHandler = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY > 0) {
      // Wheel down
      const tmpValue = checkNumber(value + 1, props.max);
      setValue(tmpValue);
      setCellArr(getCellRange(tmpValue, props.max));
    } else {
      // Wheel up
      const tmpValue = checkNumber(value - 1, props.max);
      setValue(tmpValue);
      setCellArr(getCellRange(tmpValue, props.max));
    }
  };

  const getStyle = (i: number) => {
    const style: React.CSSProperties | undefined = {};
    if (i < 5) {
      style.transform = `rotateX(${(i - 2) * 30}deg)`;
    }
    if (i === 2) {
      style.fontSize = "20px";
      style.color = "#D28512";
      style.fontWeight = "600";
    }
    return style;
  };

  useEffect(() => {
    setValue(props.value);
    setCellArr(getCellRange(props.value, props.max));
  }, [props.value, props.max]);

  useEffect(() => {
    if (props.onChange) props.onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="time-picker-wheel-container" onWheel={wheelHandler}>
      {cellArr.slice(0, 5).map((e, i) => {
        return (
          <div className="time-picker-wheel-cell" key={i} style={getStyle(i)}>
            {getDoubleDigit(e)}
          </div>
        );
      })}
    </div>
  );
}

function checkNumber(value: number, max: number) {
  let tmpValue = value;
  if (tmpValue < 0) {
    tmpValue = max + tmpValue + 1;
  } else if (tmpValue > max) {
    tmpValue = tmpValue - max - 1;
  }
  return tmpValue;
}

function getCellRange(value: number, max: number) {
  const arr = [];
  for (let i = 0; i < 5; i++) {
    arr.push(checkNumber(value + i - 2, max));
  }
  return arr;
}

export default Wheel2;

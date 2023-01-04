import { useCallback, useEffect, useState } from "react";

interface IProps {
  min?: number;
  max?: number;
  step?: number;
  default?: number;
  onChange?: (value: number) => void;
}

function Wheel(props: IProps) {
  const min = props.min ?? 0;
  const max = props.max ?? 59;

  const [value, setValue] = useState(props.default ?? min);
  const [cellArr, setCellArr] = useState<number[]>(getCellRange(min, max, props.default ?? min, 2));

  const wheelMinMaxValue = useCallback(
    (value: number, action: "add" | "subtract", step: number = 1) => {
      if (action === "add") {
        value += step;
      } else {
        value -= step;
      }

      if (value > max) {
        value = value - (max + 1) + min;
      } else if (value < min) {
        value = value - (min - 1) + max;
      }

      return value;
    },
    [max, min]
  );

  const wheelHandler = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY > 0) {
      // Wheel down
      setValue(wheelMinMaxValue(value, "add"));
      const tmpArr = [...cellArr];
      tmpArr.push(tmpArr.shift() ?? 0);
      setCellArr(tmpArr);
    } else {
      // Wheel up
      setValue(wheelMinMaxValue(value, "subtract"));
      const tmpArr = [...cellArr];
      tmpArr.unshift(tmpArr.pop() ?? 0);
      setCellArr(tmpArr);
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
    if (props.onChange) props.onChange(value);
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

function range(end: number, start?: number, roll?: number) {
  const resultArr: number[] = [];
  for (let i = start ?? 0; i < end; i++) {
    resultArr.push(i);
  }
  for (let i = 0; i < (roll ?? 0); i++) {
    resultArr.unshift(resultArr.pop() ?? 0);
  }

  return resultArr;
}

function getCellRange(min: number, max: number, start: number, roll?: number) {
  const resultArr: number[] = [];
  for (let i = min; i <= max; i++) {
    resultArr.push(i);
  }
  while (resultArr[0] !== start) {
    resultArr.unshift(resultArr.pop() ?? 0);
  }
  for (let i = 0; i < (roll ?? 0); i++) {
    resultArr.unshift(resultArr.pop() ?? 0);
  }

  return resultArr;
}

function getDoubleDigit(value: number) {
  if (value < 10) return `0${value}`;
  return `${value}`;
}

export default Wheel;

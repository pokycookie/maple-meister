import { useCallback, useEffect, useState } from "react";

interface IProps {
  min?: number;
  max?: number;
  step?: number;
  default?: number;
}

function Wheel(props: IProps) {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(59);
  const [value, setValue] = useState(0);
  const [cellArr, setCellArr] = useState<number[]>([]);

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

  const getCellArr = useCallback(() => {
    const resultArr = [];
    for (let i = 2; i > 0; i--) {
      resultArr.push(wheelMinMaxValue(value, "subtract", i));
    }
    resultArr.push(value);
    for (let i = 0; i < 2; i++) {
      resultArr.push(wheelMinMaxValue(value, "add", i + 1));
    }
    return resultArr;
  }, [value, wheelMinMaxValue]);

  const wheelHandler = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY > 0) {
      // Wheel down
      e.currentTarget.scrollBy({ top: 16 });
      setValue(wheelMinMaxValue(value, "subtract"));
    } else {
      // Wheel up
      e.currentTarget.scrollBy({ top: -16 });
      setValue(wheelMinMaxValue(value, "add"));
    }
  };

  useEffect(() => {
    setCellArr(getCellArr());
  }, [getCellArr, value]);

  return (
    <div className="time-picker-wheel-container" onWheel={wheelHandler}>
      {cellArr.map((e) => {
        return (
          <div className="time-picker-wheel-cell" key={e}>
            {e}
          </div>
        );
      })}
    </div>
  );
}

function range(end: number, start?: number) {
  const resultArr: number[] = [];
  for (let i = start ?? 0; i < end; i++) {
    resultArr.push(i);
  }
  return resultArr;
}

export default Wheel;

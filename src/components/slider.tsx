import React, { useEffect, useState } from "react";
import "../styles/components/slider.scss";

interface IProps {
  min: number;
  max: number;
  default?: number;
  height?: number;
  count?: number;
  onChange?: (value: number) => void;
  scrlk?: (scrlk: boolean) => void;
}

interface IStyles {
  top?: string;
  opacity?: number;
  transform?: string;
  height?: string;
}

export default function Slider(props: IProps) {
  // default값이 min ~ max 범위에 있는지 확인 필요
  const defaultIndex = props.default ? props.default - props.min : 0;
  const HEIGHT = props.height || 20;
  const COUNT = props.count || 4;

  const [valueArr, setValueArr] = useState<number[]>([]);
  const [index, setIndex] = useState<number>(defaultIndex);

  // Set valueArr
  useEffect(() => {
    const repeat = props.max - props.min + 1;
    const tempArr: number[] = [];

    for (let i = 0; i < repeat; i++) {
      tempArr.push(i + props.min);
    }
    setValueArr(tempArr);
  }, [props.max, props.min]);

  // On change
  useEffect(() => {
    if (props.onChange) props.onChange(valueArr[index]);
  }, [index, props, valueArr]);

  // Up handler
  const upValue = () => {
    let tempIndex = index + 1;
    if (tempIndex > props.max) {
      tempIndex = props.min;
    }
    setIndex(tempIndex);
  };

  // Down handler
  const downValue = () => {
    let tempIndex = index - 1;
    if (tempIndex < props.min) {
      tempIndex = props.max;
    }
    setIndex(tempIndex);
  };

  // Scroll handler
  const scrollHandler = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      upValue();
    } else {
      downValue();
    }
  };

  // Scroll lock
  const scrlk = (bool: boolean) => {
    if (props.scrlk) props.scrlk(bool);
  };

  return (
    <div className="slider" onMouseEnter={() => scrlk(true)} onMouseLeave={() => scrlk(false)}>
      <div
        className="indicators"
        onWheel={scrollHandler}
        style={{ height: `${HEIGHT * (COUNT * 2 - 1)}px` }}
      >
        <div className="current" style={{ top: `${HEIGHT * (COUNT - 1)}px`, height: HEIGHT }}></div>
        {valueArr.map((element, i) => {
          const style = getStyles(i, index, COUNT, HEIGHT, props.max);
          style.height = `${HEIGHT}px`;
          return (
            <p className="element" key={i} style={style}>
              {getDoubleDigit(element)}
            </p>
          );
        })}
      </div>
    </div>
  );
}

const getStyles = (
  i: number,
  index: number,
  count: number,
  height: number,
  max: number
): IStyles => {
  const diff = i - index;
  const rotateWeight = 80 / (count - 1);

  if (Math.abs(diff) < count + 1) {
    // no waiting area
    return {
      top: `${height * (count + diff - 1)}px`,
      opacity: 1,
      transform: `rotateX(${diff * rotateWeight}deg)`,
    };
  } else {
    if (index < count && i > max - (count - index)) {
      const diff = i - max - 1 - index;
      return {
        top: `${height * (count + diff - 1)}px`,
        opacity: 1,
        transform: `rotateX(${diff * rotateWeight}deg)`,
      };
    }
    if (index > max - count && i < count) {
      const diff = i + max - index;
      return {
        top: `${height * (count + diff)}px`,
        opacity: 1,
        transform: `rotateX(${diff * rotateWeight}deg)`,
      };
    }
    // waiting area
    return {
      top: `${height * (count * 2)}px`,
      opacity: 0,
      transform: `rotateX(${diff * rotateWeight}deg)`,
    };
  }
};

const getDoubleDigit = (value: number) => {
  if (value < 10) return `0${value}`;
  return `${value}`;
};

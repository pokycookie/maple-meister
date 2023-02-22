import { useEffect, useState } from "react";
import "./rowSelector.css";

interface IProps<T> {
  options: T[];
  onChange?: (value: T) => void;
  default?: number;
  className?: string;
}

function RowSelector<T extends string>(props: IProps<T>) {
  const [selected, setSelected] = useState(props.default ?? 0);

  const selectHandler = (index: number) => {
    setSelected(index);
  };

  const isSelected = (index: number) => {
    if (index === selected) {
      return " selected";
    } else {
      return "";
    }
  };

  useEffect(() => {
    if (props.onChange) props.onChange(props.options[selected]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className={`row__selector ${props.className}`}>
      {props.options.map((value, i) => {
        return (
          <button
            className={`row__selector--item${isSelected(i)}`}
            key={i}
            onClick={() => selectHandler(i)}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}

export default RowSelector;

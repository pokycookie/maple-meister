import { useEffect, useState } from "react";

interface IProps {
  onChange?: (value: number) => void;
  className?: string;
  unit?: string;
  separators?: boolean;
  value: number;
}

function NumberInput(props: IProps) {
  const [value, setValue] = useState(props.value);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let regex = parseInt(value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1")) || 0;
    setValue(regex);
  };

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    if (props.onChange) props.onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  let inputText = props.separators ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : value;

  return (
    <input
      className={props.className}
      value={`${inputText} ${props.unit ?? ""}`}
      onChange={changeHandler}
    />
  );
}

export default NumberInput;

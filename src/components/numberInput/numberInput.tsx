import { useEffect, useState } from "react";

interface IProps {
  onChange?: (value: number) => void;
  className?: string;
}

function NumberInput(props: IProps) {
  const [value, setValue] = useState(0);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let regex = parseInt(value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1")) || 0;
    setValue(regex);
  };

  useEffect(() => {
    if (props.onChange) props.onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <input className={props.className} value={value} onChange={changeHandler} />;
}

export default NumberInput;

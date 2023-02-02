import "./easyInput.css";

interface IProps {
  className?: string;
  onChange?: (value: number) => void;
}

function EasyInput(props: IProps) {
  const className = props.className ? ` ${props.className}` : "";

  const valueHandler = (value: number) => {
    if (props.onChange) props.onChange(value);
  };

  return (
    <div className={`easy__input${className}`}>
      <button onClick={() => valueHandler(100000000)}>+1억</button>
      <button onClick={() => valueHandler(10000000)}>+1000만</button>
      <button onClick={() => valueHandler(1000000)}>+100만</button>
      <button onClick={() => valueHandler(100000)}>+10만</button>
      <button onClick={() => valueHandler(10000)}>+1만</button>
      <button onClick={() => valueHandler(-100000000)}>-1억</button>
      <button onClick={() => valueHandler(-10000000)}>-1000만</button>
      <button onClick={() => valueHandler(-1000000)}>-100만</button>
      <button onClick={() => valueHandler(-100000)}>-10만</button>
      <button onClick={() => valueHandler(-10000)}>-1만</button>
    </div>
  );
}

export default EasyInput;

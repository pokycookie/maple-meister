import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useEffect, useRef, useState } from "react";
import "./dropdown.css";

interface IProps {
  children?: ReactNode;
  value: string | number;
}

function Dropdown(props: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const EDropdown = useRef(null);

  const openHandler = () => {
    if (!isOpen) setIsOpen(true);
  };

  useEffect(() => {
    const closeHandler = (e: MouseEvent) => {
      if (
        EDropdown.current &&
        !(EDropdown.current as HTMLElement).contains(e.target as HTMLElement)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", closeHandler);
    return () => {
      document.removeEventListener("click", closeHandler);
    };
  }, [isOpen]);

  return (
    <div className="dropdown" ref={EDropdown} onClick={openHandler}>
      <div className="dropdown--control">
        <div className="placeholder">{props.value}</div>
        <div className="divider"></div>
        <div className="open__btn">
          <FontAwesomeIcon icon={faAngleDown} />
        </div>
      </div>
      {isOpen ? <div className="dropdown--menu">{props.children}</div> : null}
    </div>
  );
}

export default Dropdown;

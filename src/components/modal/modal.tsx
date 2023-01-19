import ReactDOM from "react-dom";
import "./modal.css";

interface IProps {
  open: boolean;
  children?: JSX.Element | JSX.Element[];
  onClick?: () => void;
}

function Modal(props: IProps) {
  const clickHandler = () => {
    if (props.onClick) props.onClick();
  };

  const modalRoot = document.getElementById("modal-position");
  const modalArea = (
    <div className="modal-area" onClick={clickHandler}>
      {props.children}
    </div>
  );
  if (modalRoot) {
    if (props.open) {
      return ReactDOM.createPortal(modalArea, modalRoot);
    } else {
      return <></>;
    }
  } else {
    return <></>;
  }
}

export function ModalArea() {
  return <div id="modal-position"></div>;
}

export default Modal;

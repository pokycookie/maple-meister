import { useEffect } from "react";
import ReactDOM from "react-dom";
import "./modal.css";
import { AnimatePresence, motion } from "framer-motion";

interface IProps {
  open: boolean;
  children?: JSX.Element | JSX.Element[];
  onClick?: () => void;
  position?: "top" | "center" | "bottom";
  width?: string;
  height?: string;
}

function Modal(props: IProps) {
  const clickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = (e.target as Element).className === "modal-area";
    if (props.onClick && target) props.onClick();
  };

  let alignItems = "flex-end";
  switch (props.position) {
    case "top":
      alignItems = "flex-start";
      break;
    case "center":
      alignItems = "center";
      break;
    case "bottom":
      alignItems = "flex-end";
      break;
    default:
      alignItems = "center";
  }

  useEffect(() => {});

  const width = props.width;
  const height = props.height;

  const modalRoot = document.getElementById("modal-position");
  const modalArea = (
    <AnimatePresence>
      {props.open && (
        <motion.div
          key="modal"
          className="modal-area"
          onClick={clickHandler}
          style={{ alignItems }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-container"
            style={{ width, height }}
            initial={{ y: 300 }}
            animate={{ y: 0 }}
          >
            {props.children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  if (modalRoot) {
    return ReactDOM.createPortal(modalArea, modalRoot);
  } else {
    return <></>;
  }
}

export function ModalArea() {
  return <div id="modal-position"></div>;
}

export default Modal;

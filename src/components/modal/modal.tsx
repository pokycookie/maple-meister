import ReactDOM from "react-dom";
import "./modal.css";
import { AnimatePresence, motion } from "framer-motion";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { IReduxStore, RSetModalID } from "../../redux";

interface IProps {
  modalID: string;
  children?: JSX.Element | JSX.Element[];
  autoClose?: boolean;
  position?: "top" | "center" | "bottom";
  width?: string;
  maxWidth?: string;
  height?: string;
  minHeight?: string;
}

function Modal(props: IProps) {
  const modalID = useSelector<IReduxStore, string | null>((state) => {
    return state.modalID;
  }, shallowEqual);

  const dispatch = useDispatch();

  const clickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = (e.target as Element).id === "modal-area";
    if (props.autoClose && target) dispatch(RSetModalID(null));
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

  const width = props.width;
  const height = props.height;
  const maxWidth = props.maxWidth;
  const minHeight = props.minHeight;

  const modalRoot = document.getElementById("modal-position");
  const modalArea = (
    <AnimatePresence>
      {props.modalID === modalID && (
        <motion.div
          key="modal"
          id="modal-area"
          onClick={clickHandler}
          style={{ alignItems }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-container"
            style={{ width, height, maxWidth, minHeight }}
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

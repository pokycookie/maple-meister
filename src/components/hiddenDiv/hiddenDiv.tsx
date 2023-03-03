import { ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import "./hiddenDiv.css";
import { shallowEqual, useSelector } from "react-redux";
import { IReduxStore } from "../../redux";
import { TPage } from "../../types";

interface IProps {
  children?: ReactNode;
  onChange?: (isOpen: boolean) => void;
}

function HiddenDiv(props: IProps) {
  const [isOpen, setIsOpen] = useState(false);

  const page = useSelector<IReduxStore, TPage>((state) => {
    return state.page;
  }, shallowEqual);

  const backClickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) setIsOpen(false);
  };

  const btnHandler = () => {
    setIsOpen((prev) => (prev ? false : true));
  };

  const invisible = (p: TPage) => {
    if (page === p) return "";
    else return " invisible";
  };

  useEffect(() => {
    if (props.onChange) props.onChange(isOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const variants = {
    open: { y: 0 },
    closed: { y: 220 },
  };

  const portalRoot = document.getElementById("main");
  const returnNode = (
    <motion.div
      className={`hidden__div${invisible("recipe")}`}
      animate={isOpen ? "open" : "closed"}
      variants={variants}
      onClick={backClickHandler}
    >
      <div className="hidden__div--container">
        <button className="hidden__div--btn" onClick={btnHandler}></button>
        <div className="hidden__div--main">{props.children}</div>
      </div>
    </motion.div>
  );

  if (portalRoot) return ReactDOM.createPortal(returnNode, portalRoot);
  else return <></>;
}

export default HiddenDiv;

import "./toggleBtn.css";
import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";

interface IProps {
  onChange?: (toggle: boolean) => void;
  toggle?: boolean;
}

const xPosition: Variants = {
  on: { x: 30 },
  off: { x: 0 },
};

const background: Variants = {
  on: { backgroundColor: "#d28512" },
  off: { backgroundColor: "#2c3333" },
};

function ToggleBtn(props: IProps) {
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (props.onChange) props.onChange(toggle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggle]);

  useEffect(() => {
    if (props.toggle !== toggle) setToggle(toggle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.toggle]);

  return (
    <motion.div
      className="toggle__btn"
      variants={background}
      animate={toggle ? "on" : "off"}
      onClick={() => setToggle(!toggle)}
    >
      <motion.div className="toggle__btn--dot" variants={xPosition} animate={toggle ? "on" : "off"}>
        {toggle ? "ON" : "OFF"}
      </motion.div>
    </motion.div>
  );
}

export default ToggleBtn;

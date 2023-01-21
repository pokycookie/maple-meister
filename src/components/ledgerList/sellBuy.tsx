import { faArrowRightFromBracket, faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./sellBuy.css";

interface IProps {
  type: "sell" | "buy";
}

function SellBuy(props: IProps) {
  const text =
    props.type === "sell" ? (
      <FontAwesomeIcon icon={faArrowRightFromBracket} />
    ) : (
      <FontAwesomeIcon icon={faArrowRightToBracket} />
    );

  return <div className={`sellBuy ${props.type}`}>{text}</div>;
}

export default SellBuy;

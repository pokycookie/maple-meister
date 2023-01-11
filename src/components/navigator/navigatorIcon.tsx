import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { IReduxStore, RSetPage } from "../../redux";
import { TPage } from "../../types";

interface IProps {
  icon: IconDefinition;
  page?: TPage;
  onClick?: () => void;
}

function NavigatorIcon(props: IProps) {
  const page = useSelector<IReduxStore, TPage>((state) => {
    return state.page;
  }, shallowEqual);
  const dispatch = useDispatch();

  const selected = page === props.page ? " selected" : "";

  const clickHandler = () => {
    if (props.onClick) props.onClick();
    if (props.page) dispatch(RSetPage(props.page));
  };

  return (
    <div className={`nav-icon-area${selected}`} onClick={clickHandler}>
      <FontAwesomeIcon className="nav-icon" icon={props.icon} />
    </div>
  );
}

export default NavigatorIcon;

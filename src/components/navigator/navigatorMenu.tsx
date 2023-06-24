import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { IReduxStore, RSetPage } from "../../redux";
import { TPage } from "../../types";

interface IProps {
  title?: string;
  icon: IconDefinition;
  page?: TPage;
}

function NavigatorMenu(props: IProps) {
  const page = useSelector<IReduxStore, TPage>((state) => {
    return state.page;
  }, shallowEqual);
  const dispatch = useDispatch();

  const selected = page === props.page ? " selected" : "";

  const clickHandler = () => {
    if (props.page) dispatch(RSetPage(props.page));
  };

  return (
    <div className={`menu${selected}`} onClick={clickHandler}>
      <div className="nav-icon-area">
        <FontAwesomeIcon className="nav-icon" icon={props.icon} />
      </div>
      <p className="menuTitle">{props.title}</p>
    </div>
  );
}

export default NavigatorMenu;

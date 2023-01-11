import { shallowEqual, useSelector } from "react-redux";
import TimerPage from "../../pages/timer";
import { IReduxStore } from "../../redux";
import { TPage } from "../../types";

function PageSwitcher() {
  const page = useSelector<IReduxStore, TPage>((state) => {
    return state.page;
  }, shallowEqual);

  const invisible = (p: TPage) => {
    if (page === p) return "";
    else return " invisible";
  };

  return (
    <div className={`page${invisible("timer")}`}>
      <TimerPage />
    </div>
  );
}

export default PageSwitcher;

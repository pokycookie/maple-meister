import { shallowEqual, useSelector } from "react-redux";
import TimerPage from "../../pages/timer";
import { IReduxStore } from "../../redux";
import { TPage } from "../../types";
import ItemPage from "../../pages/item";
import LedgerPage from "../../pages/ledger";
import RecipePage from "../../pages/recipe";
import ChartPage from "../../pages/chart";
import SettingPage from "../../pages/setting";

function PageSwitcher() {
  const page = useSelector<IReduxStore, TPage>((state) => {
    return state.page;
  }, shallowEqual);

  const invisible = (p: TPage) => {
    if (page === p) return "";
    else return " invisible";
  };

  return (
    <>
      <div className={`page${invisible("timer")}`}>
        <TimerPage />
      </div>
      <div className={`page${invisible("item")}`}>
        <ItemPage />
      </div>
      <div className={`page${invisible("ledger")}`}>
        <LedgerPage />
      </div>
      <div className={`page${invisible("recipe")}`}>
        <RecipePage />
      </div>
      <div className={`page${invisible("chart")}`}>
        <ChartPage />
      </div>
      <div className={`page${invisible("setting")}`}>
        <SettingPage />
      </div>
    </>
  );
}

export default PageSwitcher;

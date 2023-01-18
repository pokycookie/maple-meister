import "./styles/app.scss";
import Navigator from "./components/navigator/navigator";
import PageSwitcher from "./components/pageSwitcher/pageSwitcher";
import { useEffect } from "react";
import { db } from "./db";
import { useDispatch } from "react-redux";
import { RSetItemList } from "./redux";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const setItemList = async () => {
      const itemList = await db.item.toArray();
      dispatch(RSetItemList(itemList));
    };
    setItemList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <nav>
        <Navigator />
      </nav>
      <main>
        <PageSwitcher />
      </main>
      {/* <button
        className="permissionBtn"
        onClick={() => {
          if (Notification.permission === "denied") {
            alert("알림 권한을 허용해주세요.");
          } else {
            alert("알림 권한이 허용되어 있습니다.");
          }
        }}
      ></button> */}
    </div>
  );
}

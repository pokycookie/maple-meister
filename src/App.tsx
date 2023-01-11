import "./styles/app.scss";
import Navigator from "./components/navigator/navigator";
import PageSwitcher from "./components/pageSwitcher/pageSwitcher";

export default function App() {
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

import "./styles/app.scss";
import TimerPage from "./pages/timer";
import Navigator from "./components/navigator/navigator";

export default function App() {
  return (
    <div className="App">
      <nav>
        <Navigator />
      </nav>
      <main>
        <TimerPage />
      </main>
      <button
        className="permissionBtn"
        onClick={() => {
          if (Notification.permission === "denied") {
            alert("알림 권한을 허용해주세요.");
          } else {
            alert("알림 권한이 허용되어 있습니다.");
          }
        }}
      ></button>
    </div>
  );
}

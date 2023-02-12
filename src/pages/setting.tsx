import MMDFReader from "../components/mmdf/mmdfReader";
import "../styles/pages/setting.scss";

function SettingPage() {
  return (
    <div className="setting__page">
      <MMDFReader onChange={(data) => console.log(data)} />
    </div>
  );
}

export default SettingPage;

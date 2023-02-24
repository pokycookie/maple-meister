import MMDFReader from "../components/mmdf/mmdfReader";
import MMDFWriter from "../components/mmdf/mmdfWriter";
import SettingBox from "../components/settingBox/settingBox";
import "../styles/pages/setting.scss";

function SettingPage() {
  return (
    <div className="setting__page">
      <SettingBox title="MMDF" />
      <MMDFReader onChange={(data) => console.log(data)} />
      <MMDFWriter type="recipe" />
    </div>
  );
}

export default SettingPage;

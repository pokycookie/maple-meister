import MMDFReader from "../components/mmdf/mmdfReader";
import MMDFWriter from "../components/mmdf/mmdfWriter";
import "../styles/pages/setting.scss";

function SettingPage() {
  return (
    <div className="setting__page">
      {/* <SettingBox title="데이터 백업" /> */}
      <div className="container">
        <p className="title">데이터 백업</p>
        <MMDFWriter type="backup" />
      </div>
      <div className="container">
        <p className="title">데이터 복구</p>
        <MMDFReader onChange={(data) => console.dir(data)} />
      </div>
    </div>
  );
}

export default SettingPage;

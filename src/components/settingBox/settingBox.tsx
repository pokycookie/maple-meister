import { ReactNode } from "react";
import ToggleBtn from "../toggleBtn/toggleBtn";
import "./settingBox.css";

type TSettingOption = "toggle" | "modal" | "active";

interface ISettingOption {
  text: string;
  type: TSettingOption;
  modal?: ReactNode;
  active?: () => void;
  toggle?: (toggle: boolean) => void;
}

interface IProps {
  title?: string;
  options?: ISettingOption[];
}

function SettingBox(props: IProps) {
  return (
    <div className="setting__box">
      <div className="setting__box--title">{props.title}</div>
      <div className="setting__box--container">
        {props.options?.map((e, i) => {
          return <Setting key={i} data={e} />;
        })}
      </div>
    </div>
  );
}

function Setting(props: { data: ISettingOption }) {
  switch (props.data.type) {
    case "active":
      return (
        <div className="setting__box--option option--active" onClick={props.data.active}></div>
      );
    case "modal":
      return <div className="setting__box--option option--modal"></div>;
    case "toggle":
      return (
        <div className="setting__box--option option--toggle">
          <div className="setting__box--text"></div>
          <ToggleBtn />
        </div>
      );
  }
}

export default SettingBox;

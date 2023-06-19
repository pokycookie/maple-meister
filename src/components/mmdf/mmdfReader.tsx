import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import {
  IMMDF__DATA,
  IMMDF__FILE,
  setItem,
  setItemLog,
  setLedger,
  setRecipe,
  TFile,
  TReaderOption,
  upload,
} from "../../lib/fileSystem";
import Modal from "../modal/modal";
import "./mmdf.css";
import { RSetModalID } from "../../redux";

interface IProps {
  onChange?: (data: IMMDF__FILE) => void;
  option?: TReaderOption;
}

function MMDFReader(props: IProps) {
  const dispatch = useDispatch();

  const mmdfHandler = async (fileData: IMMDF__DATA, type: TFile, option?: TReaderOption) => {
    try {
      switch (type) {
        case "backup":
          await mmdfHandler(fileData, "item", "force");
          await mmdfHandler(fileData, "recipe", "force");
          await mmdfHandler(fileData, "itemLog", "force");
          await mmdfHandler(fileData, "ledger", "force");
          break;
        case "item":
          await setItem(fileData, option);
          break;
        case "recipe":
          await setRecipe(fileData, option);
          break;
        case "itemLog":
          await setItemLog(fileData, option);
          break;
        case "ledger":
          await setLedger(fileData, option);
          break;
        case "setting":
          break;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clickHandler = async () => {
    dispatch(RSetModalID(null));
    const data = await upload();
    if (data.meta.type === "backup") {
      await mmdfHandler(data.data.backup!, data.meta.type, props.option);
    } else {
      await mmdfHandler(data.data, data.meta.type, props.option);
    }
    if (props.onChange) props.onChange(data);
    window.location.reload();
  };

  return (
    <>
      <button className="mmdf__reader" onClick={() => dispatch(RSetModalID("dataResetWarning"))}>
        <FontAwesomeIcon icon={faDownload} />
      </button>
      <Modal modalID="dataResetWarning" autoClose width="auto" height="auto">
        <div className="warning">
          <p className="title">경고</p>
          <span className="text">
            <p>데이터 복구를 진행하면 현재 존재하는 모든 데이터가 삭제됩니다.</p>
            <p>정말로 진행하시겠습니까?</p>
          </span>
          <div className="btn__area">
            <button onClick={clickHandler}>확인</button>
            <button onClick={() => dispatch(RSetModalID(null))}>취소</button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default MMDFReader;

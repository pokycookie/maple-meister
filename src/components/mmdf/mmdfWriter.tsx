import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { db } from "../../db";
import { download, IMMDF, TFile } from "../../lib/fileSystem";

interface IProps {
  type: TFile;
}

function MMDFWriter(props: IProps) {
  const getData = async (type: TFile) => {
    let tmpData: IMMDF = {};
    switch (type) {
      case "backup":
        tmpData.backup = {};
        tmpData.backup.item = await db.item.toArray();
        tmpData.backup.recipe = await db.recipe.toArray();
        tmpData.backup.itemLog = await db.itemLog.toArray();
        tmpData.backup.ledger = await db.ledger.toArray();
        break;
      case "item":
        tmpData.item = await db.item.toArray();
        break;
      case "recipe":
        tmpData.recipe = await db.recipe.toArray();
        break;
      case "itemLog":
        tmpData.itemLog = await db.itemLog.toArray();
        break;
      case "ledger":
        tmpData.ledger = await db.ledger.toArray();
        break;
      case "setting":
        break;
    }
    return tmpData;
  };

  const clickHandler = async () => {
    download(await getData(props.type), props.type);
  };

  return (
    <button className="mmdf__writer" onClick={clickHandler}>
      <FontAwesomeIcon icon={faUpload} />
    </button>
  );
}

export default MMDFWriter;

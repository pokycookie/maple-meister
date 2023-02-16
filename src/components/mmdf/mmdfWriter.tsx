import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { db } from "../../db";
import { download, IMMDF__data, TFile } from "../../lib/fileSystem";

interface IProps {
  type: TFile;
}

function MMDFWriter(props: IProps) {
  const [data, setData] = useState<IMMDF__data>({});

  const getData = async (type: TFile) => {
    let tmpData: IMMDF__data = {};
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
    setData(tmpData);
  };

  const clickHandler = () => {
    download(data, props.type);
  };

  useEffect(() => {
    getData(props.type);
  }, [props.type]);

  return (
    <button className="mmdf__writer" onClick={clickHandler}>
      <FontAwesomeIcon icon={faDownload} />
    </button>
  );
}

export default MMDFWriter;

import { useEffect, useState } from "react";
import { db, IDBLedger } from "../../db";
import { decimalSeparator } from "../../lib/numberString";
import { getSimpeTimeText } from "../../lib/time";
import "./ledgerList.css";

interface IProps {
  data: IDBLedger;
}

function LedgerList(props: IProps) {
  const [item, setItem] = useState<string>("");
  const data = props.data;

  useEffect(() => {
    const setItemName = async () => {
      const tmpItem = (await db.item.get(data.item))?.name ?? "";
      setItem(tmpItem);
    };
    setItemName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <li className="ledger__list">
      <div className="ledger__list--left">
        <p className="ledger__list--item">{item}</p>
        <p className="ledger__list--updated">{getSimpeTimeText(data.updated)}</p>
      </div>
      <div className="ledger__list--right">
        <p className="ledger__list--price">
          {data.type === "buy" ? "-" : "+"}
          {decimalSeparator(data.price * data.count)}메소
        </p>
        <p className="ledger__list--assets">잔액 {decimalSeparator(data.assets)}메소</p>
      </div>
    </li>
  );
}

export default LedgerList;

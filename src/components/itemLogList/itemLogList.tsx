import { useEffect, useState } from "react";
import { db, IDBItemLog } from "../../db";
import { decimalSeparator } from "../../lib/numberString";
import { getSimpeTimeText } from "../../lib/time";
import "./itemLogList.css";

interface IProps {
  data: IDBItemLog;
  diff: number;
}

function ItemLogList(props: IProps) {
  const [item, setItem] = useState<string>("");

  useEffect(() => {
    const setItemName = async () => {
      const tmpItem = (await db.item.get(props.data.item))?.name ?? "";
      setItem(tmpItem);
    };
    setItemName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <li className="item__log__list">
      <div className="item__log__list--left">
        <p className="item__log__list--item">{item}</p>
        <p className="item__log__list--updated">{getSimpeTimeText(props.data.updated)}</p>
      </div>
      <div className="item__log__list--right">
        <p className="item__log__list--price">{decimalSeparator(props.data.price)}메소</p>
        <p className="item__log__list--assets">
          {props.diff < 0 ? "-" : "+"}
          {decimalSeparator(Math.abs(props.diff))}메소
        </p>
      </div>
    </li>
  );
}

export default ItemLogList;

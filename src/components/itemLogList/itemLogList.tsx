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
  const [item, setItem] = useState<string | null>(null);

  useEffect(() => {
    const setItemName = async () => {
      const tmpItem = (await db.item.get(props.data.item))?.name ?? null;
      setItem(tmpItem);
    };
    setItemName();
  }, [props.data]);

  return (
    <div className="item__log__list">
      <div className="item__log__list--left">
        {item ? (
          <p className="item__log__list--item">{item}</p>
        ) : (
          <p className="item__log__list--item deleted__item">[삭제된 아이템]</p>
        )}
        <p className="item__log__list--updated">{getSimpeTimeText(props.data.updated)}</p>
      </div>
      <div className="item__log__list--right">
        <p className="item__log__list--price">{decimalSeparator(props.data.price)}메소</p>
        <p className="item__log__list--assets">
          {props.diff < 0 ? "-" : "+"}
          {decimalSeparator(Math.abs(props.diff))}메소
        </p>
      </div>
    </div>
  );
}

export default ItemLogList;

import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Select, { SingleValue } from "react-select";
import { IDBItem } from "../../db";
import { Noti } from "../../lib/notification";
import { IReduxStore } from "../../redux";
import EasyInput from "../easyInput/easyInput";
import NumberInput from "../numberInput/numberInput";
import "./itemPriceInput.css";

interface IProps {
  items: IDBItem[];
  onChange?: (item: number, price: number) => void;
}

function ItemPriceInput(props: IProps) {
  const [item, setItem] = useState<number | null>(null);
  const [price, setPrice] = useState<number>(0);

  const itemList = useSelector<IReduxStore, IDBItem[]>((state) => {
    return state.itemList;
  }, shallowEqual);

  const selectHandler = (e: SingleValue<{ value: number; label: string }>) => {
    if (e) setItem(e.value);
    else setItem(null);
  };

  const editHandler = () => {
    if (item) {
      if (props.onChange) props.onChange(item, price);
    } else {
      Noti.warning("아이템을 선택해주세요");
    }
  };

  useEffect(() => {
    if (item) {
      const price = props.items.find((e) => e.id === item)?.price ?? 0;
      setPrice(price);
    } else {
      setPrice(0);
    }
  }, [item, props.items]);

  const options = itemList.map((e) => {
    return { value: e.id!, label: e.name };
  });

  return (
    <div className="item__price__input">
      <Select
        className="item__price__input--select"
        options={options}
        isClearable={true}
        onChange={selectHandler}
        maxMenuHeight={33 * 6}
      />
      <NumberInput
        className="item__price__input--input"
        unit="메소"
        value={price}
        separators
        onChange={(value) => setPrice(value)}
      />
      <EasyInput onChange={(value) => setPrice((prev) => prev + value)} />
      <button className="item__price__input--btn" onClick={editHandler}>
        <FontAwesomeIcon icon={faPenToSquare} />
      </button>
    </div>
  );
}

export default ItemPriceInput;

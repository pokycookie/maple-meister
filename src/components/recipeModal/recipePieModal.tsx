import React, { useEffect, useState } from "react";
import { db, IDBItem, IDBRecipe } from "../../db";
import { decimalSeparator } from "../../lib/numberString";
import { updateItem } from "../../utils/dexie";
import EasyInput from "../easyInput/easyInput";
import NumberInput from "../numberInput/numberInput";
import "./recipePieModal.css";

interface IProps {
  data: IDBRecipe | null;
}

function RecipePieModal(props: IProps) {
  const [items, setItems] = useState<IDBItem[]>([]);
  const [selectedData, setSelectedData] = useState<IDBItem | null>(null);

  const initItems = async () => {
    const tmpItems = await db.item.toArray();
    setItems(tmpItems);
  };

  const getItem = (id: number) => {
    const itemObj = items.find((e) => e.id === id) ?? null;
    if (itemObj) {
      return itemObj;
    }
    return null;
  };

  const subModalHandler = (item: IDBItem | null) => {
    setSelectedData(item);
  };

  useEffect(() => {
    if (selectedData === null) initItems();
  }, [selectedData]);

  useEffect(() => {
    initItems();
  }, []);

  if (!props.data) return <>Error</>;
  return (
    <div className="recipe__pie__modal">
      {selectedData ? (
        <EditSubModal data={selectedData} setSubModal={setSelectedData} />
      ) : (
        <React.Fragment>
          <div
            className="pie__modal--result"
            onClick={() => subModalHandler(getItem(props.data!.resultItem))}
          >
            <p className="result--info">{getItem(props.data.resultItem)?.name}</p>
            <p className="result--price">
              {decimalSeparator(getItem(props.data.resultItem)?.price ?? 0)}메소
            </p>
          </div>
          <ul className="pie__modal--ul">
            {props.data.items.map((item, i) => {
              return (
                <li
                  className="pie__modal--li"
                  key={i}
                  onClick={() => subModalHandler(getItem(item.id))}
                >
                  <p className="item__list--info">{getItem(item.id)?.name}</p>
                  <p className="item__list--price">
                    {decimalSeparator(getItem(item.id)?.price ?? 0)}메소
                  </p>
                </li>
              );
            })}
          </ul>
        </React.Fragment>
      )}
    </div>
  );
}

interface ISubProps {
  data: IDBItem;
  setSubModal: React.Dispatch<React.SetStateAction<IDBItem | null>>;
}

function EditSubModal(props: ISubProps) {
  const [price, setPrice] = useState(props.data.price);

  const backToMainModal = () => {
    props.setSubModal(null);
  };

  const updateHandler = async () => {
    const itemID = props.data.id!;
    await updateItem(itemID, price);
  };

  const cancelHandler = () => {
    backToMainModal();
  };

  return (
    <div className="sub__modal">
      <p className="item__name">{props.data.name}</p>
      <NumberInput
        className="item__price"
        value={price}
        onChange={(price) => setPrice(price)}
        unit="메소"
        separators
      />
      <EasyInput onChange={(value) => setPrice((prev) => prev + value)} />
      <div className="btn__area">
        <button className="btn--ok" onClick={updateHandler}>
          적용
        </button>
        <button className="btn--cancel" onClick={cancelHandler}>
          취소
        </button>
      </div>
    </div>
  );
}

export default RecipePieModal;

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "../styles/pages/item.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NumberInput from "../components/numberInput/numberInput";
import Select, { SingleValue } from "react-select";
import { useEffect, useState } from "react";
import { IDBItem, db } from "../db";
import { Store } from "react-notifications-component";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

function ItemPage() {
  const [itemList, setItemList] = useState<IDBItem[]>([]);
  const [item, setItem] = useState<number | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [addItem, setAddItem] = useState<string>("");

  const refreshDB = async () => {
    const data = await db.item.toArray();
    setItemList(data);
  };

  const addHandler = () => {
    // setModalOpen((prev) => (prev ? false : true));
    db.item
      .add({ name: addItem, price: 0 })
      .then(() => {
        Store.addNotification({
          title: `${addItem}`,
          message: `새로운 아이템이 추가되었습니다`,
          type: "success",
          insert: "top",
          container: "top-right",
          dismiss: {
            duration: 3000,
          },
        });
      })
      .catch((err) => {
        console.error(err);
        Store.addNotification({
          title: "Error",
          message: `새로운 아이템을 추가하지 못했습니다`,
          type: "danger",
          insert: "top",
          container: "top-right",
          dismiss: {
            duration: 3000,
          },
        });
      });
    setAddItem("");
    refreshDB();
  };

  const selectHandler = (e: SingleValue<{ value: number; label: string }>) => {
    if (e) setItem(e.value);
    else setItem(null);
  };

  const priceHandler = (value: number) => {
    setPrice(value);
  };

  const textHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddItem(e.target.value);
  };

  const editHandler = () => {
    if (item) {
      db.item
        .update(item, { price })
        .then(() => {
          Store.addNotification({
            message: `아이템 가격이 업데이트 되었습니다`,
            type: "success",
            insert: "top",
            container: "top-right",
            dismiss: {
              duration: 3000,
            },
          });
        })
        .catch((err) => {
          console.error(err);
          Store.addNotification({
            title: "Error",
            message: `가격을 업데이트 하지 못했습니다`,
            type: "danger",
            insert: "top",
            container: "top-right",
            dismiss: {
              duration: 3000,
            },
          });
        });
    } else {
      Store.addNotification({
        message: `아이템을 선택해주세요`,
        type: "warning",
        insert: "top",
        container: "top-right",
        dismiss: {
          duration: 3000,
        },
      });
    }
  };

  const options = itemList.map((e) => {
    return { value: e.id!, label: e.name };
  });

  useEffect(() => {
    if (item) {
      db.item
        .get(item)
        .then((e) => {
          if (e) setPrice(e.price);
        })
        .catch((err) => console.error(err));
    } else {
      setPrice(0);
    }
  }, [item]);

  useEffect(() => {
    refreshDB();
  }, []);

  return (
    <div className="item-page">
      <div className="edit-area">
        <Select
          className="edit-select"
          options={options}
          isClearable={true}
          onChange={selectHandler}
          maxMenuHeight={35 * 6}
        />
        <NumberInput
          className="edit-input"
          unit="메소"
          value={price}
          separators
          onChange={(value) => priceHandler(value)}
        />
        <button className="edit-btn" onClick={editHandler}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      </div>
      <div className="btn-area">
        <input
          type="text"
          placeholder="추가할 아이템을 입력하세요"
          value={addItem}
          onChange={textHandler}
        />
        <button className="add-btn circleBtn" onClick={addHandler}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </div>
  );
}

export default ItemPage;

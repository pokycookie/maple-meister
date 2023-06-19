import { faFolderOpen, faList, faPen } from "@fortawesome/free-solid-svg-icons";
import "../styles/pages/item.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NumberInput from "../components/numberInput/numberInput";
import Select, { SingleValue } from "react-select";
import React, { useEffect, useState } from "react";
import { IDBItem, db, IDBItemLog } from "../db";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { IReduxStore, RSetItemList, RSetModalID } from "../redux";
import { Noti } from "../lib/notification";
import Modal from "../components/modal/modal";
import { checkDateEqual } from "../lib/time";
import ItemLogList from "../components/itemLogList/itemLogList";
import EasyInput from "../components/easyInput/easyInput";
import { SELECT_ITEM_ERR } from "../lang/noti";
import { createItem, deleteItem, deleteItemLog, updateItem } from "../utils/dexie";
import EditableList from "../components/editableList/editableList";

function ItemPage() {
  const [item, setItem] = useState<number | null>(null);
  const [price, setPrice] = useState<number>(0);

  const itemList = useSelector<IReduxStore, IDBItem[]>((state) => {
    return state.itemList;
  }, shallowEqual);

  const dispatch = useDispatch();

  const selectHandler = (e: SingleValue<{ value: number; label: string }>) => {
    if (e) setItem(e.value);
    else setItem(null);
  };

  const refreshDB = async () => {
    const data = await db.item.toArray();
    dispatch(RSetItemList(data));
  };

  const updateHandler = async () => {
    if (!item) {
      Noti.warning(SELECT_ITEM_ERR);
      return;
    }
    await updateItem(item, price);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="item-page">
      <div className="edit-area">
        <Select
          className="edit-select"
          options={options}
          isClearable={true}
          onChange={selectHandler}
          maxMenuHeight={33 * 6}
        />
        <NumberInput
          className="edit-input"
          unit="메소"
          value={price}
          separators
          onChange={(value) => setPrice(value)}
        />
        <EasyInput onChange={(value) => setPrice((prev) => prev + value)} />
        <button className="edit-btn" onClick={updateHandler}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      </div>
      <div className="btn-area">
        <button className="add-btn circleBtn" onClick={() => dispatch(RSetModalID("itemEdit"))}>
          <FontAwesomeIcon icon={faPen} />
        </button>
        <button className="list-btn circleBtn" onClick={() => dispatch(RSetModalID("itemLog"))}>
          <FontAwesomeIcon icon={faList} />
        </button>
      </div>
      <Modal modalID="itemEdit" width="60%" height="50%" maxWidth="550px" autoClose>
        <ItemEditModal />
      </Modal>
      <Modal modalID="itemLog" width="60%" height="70%" maxWidth="550px" autoClose>
        <ItemLogModal />
      </Modal>
    </div>
  );
}

function ItemEditModal() {
  const [itemName, setItemName] = useState<string>("");

  const dispatch = useDispatch();

  const itemList = useSelector<IReduxStore, IDBItem[]>((state) => {
    return state.itemList;
  }, shallowEqual);

  const refreshDB = async () => {
    const data = await db.item.toArray();
    dispatch(RSetItemList(data));
  };

  const createHandler = async () => {
    await createItem(itemName);
    setItemName("");
    refreshDB();
  };

  const deleteHandler = async (item: IDBItem) => {
    await deleteItem(item.id!);
    refreshDB();
  };

  const textHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemName(e.target.value);
  };

  return (
    <div className="item__edit--container">
      <div className="add--area">
        <input
          type="text"
          placeholder="추가할 아이템을 입력하세요"
          autoFocus
          value={itemName}
          onChange={textHandler}
          onKeyDown={(e) => {
            if (e.nativeEvent.key === "Enter") createHandler();
          }}
        />
        <button onClick={createHandler}>추가</button>
      </div>
      <ul>
        {itemList.map((e, i) => {
          return (
            <EditableList
              key={e.id ?? i}
              deleteHandler={() => {
                deleteHandler(e);
              }}
            >
              <div key={e.id!}>
                <p>{e.name}</p>
              </div>
            </EditableList>
          );
        })}
      </ul>
    </div>
  );
}

interface IDBItemLogPrev extends IDBItemLog {
  prevPrice: number;
}

function ItemLogModal() {
  const [itemLog, setItemLog] = useState<IDBItemLogPrev[]>([]);

  const updateItemLog = async () => {
    const prev: { [key: number]: number } = {};
    const tmpItemLog = await db.itemLog.toArray();
    const tmpItemLogPrev: IDBItemLogPrev[] = tmpItemLog.map((e) => {
      let prevPrice = e.price;
      if (prev.hasOwnProperty(e.item)) {
        prevPrice = prev[e.item];
      }
      prev[e.item] = e.price;
      return { id: e.id, item: e.item, price: e.price, updated: e.updated, prevPrice };
    });
    setItemLog(tmpItemLogPrev);
  };

  const deleteHandler = async (logID: number) => {
    await deleteItemLog(logID);
    updateItemLog();
  };

  useEffect(() => {
    updateItemLog();
  }, []);

  return (
    <div className="item__log--container">
      {itemLog.length !== 0 || (
        <div className="item__log--empty">
          <FontAwesomeIcon className="empty--icon" icon={faFolderOpen} />
          <p className="empty--text">아이템 기록이 존재하지 않습니다</p>
        </div>
      )}
      <ul className="item__log--ul">
        {itemLog.map((e, i, arr) => {
          return (
            <React.Fragment key={i}>
              {(i === 0 || !checkDateEqual(e.updated, arr[i - 1].updated)) && (
                <p className="item__log--seperator">{e.updated.toLocaleDateString()}</p>
              )}
              <EditableList
                key={e.id ?? i}
                deleteHandler={() => {
                  deleteHandler(e.id!);
                }}
              >
                <ItemLogList data={e} diff={e.price - e.prevPrice} />
              </EditableList>
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
}

export default ItemPage;

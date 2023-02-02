import { faFolderOpen, faList, faPlus } from "@fortawesome/free-solid-svg-icons";
import "../styles/pages/item.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NumberInput from "../components/numberInput/numberInput";
import Select, { SingleValue } from "react-select";
import React, { useEffect, useState } from "react";
import { IDBItem, db, IDBItemLog } from "../db";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { IReduxStore, RSetItemList } from "../redux";
import { Noti } from "../lib/notification";
import Modal from "../components/modal/modal";
import { checkDateEqual } from "../lib/time";
import ItemLogList from "../components/itemLogList/itemLogList";
import EasyInput from "../components/easyInput/easyInput";

function ItemPage() {
  const [item, setItem] = useState<number | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [addItem, setAddItem] = useState<string>("");
  const [modal, setModal] = useState<boolean>(false);

  const itemList = useSelector<IReduxStore, IDBItem[]>((state) => {
    return state.itemList;
  }, shallowEqual);

  const dispatch = useDispatch();

  const refreshDB = async () => {
    const data = await db.item.toArray();
    dispatch(RSetItemList(data));
  };

  const addHandler = () => {
    // setModalOpen((prev) => (prev ? false : true));
    if (addItem.trim() !== "") {
      db.item
        .add({ name: addItem, price: 0 })
        .then(() => {
          Noti.success("새로운 아이템이 추가되었습니다");
        })
        .catch((err) => {
          console.error(err);
          Noti.danger("새로운 아이템을 추가하지 못했습니다");
        });
    } else {
      Noti.warning("아이템 이름을 작성해 주세요");
    }
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

  const editHandler = async () => {
    if (item) {
      const lastPrice = (await db.item.get(item))?.price ?? 0;
      if (lastPrice === price) {
        Noti.warning("아이템 가격이 이전과 동일합니다");
      } else {
        try {
          await db.item.update(item, { price });
          await db.itemLog.add({ item, price, updated: new Date() });
          Noti.success("아이템 가격이 업데이트 되었습니다");
        } catch (err) {
          console.error(err);
          Noti.danger("가격을 업데이트 하지 못했습니다");
        }
      }
    } else {
      Noti.warning("아이템을 선택해주세요");
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
          onChange={(value) => priceHandler(value)}
        />
        <EasyInput onChange={(value) => setPrice((prev) => prev + value)} />
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
          onKeyDown={(e) => {
            if (e.nativeEvent.key === "Enter") addHandler();
          }}
        />
        <button className="add-btn circleBtn" onClick={addHandler}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button className="list-btn circleBtn" onClick={() => setModal(true)}>
          <FontAwesomeIcon icon={faList} />
        </button>
      </div>
      <Modal open={modal} onClick={() => setModal(false)} width="60%" height="70%" maxWidth="550px">
        <ItemLogModal />
      </Modal>
    </div>
  );
}

interface IDBItemLogPrev extends IDBItemLog {
  prevPrice: number;
}

function ItemLogModal() {
  const [itemLog, setItemLog] = useState<IDBItemLogPrev[]>([]);

  const getItemLog = async () => {
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

  useEffect(() => {
    getItemLog();
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
              <ItemLogList data={e} diff={e.price - e.prevPrice} />
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
}

export default ItemPage;

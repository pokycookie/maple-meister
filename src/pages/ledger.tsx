import React, { useEffect, useState } from "react";
import "../styles/pages/ledger.scss";
import { IDBItem, db, IDBLedger } from "../db";
import Select, { SingleValue } from "react-select";
import NumberInput from "../components/numberInput/numberInput";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { IReduxStore, RSetItemList } from "../redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/modal/modal";
import LedgerList from "../components/ledgerList/ledgerList";
import { checkDateEqual } from "../lib/time";
import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import { Noti } from "../lib/notification";

function LedgerPage() {
  const [item, setItem] = useState<number | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [count, setCount] = useState<number>(1);
  const [modal, setModal] = useState<boolean>(false);

  const itemList = useSelector<IReduxStore, IDBItem[]>((state) => {
    return state.itemList;
  }, shallowEqual);

  const dispatch = useDispatch();

  const refreshDB = async () => {
    const data = await db.item.toArray();
    dispatch(RSetItemList(data));
  };

  const updateItem = async () => {
    if (!item) return;
    const prevPrice = (await db.item.get(item))?.price;
    if (prevPrice === price) return;
    await db.item
      .update(item, { price })
      .then(() => {
        Noti.success("아이템 가격이 업데이트 되었습니다");
      })
      .catch((err) => {
        console.error(err);
        Noti.danger("가격을 업데이트 하지 못했습니다");
      });
  };

  const addLedger = async (type: "buy" | "sell") => {
    if (item) {
      let assets = (await db.user.get({ key: "assets" }))?.value ?? 0;
      if (type === "buy") {
        assets -= price * count;
      } else {
        assets += price * count;
      }
      await db.user.put({ key: "assets", value: assets });
      await db.ledger
        .add({ item, price, count, type, updated: new Date(), assets })
        .then(() => {
          Noti.success("장부가 업데이트 되었습니다");
        })
        .catch((err) => {
          console.error(err);
          Noti.danger("장부를 업데이트 하지 못했습니다");
        });
    } else {
      Noti.warning("아이템을 선택해주세요");
    }
  };

  const listHandler = () => {
    setModal(true);
  };

  const sellHandler = async () => {
    await updateItem();
    await addLedger("sell");
  };

  const buyHandler = async () => {
    await updateItem();
    await addLedger("buy");
  };

  const countHandler = (value: number) => {
    setCount(value);
  };

  const priceHandler = (value: number) => {
    setPrice(value);
  };

  const selectHandler = (e: SingleValue<{ value: number; label: string }>) => {
    if (e) setItem(e.value);
    else setItem(null);
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
    <div className="ledger-page">
      <div className="form-area">
        <Select
          className="form-select"
          options={options}
          isClearable={true}
          onChange={selectHandler}
          maxMenuHeight={35 * 6}
        />
        <div className="input-area">
          <NumberInput
            className="input-price"
            unit="메소"
            value={price}
            separators
            onChange={(value) => priceHandler(value)}
          />
          <NumberInput
            className="input-count"
            unit="개"
            value={count}
            separators
            onChange={(value) => countHandler(value)}
          />
        </div>
        <div className="btn-area">
          <button className="sell-btn" onClick={sellHandler}>
            판매
          </button>
          <button className="buy-btn" onClick={buyHandler}>
            구입
          </button>
        </div>
      </div>
      <div className="list-btn-area">
        <button className="add-btn circleBtn" onClick={listHandler}>
          <FontAwesomeIcon icon={faList} />
        </button>
      </div>
      <Modal open={modal} onClick={() => setModal(false)} width="60%" height="70%">
        <LedgerListContainer />
      </Modal>
    </div>
  );
}

function LedgerListContainer() {
  const [ledgerList, setLedgerList] = useState<IDBLedger[]>([]);

  const getLedger = async () => {
    const tmpLedgerList = await db.ledger.toArray();
    setLedgerList(tmpLedgerList);
  };

  useEffect(() => {
    getLedger();
  }, []);

  return (
    <div className="ledger__list--container">
      {ledgerList.length !== 0 || (
        <div className="ledger__list--empty">
          <FontAwesomeIcon className="empty--icon" icon={faFolderOpen} />
          <p className="empty--text">거래 목록이 존재하지 않습니다</p>
        </div>
      )}
      <ul className="ledger__list--ul">
        {ledgerList.map((e, i, arr) => {
          return (
            <React.Fragment key={i}>
              {(i === 0 || !checkDateEqual(e.updated, arr[i - 1].updated)) && (
                <p className="ledger__list--seperator">{e.updated.toLocaleDateString()}</p>
              )}
              <LedgerList data={e} />
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
}

export default LedgerPage;

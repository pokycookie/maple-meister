import React, { useEffect, useState } from "react";
import "../styles/pages/ledger.scss";
import { IDBItem, db, IDBLedger } from "../db";
import Select, { SingleValue } from "react-select";
import NumberInput from "../components/numberInput/numberInput";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { IReduxStore, RSetItemList, RSetModalID } from "../redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/modal/modal";
import LedgerList from "../components/ledgerList/ledgerList";
import { checkDateEqual } from "../lib/time";
import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import { Noti } from "../lib/notification";
import EasyInput from "../components/easyInput/easyInput";
import { buyItem, sellItem } from "../utils/dexie";
import { SELECT_ITEM_ERR } from "../lang/noti";
import EditableList from "../components/editableList/editableList";

function LedgerPage() {
  const [item, setItem] = useState<number | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [count, setCount] = useState<number>(1);

  const itemList = useSelector<IReduxStore, IDBItem[]>((state) => {
    return state.itemList;
  }, shallowEqual);

  const dispatch = useDispatch();

  const refreshDB = async () => {
    const data = await db.item.toArray();
    dispatch(RSetItemList(data));
  };

  const listHandler = () => {
    dispatch(RSetModalID("ledgerList"));
  };

  const sellHandler = async () => {
    if (!item) {
      Noti.warning(SELECT_ITEM_ERR);
      return;
    }
    await sellItem(item, price, count);
  };

  const buyHandler = async () => {
    if (!item) {
      Noti.warning(SELECT_ITEM_ERR);
      return;
    }
    await buyItem(item, price, count);
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
            onChange={(value) => setPrice(value)}
          />
          <NumberInput
            className="input-count"
            unit="개"
            value={count}
            separators
            onChange={(value) => setCount(value)}
          />
        </div>
        <EasyInput onChange={(value) => setPrice((prev) => prev + value)} />
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
      <Modal modalID="ledgerList" width="60%" height="70%" maxWidth="550px" autoClose>
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
              <EditableList key={e.id ?? i} editHandler={() => {}} deleteHandler={() => {}}>
                <LedgerList data={e} />
              </EditableList>
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
}

export default LedgerPage;

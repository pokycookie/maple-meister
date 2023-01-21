import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Select, { SingleValue } from "react-select";
import Modal from "../components/modal/modal";
import NumberInput from "../components/numberInput/numberInput";
import { IDBItem } from "../db";
import { IReduxStore } from "../redux";
import "../styles/pages/recipe.scss";

function RecipePage() {
  const [modal, setModal] = useState<boolean>(false);

  return (
    <div className="recipe__page">
      <div className="btn__area">
        <button className="add__btn circleBtn" onClick={() => setModal(true)}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <Modal open={modal} width="60%" height="50%">
        <RecipeAddModal setModal={setModal} />
      </Modal>
    </div>
  );
}

interface IProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function RecipeAddModal(props: IProps) {
  const [item, setItem] = useState<number | null>(null);
  const [resultItem, setResultItem] = useState<number | null>(null);
  const [count, setCount] = useState<number>(1);
  const [resultCount, setResultCount] = useState<number>(1);
  const itemList = useSelector<IReduxStore, IDBItem[]>((state) => {
    return state.itemList;
  }, shallowEqual);

  const options = itemList.map((e) => {
    return { value: e.id!, label: e.name };
  });

  const itemHandler = (e: SingleValue<{ value: number; label: string }>) => {
    if (e) setItem(e.value);
    else setItem(null);
  };
  const resultItemHandler = (e: SingleValue<{ value: number; label: string }>) => {
    if (e) setResultItem(e.value);
    else setResultItem(null);
  };

  return (
    <div className="recipe__add__modal">
      <div className="recipe--result__area">
        <Select
          className="form--select"
          options={options}
          isClearable={true}
          onChange={resultItemHandler}
          maxMenuHeight={35 * 6}
        />
        <NumberInput
          className="form--input input--resultCount"
          value={resultCount}
          separators
          unit="개"
          onChange={(value) => setResultCount(value)}
        />
      </div>
      <div className="recipe__modal--seperator"></div>
      <div className="recipe--input__area">
        <Select
          className="form--select"
          options={options}
          isClearable={true}
          onChange={itemHandler}
          maxMenuHeight={35 * 6}
        />
        <NumberInput
          className="form--input input--count"
          value={count}
          separators
          unit="개"
          onChange={(value) => setCount(value)}
        />
        <button className="form--btn add--btn">재료 추가</button>
      </div>
      <div className="recipe__modal--seperator"></div>
      <div className="recipe--ingredient__area"></div>
      <div className="recipe__modal--seperator"></div>
      <div className="recipe--btn__area">
        <button className="form--btn ok--btn">레시피 추가</button>
        <button className="form--btn cancel--btn" onClick={() => props.setModal(false)}>
          취소
        </button>
      </div>
    </div>
  );
}

export default RecipePage;

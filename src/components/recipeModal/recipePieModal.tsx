import { useEffect, useState } from "react";
import { db, IDBItem, IDBRecipe, IIngredient } from "../../db";
import "./recipePieModal.css";

interface IProps {
  data: IDBRecipe | null;
}

function RecipePieModal(props: IProps) {
  const [items, setItems] = useState<IDBItem[]>([]);

  const getItem = (id: number) => {
    const itemObj = items.find((e) => e.id === id) ?? null;
    if (itemObj) {
      return { name: itemObj.name, price: itemObj.price };
    }
    return { name: "", price: 0 };
  };

  const getInfo__result = () => {
    if (!props.data) return "";
    const name = getItem(props.data.resultItem).name;
    const count = props.data.resultCount;
    return `${name} (${count}개)`;
  };

  const getInfo = (item: IIngredient) => {
    if (!props.data) return "";
    const name = getItem(item.id).name;
    const count = item.count;
    return `${name} (${count}개)`;
  };

  useEffect(() => {
    const initItems = async () => {
      const tmpItems = await db.item.toArray();
      setItems(tmpItems);
    };
    initItems();
  }, []);

  if (!props.data) return <>Error</>;
  return (
    <div className="recipe__pie__modal">
      {/* <div className="pie__modal--name">{props.data.name}</div> */}
      <div className="pie__modal--result">
        <p className="result--info">{getInfo__result()}</p>
        <p className="result--price">{getItem(props.data.resultItem).price}</p>
      </div>
      <ul className="pie__modal--ul">
        {props.data.items.map((item, i) => {
          return (
            <li className="pie__modal--li" key={i}>
              <p className="item__list--info">{getInfo(item)}</p>
              <p className="item__list--price">{getItem(item.id).price}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default RecipePieModal;

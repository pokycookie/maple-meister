import { faCircleMinus, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

interface IProps {
  children?: ReactNode;
  editHandler?: () => void;
  deleteHandler?: () => void;
}

function EditableList(props: IProps) {
  return (
    <li className="editable__list">
      {props.children}
      <div className="editable__list--container">
        {props.editHandler ? (
          <button className="editable__list--edit__btn" onClick={props.editHandler}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        ) : null}
        {props.deleteHandler ? (
          <button className="editable__list--del__btn" onClick={props.deleteHandler}>
            <FontAwesomeIcon icon={faCircleMinus} />
          </button>
        ) : null}
      </div>
    </li>
  );
}

export default EditableList;

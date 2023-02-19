import { db } from "../../db";
import { IMMDF, IMMDF__data, TFile } from "../../lib/fileSystem";

type TReaderOption = "option1" | "option2";

interface IProps {
  onChange?: (data: any) => void;
  option?: TReaderOption;
}

function MMDFReader(props: IProps) {
  const setItem = async (fileData: IMMDF__data, option?: TReaderOption) => {
    const items = fileData.item ?? [];
    switch (option) {
      case "option1":
        items.forEach(async (item) => {
          const dbItem = await db.item.get({ name: item.name });
          if (!dbItem) await db.item.add({ name: item.name, price: item.price });
        });
        break;
      default:
        items.forEach(async (item) => {
          const dbItem = await db.item.get({ name: item.name });
          if (dbItem) {
            await db.item.update(item.id!, { price: item.price });
          } else {
            await db.item.add({ name: item.name, price: item.price });
          }
        });
        break;
    }
  };

  const setRecipe = async (fileData: IMMDF__data, option?: TReaderOption) => {
    const recipes = fileData.recipe ?? [];
    switch (option) {
      case "option1":
        recipes.forEach(async (recipe) => {
          const dbRecipe = await db.recipe.get({ name: recipe.name });
          delete recipe.id;
          if (dbRecipe) {
            await db.recipe.update(dbRecipe.id!, recipe);
          } else {
            await db.recipe.add(recipe);
          }
        });
        break;
      default:
        recipes.forEach(async (recipe) => {
          const dbRecipe = await db.recipe.get({ name: recipe.name });
          delete recipe.id;
          if (!dbRecipe) await db.recipe.add(recipe);
        });
        break;
    }
  };

  const mmdfHandler = async (fileData: IMMDF__data, type: TFile, option?: TReaderOption) => {
    try {
      switch (type) {
        case "backup":
          await mmdfHandler(fileData, "item");
          await mmdfHandler(fileData, "recipe");
          break;
        case "item":
          await setItem(fileData, option);
          break;
        case "recipe":
          await setRecipe(fileData, option);
          break;
        case "itemLog":
          break;
        case "ledger":
          break;
        case "setting":
          break;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const readerHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList[0]) {
      const file = fileList[0];
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        try {
          const dataObj = JSON.parse(fileReader.result as string) as IMMDF;
          mmdfHandler(dataObj.data, dataObj.meta.type, props.option);
          if (props.onChange) props.onChange(dataObj);
        } catch (err) {
          console.error(err);
        }
      };
    }
  };

  return <input className="mmdf__reader" type="file" accept=".mmdf" onChange={readerHandler} />;
}

export default MMDFReader;

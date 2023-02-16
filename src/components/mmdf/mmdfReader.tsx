import { db } from "../../db";
import { IMMDF, IMMDF__data, TFile } from "../../lib/fileSystem";

interface IProps {
  onChange?: (data: any) => void;
}

function MMDFReader(props: IProps) {
  const mmdfHandler = async (fileData: IMMDF__data, type: TFile) => {
    try {
      switch (type) {
        case "backup":
          await mmdfHandler(fileData, "item");
          await mmdfHandler(fileData, "recipe");
          break;
        case "item":
          const items = fileData.item ?? [];
          items.forEach(async (item) => {
            const dbItem = await db.item.get(item.id!);
            if (dbItem) {
              await db.item.update(item.id!, { price: item.price });
            } else {
              await db.item.add({ name: item.name, price: item.price });
            }
          });
          break;
        case "recipe":
          const recipes = fileData.recipe ?? [];
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
          mmdfHandler(dataObj.data, dataObj.meta.type);
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

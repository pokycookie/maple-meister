interface IProps {
  onChange?: (data: any) => void;
}

function MMDFReader(props: IProps) {
  const readerHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList[0]) {
      const file = fileList[0];
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        try {
          const dataObj = JSON.parse(fileReader.result as string);
          if (props.onChange) props.onChange(dataObj);
        } catch (err) {
          console.error(err);
        }
      };
    }
  };

  return (
    <input
      className="mmdf__reader"
      type="file"
      accept=".mmdf"
      onChange={readerHandler}
    />
  );
}

export default MMDFReader;

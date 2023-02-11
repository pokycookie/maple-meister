import { TFile } from "../types";

export function download(data: any, type: TFile) {
  const DATA = { meta: { type }, data };
  const FILE = new File(
    [JSON.stringify(DATA)],
    `${new Date().toDateString()}.txt`,
    { type: "text/plain" }
  );
  const URL = window.URL.createObjectURL(FILE);
  const LINK = document.createElement("a");
  LINK.href = URL;
  LINK.download = `${new Date().toLocaleString().replace(/(\s*)/g, "")}.txt`;
  document.body.appendChild(LINK);
  LINK.click();
  document.body.removeChild(LINK);
  window.URL.revokeObjectURL(URL);
}

export function upload() {
  const LINK = document.createElement("input");
  LINK.type = "file";
  LINK.accept = ".txt";
  LINK.addEventListener("change", () => {
    if (LINK.files && LINK.files.length > 0) {
      const FILE = LINK.files[0];
      const reader = new FileReader();
      reader.readAsText(FILE);
      reader.onload = () => {
        const obj = JSON.parse(reader.result as string);
        console.log(obj);
      };
    }
  });
  LINK.click();
}

export type TPage = "timer" | "ledger" | "item" | "recipe" | "chart";

export interface ITime {
  hour: number;
  minute: number;
  second: number;
}

export interface IWindow {
  width: number;
  height: number;
}

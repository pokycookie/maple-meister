export type TPage =
  | "timer"
  | "ledger"
  | "item"
  | "recipe"
  | "chart"
  | "setting";

export type TFile = "backup";

export interface ITime {
  hour: number;
  minute: number;
  second: number;
}

export interface ISize {
  width: number;
  height: number;
}

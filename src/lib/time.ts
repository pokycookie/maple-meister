import { ITime } from "../types";

export function getDoubleDigit(value: number) {
  if (value < 10) return `0${value}`;
  else return `${value}`;
}

export function timeToNumber(timeObj: ITime) {
  const H = timeObj.hour * 3600;
  const M = timeObj.minute * 60;
  return H + M + timeObj.second;
}

export function numberToTime(time: number): ITime {
  const hour = Math.floor(time / 3600);
  const minute = Math.floor((time - hour * 3600) / 60);
  const second = Math.floor(time - hour * 3600 - minute * 60);
  return { hour, minute, second };
}

export function getTimeText(time: number) {
  const H = numberToTime(time).hour || 0;
  const M = numberToTime(time).minute || 0;
  const S = numberToTime(time).second || 0;
  return `${getDoubleDigit(H)}:${getDoubleDigit(M)}:${getDoubleDigit(S)}`;
}

export function decimalSeparator(value: number, seperator: string = ",") {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, seperator);
}

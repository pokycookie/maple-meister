import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import "./calendar.css";

type TStatus = "prev" | "current" | "next";
export type TCalendar = "daily" | "weekly" | "monthly";

interface ICalendar {
  value: number;
  date: Date;
  status: TStatus;
}

interface IProps {
  default?: Date;
  onChange?: (start: Date, end: Date) => void;
  type?: TCalendar;
}

const dayArr = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function Calendar(props: IProps) {
  const defaultDate = props.default ?? new Date();
  const defaultType = props.type ?? "daily";

  const [year, setYear] = useState<number>(defaultDate.getFullYear());
  const [month, setMonth] = useState<number>(defaultDate.getMonth());
  const [dailyArr, setDailyArr] = useState<ICalendar[]>([]);
  const [weeklyArr, setWeeklyArr] = useState<ICalendar[][]>([]);
  const [monthlyArr, setMonthlyArr] = useState<ICalendar[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);

  const setDateToday = () => {
    const today = new Date();
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  const monthHandler = (type: "inc" | "dec") => {
    const tmpMonth = type === "inc" ? month + 1 : month - 1;
    if (tmpMonth + 1 > 12) {
      setMonth(0);
      setYear((prev) => (prev += 1));
    } else if (tmpMonth + 1 < 1) {
      setMonth(11);
      setYear((prev) => (prev -= 1));
    } else {
      setMonth(tmpMonth);
    }
  };

  const monthlyHandler = (data: ICalendar) => {
    const year = data.date.getFullYear();
    const month = data.date.getMonth();

    const start = new Date(year, month, 1, 0, 0, 0);
    const end = new Date(year, month + 1, 0, 23, 59, 59);

    if (props.onChange) props.onChange(start, end);
  };

  const weeklyHandler = (data: ICalendar) => {
    const year = data.date.getFullYear();
    const month = data.date.getMonth();
    const date = data.date.getDate();
    const day = data.date.getDay();

    const start = new Date(year, month, date - day, 0, 0, 0);
    const end = new Date(year, month, date + (6 - day), 23, 59, 59);

    if (props.onChange) props.onChange(start, end);
  };

  const tableHandler = (data: ICalendar) => {
    const year = data.date.getFullYear();
    const month = data.date.getMonth();
    const date = data.date.getDate();

    const start = new Date(year, month, date, 0, 0, 0);
    const end = new Date(year, month, date, 23, 59, 59);

    setSelectedDate(data.date);
    if (props.onChange) props.onChange(start, end);
  };

  useEffect(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();

    const getDaily = () => {
      const tempArr: ICalendar[] = [];
      for (let i = 0; i < 42; i++) {
        if (i < firstDay) {
          // prev month
          const value = prevLastDate - firstDay + 1 + i;
          const date = new Date(year, month - 1, value);
          const status: TStatus = "prev";
          tempArr.push({ value, date, status });
        } else {
          if (i + 1 - firstDay <= lastDate) {
            // current month
            const value = i + 1 - firstDay;
            const date = new Date(year, month, value);
            const status: TStatus = "current";
            tempArr.push({ value, date, status });
          } else {
            // next month
            const value = i - lastDate - firstDay + 1;
            const date = new Date(year, month + 1, value);
            const status: TStatus = "next";
            tempArr.push({ value, date, status });
          }
        }
      }
      setDailyArr(tempArr);
    };

    const getWeekly = () => {
      const tmpArrWeek: ICalendar[][] = [];
      for (let w = 0; w < 6; w++) {
        const tmpArrDay: ICalendar[] = [];
        for (let d = 0; d < 7; d++) {
          const tmpDate = d + w * 7;
          if (tmpDate < firstDay) {
            // prev month
            const value = prevLastDate - firstDay + tmpDate + 1;
            const date = new Date(year, month - 1, value);
            const status: TStatus = "prev";
            tmpArrDay.push({ value, date, status });
          } else {
            if (tmpDate + 1 - firstDay <= lastDate) {
              // current month
              const value = tmpDate - firstDay + 1;
              const date = new Date(year, month, value);
              const status: TStatus = "current";
              tmpArrDay.push({ value, date, status });
            } else {
              // next month
              const value = tmpDate - lastDate - firstDay + 1;
              const date = new Date(year, month + 1, value);
              const status: TStatus = "next";
              tmpArrDay.push({ value, date, status });
            }
          }
        }
        tmpArrWeek.push(tmpArrDay);
      }
      setWeeklyArr(tmpArrWeek);
    };

    const getMonthly = () => {
      const tmpArr: ICalendar[] = [];
      for (let i = 1; i < 13; i++) {
        const value = i;
        const date = new Date(year, value - 1, 1);
        const status: TStatus = "current";
        tmpArr.push({ value, date, status });
      }
      setMonthlyArr(tmpArr);
    };

    switch (defaultType) {
      case "daily":
        getDaily();
        break;
      case "weekly":
        getWeekly();
        break;
      case "monthly":
        getMonthly();
        break;
    }
  }, [year, month, defaultType]);

  return (
    <div className="calendar">
      <div className="navigation">
        <button onClick={() => setYear((prev) => prev - 1)}>
          <FontAwesomeIcon icon={faAnglesLeft} />
        </button>
        {defaultType !== "monthly" ? (
          <button onClick={() => monthHandler("dec")}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
        ) : null}
        <button className="indicator" onClick={setDateToday}>
          {defaultType !== "monthly" ? `${year}년 ${month + 1}월` : `${year}년`}
        </button>
        {defaultType !== "monthly" ? (
          <button onClick={() => monthHandler("inc")}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        ) : null}
        <button onClick={() => setYear((prev) => prev + 1)}>
          <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      </div>
      {defaultType !== "monthly" ? (
        <div className="day">
          {dayArr.map((element, index) => {
            return <p key={index}>{element}</p>;
          })}
        </div>
      ) : null}
      <div className={`tableArea ${defaultType}`}>
        {defaultType === "daily"
          ? dailyArr.map((element, index) => {
              return (
                <button
                  key={index}
                  className={`${element.status}${getWeekday(index)}${getSelected(
                    element,
                    selectedDate
                  )}${getToday(element)}`}
                  onClick={() => tableHandler(element)}
                >
                  <p className="value">{element.value}</p>
                </button>
              );
            })
          : defaultType === "weekly"
          ? weeklyArr.map((e, i) => {
              return (
                <button
                  className={`${getSelected(e[0], selectedDate)}`}
                  key={i}
                  onClick={() => weeklyHandler(e[0])}
                >
                  {e.map((e, j) => {
                    return (
                      <p
                        key={j}
                        className={`${e.status}${getWeekday(j + (i + 1) * 7)}${getToday(e)}`}
                      >
                        {e.value}
                      </p>
                    );
                  })}
                </button>
              );
            })
          : monthlyArr.map((e, i) => {
              return (
                <button key={i} onClick={() => monthlyHandler(e)}>
                  {e.value}
                </button>
              );
            })}
      </div>
    </div>
  );
}

function getWeekday(index: number) {
  const result = (index + 1) % 7;
  switch (result) {
    case 0:
      return " saturday";
    case 1:
      return " sunday";
    default:
      return "";
  }
}

function getSelected(element: ICalendar, selectedDate: Date | null) {
  if (selectedDate === null) return "";
  if (
    element.date.getFullYear() === selectedDate.getFullYear() &&
    element.date.getMonth() === selectedDate.getMonth() &&
    element.date.getDate() === selectedDate.getDate()
  ) {
    return " selected";
  } else {
    return "";
  }
}

function getToday(element: ICalendar) {
  const today = new Date();

  if (
    element.date.getFullYear() === today.getFullYear() &&
    element.date.getMonth() === today.getMonth() &&
    element.date.getDate() === today.getDate()
  ) {
    return " today";
  } else {
    return "";
  }
}

export default Calendar;

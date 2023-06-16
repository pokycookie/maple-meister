import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Serie } from "@nivo/line";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Select, { SingleValue } from "react-select";
import Calendar, { TCalendar } from "../components/calendar/calendar";
import Dropdown from "../components/dropdown/dropdown";
import LineChart from "../components/nivo/lineChart";
import RowSelector from "../components/rowSelector/rowSelector";
import { db, IDBItem, IDBItemLog } from "../db";
import { itemLogToSerie } from "../lib/nivo";
import { checkDateEqual2, getNearDate } from "../lib/time";
import { IReduxStore } from "../redux";
import "../styles/pages/chart.scss";

const calendarTypeList: TCalendar[] = ["daily", "weekly", "monthly"];

interface IDateRange {
  start: Date;
  end: Date;
}

function ChartPage() {
  const [item, setItem] = useState<number | null>(null);
  const [data, setData] = useState<Serie[]>([]);
  const [calendarType, setCalendarType] = useState<TCalendar>("monthly");
  const [dateFilter, setDateFilter] = useState<IDateRange>({ start: new Date(), end: new Date() });

  const itemList = useSelector<IReduxStore, IDBItem[]>((state) => {
    return state.itemList;
  }, shallowEqual);

  const selectHandler = (e: SingleValue<{ value: number; label: string }>) => {
    if (e) setItem(e.value);
    else setItem(null);
  };

  const options = itemList.map((e) => {
    return { value: e.id!, label: e.name };
  });

  useEffect(() => {
    setDateFilter(getNearDate(dateFilter.start, calendarType));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarType]);

  useEffect(() => {
    const getSerieData = async () => {
      if (item !== null) {
        const itemName = (await db.item.get(item))?.name ?? "";
        const itemLogs = await db.itemLog
          .where(["item", "updated"])
          .between([item, dateFilter.start], [item, dateFilter.end], true, true)
          .sortBy("updated");
        if (itemLogs.length === 0) {
          const serieData = itemLogToSerie(itemLogs, itemName);
          setData(serieData);
          return;
        }
        const editedLogs: IDBItemLog[] = [];
        let tmpUpdated = itemLogs[0].updated;
        const overlap: { [key: number]: number } = {};
        switch (calendarType) {
          case "daily":
            itemLogs.forEach((e, i) => {
              if (checkDateEqual2(e.updated, tmpUpdated, "seconds") && i !== 0) {
                editedLogs[editedLogs.length - 1].price += e.price;
                overlap[editedLogs.length - 1] = 1 + (overlap[editedLogs.length - 1] ?? 1);
              } else {
                editedLogs.push(e);
                tmpUpdated = e.updated;
              }
            });
            break;
          case "weekly":
          case "monthly":
            itemLogs.forEach((e, i) => {
              if (checkDateEqual2(e.updated, tmpUpdated, "date") && i !== 0) {
                editedLogs[editedLogs.length - 1].price += e.price;
                overlap[editedLogs.length - 1] = 1 + (overlap[editedLogs.length - 1] ?? 1);
              } else {
                editedLogs.push(e);
                tmpUpdated = e.updated;
              }
            });
            break;
        }
        // Make Average
        Object.keys(overlap).forEach((key) => {
          const index = parseInt(key);
          editedLogs[index].price = Math.round(editedLogs[index].price / overlap[index]);
        });
        const serieData = itemLogToSerie(editedLogs, itemName);
        setData(serieData);
      } else {
        setData([]);
      }
    };
    getSerieData();
  }, [item, dateFilter, calendarType]);

  return (
    <div className="chart__page">
      <div className="filter__area">
        <div className="filter__area--left">
          <Select
            className="filter--select"
            options={options}
            isClearable={true}
            onChange={selectHandler}
            maxMenuHeight={33 * 6}
          />
        </div>
        <div className="filter__area--right">
          <RowSelector
            className="row__selector"
            options={calendarTypeList}
            default={2}
            onChange={(value) => setCalendarType(value)}
          />
          <Dropdown
            className="dropdown"
            value={`${dateFilter.start.toLocaleDateString()} - ${dateFilter.end.toLocaleDateString()}`}
          >
            <Calendar
              onChange={(start, end) => setDateFilter({ start, end })}
              type={calendarType}
            />
          </Dropdown>
        </div>
      </div>
      <div className="chart__area">
        {data[0]?.data.length > 0 ? (
          <LineChart data={data} />
        ) : (
          <div className="chart--empty">
            <FontAwesomeIcon className="empty--icon" icon={faFolderOpen} />
            <p className="empty--text">데이터가 존재하지 않습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChartPage;

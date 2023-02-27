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
import { db, IDBItem } from "../db";
import { itemLogToSerie } from "../lib/nivo";
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
  const [calendarType, setCalendarType] = useState<TCalendar>("daily");
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
    const getSerieData = async () => {
      if (item !== null) {
        const itemName = (await db.item.get(item))?.name ?? "";
        const itemLogs = await db.itemLog.where("item").equals(item).toArray();
        const serieData = itemLogToSerie(itemLogs, itemName);
        setData(serieData);
      } else {
        setData([]);
      }
    };
    getSerieData();
  }, [item]);

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
            onChange={(value) => setCalendarType(value)}
          />
          <Dropdown
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

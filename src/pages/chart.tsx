import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Serie } from "@nivo/line";
import { useEffect, useMemo, useState } from "react";
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
  const [calendarType, setCalendarType] = useState<TCalendar>("daily");
  const [selected, setSelected] = useState<{ value: number; label: string } | null>(null);

  const [dailyFilter, setDailyFilter] = useState<IDateRange>(getNearDate(new Date(), "daily"));
  const [weeklyFilter, setWeeklyFilter] = useState<IDateRange>(getNearDate(new Date(), "weekly"));
  const [monthlyFilter, setMonthlyFilter] = useState<IDateRange>(
    getNearDate(new Date(), "monthly")
  );
  const [dateFilter, setDateFilter] = useState<IDateRange>(monthlyFilter);

  const calendarDefaultDate = useMemo(() => {
    switch (calendarType) {
      case "daily":
        return dailyFilter.start;
      case "weekly":
        return weeklyFilter.start;
      case "monthly":
        return monthlyFilter.start;
      default:
        return new Date();
    }
  }, [calendarType, dailyFilter, monthlyFilter, weeklyFilter]);

  const itemList = useSelector<IReduxStore, IDBItem[]>((state) => {
    return state.itemList;
  }, shallowEqual);

  const selectHandler = (e: SingleValue<{ value: number; label: string }>) => {
    if (!e) {
      setItem(null);
      setSelected(null);
      return;
    }
    setItem(e.value);
    setSelected(e);
  };

  const options = useMemo(() => {
    const options = itemList.map((e) => {
      return { value: e.id!, label: e.name };
    });
    if (options.length > 0) {
      setItem(options[0].value);
      setSelected(options[0]);
    }
    return options;
  }, [itemList]);

  const calendarHandler = ({ start, end }: { start: Date; end: Date }) => {
    switch (calendarType) {
      case "daily":
        setDailyFilter({ start, end });
        break;
      case "weekly":
        setWeeklyFilter({ start, end });
        break;
      case "monthly":
        setMonthlyFilter({ start, end });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    switch (calendarType) {
      case "daily":
        setDateFilter(dailyFilter);
        break;
      case "weekly":
        setDateFilter(weeklyFilter);
        break;
      case "monthly":
        setDateFilter(monthlyFilter);
        break;
      default:
        break;
    }
  }, [calendarType, dailyFilter, monthlyFilter, weeklyFilter]);

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
            value={selected}
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
              onChange={(start, end) => calendarHandler({ start, end })}
              default={calendarDefaultDate}
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

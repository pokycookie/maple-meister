import { ResponsivePie } from "@nivo/pie";

export interface IPieData {
  id: string;
  value: number;
}

interface IProps {
  data: IPieData[];
}

function PieChart(props: IProps) {
  return (
    <ResponsivePie
      data={props.data}
      valueFormat=" >-,"
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      innerRadius={0.5}
      padAngle={2}
      cornerRadius={3}
      sortByValue={true}
      colors={{ scheme: "nivo" }}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      enableArcLinkLabels={false}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      activeOuterRadiusOffset={8}
      tooltip={(e) => {
        return (
          <div className="nivo--pie__chart--tooltip nivo--tooltip" style={{ color: e.datum.color }}>
            <p className="id">{e.datum.id}</p>
            <p className="value">{e.datum.formattedValue}메소</p>
          </div>
        );
      }}
    />
  );
}

export default PieChart;

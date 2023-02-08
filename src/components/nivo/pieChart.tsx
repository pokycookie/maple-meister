import { MouseEventHandler, ResponsivePie } from "@nivo/pie";

export interface IPieData {
  id: number;
  value: number;
  label: string;
}

interface IProps {
  data: IPieData[];
  onClick?: MouseEventHandler<IPieData, SVGPathElement>;
}

function PieChart(props: IProps) {
  return (
    <ResponsivePie
      data={props.data}
      onClick={props.onClick}
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
            <p className="id">{e.datum.label}</p>
            <p className="value">순수익: {e.datum.formattedValue}메소</p>
          </div>
        );
      }}
    />
  );
}

export default PieChart;

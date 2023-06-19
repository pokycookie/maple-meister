import { linearGradientDef } from "@nivo/core";
import { ResponsiveLine, Serie } from "@nivo/line";

interface IProps {
  data: Serie[];
}

function LineChart(props: IProps) {
  const sorted = props.data[0].data.map((e) => e.y).sort((a, b) => (a as number) - (b as number));
  const min = sorted[0] as number;
  const max = sorted[sorted.length - 1] as number;

  return (
    <ResponsiveLine
      data={props.data}
      margin={{ top: 20, right: 70, bottom: 20, left: 100 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min,
        max,
      }}
      yFormat=" >-,"
      areaBaselineValue={min}
      axisBottom={null}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: -40,
        legendPosition: "middle",
      }}
      pointSize={5}
      pointColor="#ffffff"
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      // enablePointLabel={true}
      pointLabelYOffset={-10}
      pointLabel={(d) => `${d.yFormatted}`}
      enableArea={true}
      defs={[
        linearGradientDef("gradient1", [
          { offset: 70, color: "inherit" },
          { offset: 100, color: "inherit", opacity: 0 },
        ]),
      ]}
      enableGridX={false}
      fill={[{ match: "*", id: "gradient1" }]}
      curve={"monotoneX"}
      useMesh={true}
      animate={false}
      tooltip={(e) => {
        return (
          <div
            className="nivo--line__chart--tooltip nivo--tooltip"
            style={{ color: e.point.serieColor }}
          >
            <p className="x" style={{ fontSize: "12px" }}>
              {e.point.data.x.toLocaleString()}
            </p>
            <p className="y">{e.point.data.yFormatted}메소</p>
          </div>
        );
      }}
    />
  );
}

export default LineChart;

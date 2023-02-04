import { linearGradientDef } from "@nivo/core";
import { ResponsiveLine } from "@nivo/line";
import "../styles/pages/chart.scss";

const data = [
  {
    id: "norway",
    color: "hsl(307, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 218,
      },
      {
        x: "helicopter",
        y: 54,
      },
      {
        x: "boat",
        y: 127,
      },
      {
        x: "train",
        y: 67,
      },
      {
        x: "subway",
        y: 70,
      },
      {
        x: "bus",
        y: 72,
      },
      {
        x: "car",
        y: 15,
      },
      {
        x: "moto",
        y: 146,
      },
      {
        x: "bicycle",
        y: 293,
      },
      {
        x: "horse",
        y: 230,
      },
      {
        x: "skateboard",
        y: 130,
      },
      {
        x: "others",
        y: 23,
      },
    ],
  },
];

function ChartPage() {
  return (
    <div className="chart__page">
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        pointSize={5}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "transportation",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "count",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        enableArea={true}
        defs={[
          linearGradientDef("gradientA", [
            { offset: 0, color: "inherit" },
            { offset: 100, color: "inherit", opacity: 0 },
          ]),
        ]}
        fill={[{ match: "*", id: "gradientA" }]}
        curve={"catmullRom"}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        // animate={true}
      />
    </div>
  );
}

export default ChartPage;

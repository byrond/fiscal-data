import React, {useEffect} from "react";
import { Line } from "@nivo/line";
import {withWindowSize} from "react-fns";
import {pxToNumber} from "../../../../../../../helpers/styles-helper/styles-helper";
import ChartContainer from "../../../../../explainer-components/chart-container/chart-container";
import {
  breakpointLg,
  fontSize_10,
  fontSize_14,
} from "../../../../../../../variables.module.scss";
import {
  chartCopy,
  dataHeader,
  chartConfigs,
  getMarkers
} from "./total-revenue-chart-helper";
import {visWithCallout} from "../../../../../explainer.module.scss";
import VisualizationCallout
  from "../../../../../../../components/visualization-callout/visualization-callout";
import {lineChart, container} from "./total-revenue-chart.module.scss";
import {revenueExplainerPrimary} from "../../../revenue.module.scss";
import {
  applyChartScaling,
  applyTextScaling
} from "../../../../../explainer-helpers/explainer-charting-helper";

const TotalRevenueChart = ({width}) => {

  const chartParent = "totalRevenueChartParent";
  const chartWidth = 550;
  const chartHeight = 490;
  const data = [
    {
      "id": "GDP",
      "color": "#666666",
      "data": [
        {
          "x": 2015,
          "y": 11
        },
        {
          "x": 2016,
          "y": 13
        },
        {
          "x": 2017,
          "y": 15
        },
        {
          "x": 2018,
          "y": 14
        },
        {
          "x": 2019,
          "y": 18
        },
        {
          "x": 2020,
          "y": 21
        },
        {
          "x": 2021,
          "y": 22
        }
      ]
    },
    {
      "id": "Total Spending",
      "color": "#666666",
      "data": [
        {
          "x": 2015,
          "y": 2
        },
        {
          "x": 2016,
          "y": 3
        },
        {
          "x": 2017,
          "y": 4
        },
        {
          "x": 2018,
          "y": 6
        },
        {
          "x": 2019,
          "y": 4
        },
        {
          "x": 2020,
          "y": 7
        },
        {
          "x": 2021,
          "y": 8
        }
      ]
    }
  ];


  useEffect(() => {
    applyChartScaling(chartParent, chartWidth.toString(), chartHeight.toString());
  }, [])

  useEffect(() => {
    applyTextScaling(chartParent, chartWidth, width, fontSize_10);
  }, [width])

  return (
    <>
      <div className={visWithCallout}>
        <div className={container}>
          <ChartContainer
            title={chartCopy.title}
            subTitle={chartCopy.subtitle}
            footer={chartCopy.footer}
            date={new Date()}
            header={dataHeader()}
            altText={chartCopy.altText}
          >
            <div className={lineChart} data-testid={chartParent}>
              <Line
                data={data}
                layers={chartConfigs.layers}
                theme={{
                  ...chartConfigs.theme,
                  fontSize: width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
                  marker: {
                    fontSize: width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
                  }
                }}
                colors={d => d.color}
                width={ chartWidth }
                height={ chartHeight}
                margin={width < pxToNumber(breakpointLg) ?
                  {top: 25, right: 25, bottom: 35, left: 65} :
                  {top: 25, right: 15, bottom: 45, left: 50}
                }
                enablePoints={true}
                pointSize={0}
                enableGridX={false}
                enableGridY={false}
                xScale={{
                  type: "linear",
                  min: 2015,
                  max: 2021
                }}
                yScale={{
                  type: "linear",
                  min: 0,
                  max: 25,
                  stacked: false,
                  reverse: false
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={chartConfigs.axisBottom}
                axisLeft={chartConfigs.axisLeft}
                useMesh={true}
                isInteractive={true}
                enableCrosshair={false}
                crosshairType={'x'}
                animate={false}
                tooltip={() => null}
                markers={getMarkers(width)}
              >
              </Line>
            </div>
          </ChartContainer>
        </div>
        <VisualizationCallout color={revenueExplainerPrimary}>
          <p>
            Since 2015, the Revenue-to-GDP ratio has increased from XX% to XX%.
          </p>
        </VisualizationCallout>
      </div>
    </>
  );
}

export default withWindowSize(TotalRevenueChart);

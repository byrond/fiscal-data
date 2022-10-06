import React, {useEffect} from "react";
import ChartContainer from "../../../../explainer-components/chart-container/chart-container";
import {Line} from "@nivo/line";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";
import {
  breakpointLg,
  fontSize_10,
  fontSize_14,
} from "../../../../../../variables.module.scss";
import {withWindowSize} from "react-fns";
import {
  chartCopy,
  dataHeader,
  chartConfigs,
  getMarkers
} from "./spending-trends-chart-helper";
import {visWithCallout} from "../../../../explainer.module.scss";
import VisualizationCallout
  from "../../../../../../components/visualization-callout/visualization-callout";
import {spendingExplainerPrimary} from "../../federal-spending.module.scss";
import {lineChart, container} from "./spending-trends-chart.module.scss";


const SpendingTrendsChart = ({width}) => {

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

  const applyChartScaling = () => {
    // rewrite some element attribs after render to ensure Chart scales with container
    // which doesn't seem to happen naturally when nivo has a flex container
    const svgChart = document.querySelector('[data-testid="chartParent"] svg');
    if (svgChart) {
      svgChart.setAttribute('viewBox', '0 0 550 490');
      svgChart.setAttribute('height', '100%');
      svgChart.setAttribute('width', '100%');
    }
  };

  useEffect(() => {
    applyChartScaling()
  }, [])

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
        altText={"TODO"}
      >
        <div className={lineChart} data-testid={'chartParent'}>
          <Line
            data={data}
            layers={chartConfigs.layers}
            theme={{
              ...chartConfigs.theme,
              fontSize:  width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
              marker: {
                fontSize:  width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
              }
            }}
            colors={d => d.color}
            width={ 550 }
            height={ 490 }
            margin={{top: 25, right: 25, bottom: 45, left: 50}}
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
        <VisualizationCallout color={spendingExplainerPrimary}>
          <p>
            Since 2015, the Spending to GDP ratio has increased from XX% to XX%.
          </p>
        </VisualizationCallout>
      </div>
    </>
  );
}

export default withWindowSize(SpendingTrendsChart);


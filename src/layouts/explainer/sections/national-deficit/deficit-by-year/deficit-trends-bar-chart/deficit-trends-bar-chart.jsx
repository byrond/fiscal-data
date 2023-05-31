import { Bar } from '@nivo/bar';
import { deficitExplainerPrimary } from "../../national-deficit.module.scss";
import React, {useEffect, useState} from "react";
import {barChart, headerTitle, subHeader} from "./deficit-trends-bar-chart.module.scss";
import ChartContainer from "../../../../explainer-components/chart-container/chart-container";
import {container} from "./deficit-trends-bar-chart.module.scss";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";
import {breakpointLg, fontSize_12, fontSize_16, fontBodyCopy, fontTitle} from "../../../../../../variables.module.scss";
import {withWindowSize} from "react-fns";
import CustomLink from "../../../../../../components/links/custom-link/custom-link";
import {apiPrefix, basicFetch} from '../../../../../../utils/api-utils';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {preAPIData, generateTickValues, endpointUrl} from "./deficit-trends-bar-chart-helpers";
import {getDateWithoutTimeZoneAdjust} from "../../../../../../utils/date-utils";
import useGAEventTracking from '../../../../../../hooks/useGAEventTracking';
import Analytics from '../../../../../../utils/analytics/analytics';
import {
  addInnerChartAriaLabel,
  applyChartScaling,
  applyTextScaling,
} from '../../../../explainer-helpers/explainer-charting-helper';
import CustomBar from './custom-bar/custom-bar';

let gaTimerChart;

export const DeficitTrendsBarChart = ({ width }) => {
  const {getGAEvent} = useGAEventTracking(null, "Deficit");

  const desktop = width >= pxToNumber(breakpointLg);
  const [date, setDate] = useState(new Date ());
  const [chartData, setChartData] = useState([]);
  const [tickValuesX, setTickValuesX] = useState([]);
  const [tickValuesY, setTickValuesY] = useState([]);
  const [mostRecentFiscalYear, setMostRecentFiscalYear] = useState('');
  const [mostRecentDeficit, setMostRecentDeficit] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [minValue, setMinValue] = useState('');
  const [headerYear, setHeaderYear] = useState('');
  const [headerDeficit, setHeaderDeficit] = useState('');
  const [lastBar, setLastBar] = useState();
  const [numOfBars, setNumOfBars] = useState(0);

  const chartParent= 'deficitTrendsChartParent';
  const chartWidth = 495;
  const chartHeight = 388;

  const barHighlightColor = fontTitle;

  const formatCurrency = v => {
    if (parseFloat(v) < 0) {
      return `-$${Math.abs(v)} T`;
    }
    else {
      return `$${v} T`;
    }
  };

  const setAnimationDurations = (data, totalValues, totalDuration) => {
    if (data) {
      let delay = 100;
      data.forEach(datum => {
        const duration = Math.abs((datum.deficit / totalValues) * totalDuration);
        datum["duration"] = duration;
        datum["delay"] = delay;
        delay += duration;
      })
    }
    return data;
  }


  const getChartData = () => {
    const apiData = [];
    // Counts pre api data bars
    let barCounter = 14;
    const totalDuration = 15000;
    basicFetch(`${apiPrefix}${endpointUrl}`)
    .then((result) => {
      const lastEntry = result.data[result.data.length - 1];
      let deficitSum = 0;
      result.data.forEach((entry) => {
        const barColor = entry.record_fiscal_year === lastEntry.record_fiscal_year ? barHighlightColor : deficitExplainerPrimary;
        const deficitValue = (Math.abs(parseFloat(entry.current_fytd_net_outly_amt)) / 1000000000000);
        deficitSum += deficitValue;
        const maxYAxis = 3.5;   //TODO: 3.5 should not be hard coded here
        console.log(entry.record_fiscal_year);
        apiData.push({
          "year": entry.record_fiscal_year,
          "deficit": deficitValue.toFixed(2),
          "deficitColor": barColor,
          "extendedHover": (maxYAxis - deficitValue).toFixed(2),
          "extendedHoverColor": "hsl(0, 0%, 100%, 0.0)"
        })
        barCounter += 1;
      })
      preAPIData.forEach(entry => {
        deficitSum += Math.abs(entry.deficit);
      })
      setNumOfBars(barCounter);
      setDate(getDateWithoutTimeZoneAdjust
      (new Date(result.data[result.data.length -1].record_date)));
      const newData = setAnimationDurations(preAPIData.concat(apiData), deficitSum, totalDuration);
      const latestYear = newData[newData.length - 1].year;
      const latestDeficit = newData[newData.length - 1].deficit;
      setMostRecentFiscalYear(latestYear);
      setHeaderYear(latestYear);
      setMostRecentDeficit(latestDeficit);
      setHeaderDeficit(latestDeficit);
      setChartData(newData);
    });
  }

  const chartChangeOnMouseEnter = (data, event, chartData) => {
    const barSVGs = Array.from(event.target.parentNode.parentNode.children);
    if (data.id !== 'extendedHover') {
      if (data.data.year === chartData[chartData.length - 1].year) {
        event.target.style.fill = barHighlightColor;
        setLastBar(event.target.parentNode.parentNode.children
          [(barSVGs.length - 1) - numOfBars].firstChild);
        setHeaderYear(data.data.year);
        setHeaderDeficit(data.data.deficit);
      }
      else {
        event.target.style.fill = barHighlightColor;
        event.target.parentNode.parentNode.children
          [(barSVGs.length - 1) - numOfBars].firstChild.style.fill = deficitExplainerPrimary;
        setLastBar(event.target.parentNode.parentNode.children
          [(barSVGs.length - 1) - numOfBars].firstChild);
        setHeaderYear(data.data.year);
        setHeaderDeficit(data.data.deficit);
      }
    }
    else if (data.id === 'extendedHover') {
      if (data.data.year === chartData[chartData.length - 1].year) {
        const parentG = event.target.parentNode;
        const realBar = barSVGs.find((element) => element === parentG);
        const indexOfRealBar = barSVGs.indexOf(realBar) - numOfBars;
        event.target.parentNode.parentNode.children[indexOfRealBar]
          .firstChild.style.fill = barHighlightColor;
        setLastBar(event.target.parentNode.parentNode
          .children[(barSVGs.length - 1) - numOfBars].firstChild);
        const matchedBar = chartData.find((element) => element.year === data.data.year);
        setHeaderYear(matchedBar.year);
        setHeaderDeficit(matchedBar.deficit);
      }
      else {
        const parentG = event.target.parentNode;
        const realBar = barSVGs.find((element) => element === parentG);
        const indexOfRealBar = barSVGs.indexOf(realBar) - numOfBars;
        event.target.parentNode.parentNode
          .children[indexOfRealBar].firstChild.style.fill = barHighlightColor;
        event.target.parentNode.parentNode.children[(barSVGs.length - 1) - numOfBars]
          .firstChild.style.fill = deficitExplainerPrimary;
        const matchedBar = chartData.find((element) => element.year === data.data.year);
        setHeaderYear(matchedBar.year);
        setHeaderDeficit(matchedBar.deficit);
      }
    }
  }

  const chartChangeOnMouseLeave = (data, event) => {
    if (data.id !== 'extendedHover') {
        event.target.style.fill = deficitExplainerPrimary;
    }
    else if (data.id === 'extendedHover') {
      const parentG = event.target.parentNode;
      const barSVGs = Array.from(event.target.parentNode.parentNode.children);
      const realBar = barSVGs.find((element) => element === parentG);
      const indexOfRealBar = barSVGs.indexOf(realBar) - numOfBars;
      event.target.parentNode.parentNode.children[indexOfRealBar]
        .firstChild.style.fill = deficitExplainerPrimary;
    }
  }

  const resetHeaderValues = () => {
    setHeaderYear(mostRecentFiscalYear);
    setHeaderDeficit(mostRecentDeficit);

    if (lastBar)
      lastBar.style.fill = barHighlightColor;
  }

  useEffect(() => {
    applyChartScaling(chartParent, chartWidth.toString(), chartHeight.toString());
    addInnerChartAriaLabel(chartParent);
    getChartData();
  }, []);

  useEffect(() => {
    applyTextScaling(chartParent, chartWidth.toString(), width, fontSize_16);
  }, [width]);


  useEffect(() => {
    const tickValues = generateTickValues(chartData);
    setMinValue(tickValues[1][0]);
    setMaxValue(tickValues[1][tickValues[1].length - 1]);
    setTickValuesX(tickValues[0]);
    setTickValuesY(tickValues[1]);
  }, [chartData])


  const handleMouseChartEnter = () =>{
    const gaEvent = getGAEvent("30");
    gaTimerChart = setTimeout(() =>{
      gaEvent && Analytics.event({
        category: gaEvent.eventCategory.replace("Fiscal Data - ", ""),
        action: gaEvent.eventAction,
        label: gaEvent.eventLabel,
      });
    }, 3000);
  }

  const handleMouseChartLeave = () =>{
    clearTimeout(gaTimerChart);
  }


  const name = 'Monthly Treasury Statement (MTS)';
  const slug = `https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/summary-of-
  receipts-and-outlays-of-the-u-s-government`;
  const footer =
    <div>
      Visit the <CustomLink url={slug} eventNumber='18'>{name}</CustomLink> dataset to explore and
      download this data.
      <p>
        Please note: This data visual only includes completed fiscal years.
      </p>
    </div>

  const header =
    <>
      <div>
        <div className={headerTitle} data-testid={'deficitFiscalYearHeader'}>{headerYear}</div>
        <span className={subHeader}>Fiscal Year</span>
      </div>
    <div>
      <div className={headerTitle} data-testid={'deficitTotalHeader'}>${headerDeficit} T</div>
      <span className={subHeader}>Total Deficit</span>
    </div>
    </>

  const chartTheme = {
    fontSize:  width < pxToNumber(breakpointLg) ? fontSize_12 : fontSize_16,
    fontFamily: 'sans-serif',
    textColor: fontBodyCopy,
  }

  return (
    <>
      { chartData !== [] ? (
        <div className={container}
          onMouseEnter={handleMouseChartEnter}
          onMouseLeave={handleMouseChartLeave}
          role={'presentation'}
        >
          <ChartContainer
            title={`Federal Deficit Trends Over Time, FY 2001-${mostRecentFiscalYear}`}
            altText={'Bar graph that shows the federal deficit trend from 2001 to '
            + `${mostRecentFiscalYear}. Over the years, the data fluctuates with a spiked increase starting in 2019.`}
            header={header}
            footer={footer}
            date={date}
          >
            <div className={barChart}
                 onMouseLeave={resetHeaderValues}
                 data-testid={'deficitTrendsChartParent'}
                 role={'presentation'}
            >
              <Bar
                barComponent={CustomBar}
                width={ chartWidth }
                height={ chartHeight }
                data={chartData}
                keys={['deficit', 'extendedHover']}
                indexBy="year"
                margin={{top: desktop ? 15 : 10, right: 0, bottom: 20, left: 60}}
                padding={desktop ? 0.30 : 0.35}
                colors={({id, data}) =>  String(data[`${id}Color`])}
                isInteractive={false}
                axisBottom={{
                  tickSize: 0,
                  tickPadding: 5,
                  tickRotation: 0,
                  tickValues: tickValuesX
                }}
                axisLeft={{
                  format: formatCurrency,
                  tickSize: 0,
                  tickPadding: 5,
                  tickRotation: 0,
                  tickValues: tickValuesY
                }}
                enableGridX={true}
                theme={chartTheme}
                layers={['grid', 'axes', 'bars']}
                minValue={minValue}
                maxValue={maxValue}
                gridXValues={tickValuesX}
                gridYValues={tickValuesY}
                // reverse={true}
                // animate={false}
                // enableLabel={false}
                // onMouseEnter={(data, event) => {chartChangeOnMouseEnter(data, event, chartData)}}
                // onMouseLeave={(data, event) => {chartChangeOnMouseLeave(data, event)}}
                // tooltip={() => (<></>)}
              />
            </div>
          </ChartContainer>
        </div>
      ) : (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )
      }
    </>
  )
};

export default withWindowSize(DeficitTrendsBarChart);

import React, { useState, useEffect, Fragment } from "react"
import { apiPrefix, basicFetch } from "../../../../../utils/api-utils"
import Switch from "react-switch"
import numeral from "numeral"
import CustomLink from "../../../../../components/links/custom-link/custom-link"
import ChartContainer from "../../../explainer-components/chart-container/chart-container"
import {
  footerStyle,
  headerContainer,
  headerStyle,
  subHeader,
  chartsContainer,
  percentOrDollarContainer,
  descContainer,
  chartToggle,
  toggleButton,
  loadingIcon,
  toggleText,
} from "./how-much-does-the-govt-spend.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { useWindowSize } from "../../../../../hooks/windowResize"
import moment from "moment"


export const capitalizeLastLetter = word => {
  const parts = word.split("")
  const last = word[parts.length - 1].toUpperCase()
  parts[parts.length - 1] = last
  return parts.join("")
}

export const ToggleSwitch = ({
  checked,
  handleChange,
  customStyles,
  setPercentDollarToggleChecked,
  percentDollarToggleChecked,
}) => {
  return (
    <label htmlFor="material-switch">
      <Switch
        checked={checked}
        onChange={handleChange}
        onColor={customStyles.onColor}
        offColor={customStyles.offColor}
        handleDiameter={15}
        uncheckedIcon={false}
        checkedIcon={false}
        height={20}
        width={48}
        id="material-switch"
        onKeyDown={e => {
          if (e.key === "Enter") {
            setPercentDollarToggleChecked(!percentDollarToggleChecked)
          }
        }}
      />
    </label>
  )
}
const breakpoint = {
  desktop: 1015,
  tablet: 600,
}
const HowMuchDoesTheGovtSpend = () => {
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedChartView, setSelectedChartView] = useState("category")
  const [percentDollarToggleChecked, setPercentDollarToggleChecked] = useState(
    false
  )
  const [isMobile, setIsMobile] = useState(true)
  const [width, height] = useWindowSize()
  const [lastUpdatedDate, setLastUpdatedDate] = useState(new Date())
  const [fiscalYear, setFiscalYear] = useState('');

  const styleSwitch = () => {
    const switchHandle = document.querySelector("div.react-switch-handle")
    const backgroundWithOpacity = document.querySelector("div.react-switch-bg")
    if (switchHandle) {
      switchHandle.style.outline = "2px solid #00766c"
    }
    if (backgroundWithOpacity) {
      backgroundWithOpacity.style.setProperty("opacity", "0.25 ", "important")
    }
  }
  const getChartData = () => {
    Promise.all([
      basicFetch(
        `${apiPrefix}${`v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:F,record_calendar_month:eq:09&sort=-record_date,-current_fytd_rcpt_outly_amt&page[size]=19`}`
      ),
      basicFetch(
        `${apiPrefix}${`v1/accounting/mts/mts_table_5?filter=record_calendar_month:eq:09,data_type_cd:eq:T,sequence_level_nbr:eq:2,line_code_nbr:lte:5690&sort=-record_date,-current_fytd_net_outly_amt&page[size]=30`}`
      ),
    ]).then(result => {
      setChartData({
        category: result[0],
        agency: result[1],
      })
      setLoading(false)
    })
  }
  useEffect(() => {
    getChartData()
  }, [])
  useEffect(() => {
    if (!loading) {
      styleSwitch()
    }
  }, [loading])

  useEffect(() => {
    if (window.innerWidth < breakpoint.desktop) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }, [width, height])

  useEffect(() => {
    if (chartData && chartData[selectedChartView]?.data) {
      const dataItems = chartData[selectedChartView].data
      const dates = dataItems.map(item => moment(item.record_date))
      const maxDate = moment.max(dates)
      const updatedDate = new Date(maxDate.toDate())
      setLastUpdatedDate(updatedDate)
      setFiscalYear(updatedDate.getFullYear());
    }
  }, [selectedChartView, chartData])

  const name = "Monthly Treasury Statement (MTS)"
  const slug = `https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/summary-of-
  receipts-and-outlays-of-the-u-s-government`
  const footer = (
    <div className={footerStyle}>
      Visit the <CustomLink url={slug}>{name}</CustomLink> dataset to explore
      and download this data.
    </div>
  )

  const header = (
    <div className={headerContainer}>
      <div className={headerStyle} style={{ fontWeight: "600" }}>
        U.S. Government Spending, FY {fiscalYear}
      </div>
      <div className={subHeader}>Top 10 Spending by Category and Agency</div>
    </div>
  )
  const sortField =
    selectedChartView === "category"
      ? "current_fytd_rcpt_outly_amt"
      : "current_fytd_net_outly_amt"

  let sortedItems =
    chartData &&
    chartData[selectedChartView]?.data.sort((a, b) => {
      return b[sortField] - a[sortField]
    })

  const total = (sortedItems || [])
    .map(item => parseInt(item[sortField], 10))
    ?.reduce((item, nextItem) => {
      return item + nextItem
    }, 0)

  sortedItems = sortedItems?.map(item => {
    return {
      ...item,
      percentage: Math.round((parseInt(item[sortField], 10) / total) * 100),
      dollarAmount: parseInt(item[sortField]),
    }
  })

  const firstTen = sortedItems?.slice(0, 10)
  const other = sortedItems?.slice(10)

  const otherTotal = (other || [])
    .map(item => parseInt(item[sortField], 10))
    ?.reduce((item, nextItem) => {
      return item + nextItem
    }, 0)
  const otherPercentage = Math.round((otherTotal / total) * 100)

  return (
    <ChartContainer
      customContainerStyles={{
        flexDirection: "column",
        marginLeft: "0px",
        maxWidth: "100%",
        paddingLeft: "0px",
      }}
      customFooterSpacing={{ paddingLeft: "32px" }}
      customSpacing={{
        marginBottom: "32px",
        paddingLeft: "0px",
      }}
      customHeaderStyles={{
        marginTop: "0px",
        justifyContent: "flex-start",
      }}
      header={header}
      footer={footer}
      date={lastUpdatedDate}
      altText={
        "Horizontal bar graph comparing government spending by category or agency from largest to smallest, by percentage or dollar value"
      }
    >
      {loading ? (
        <div className={loadingIcon}>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      ) : (
        <Fragment>
          {" "}
          <div className={chartToggle}>
            <button
              className={toggleButton}
              style={{
                borderBottomLeftRadius: "4px",
                borderTopLeftRadius: "4px",
                color: selectedChartView === "category" ? "#f1f1f1" : "#00766C",
                background:
                  selectedChartView === "category" ? "#00766C" : "#f1f1f1",
                borderRight: "none",
              }}
              onClick={() => {
                setSelectedChartView("category")
              }}
            >
              <span
                style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: selectedChartView === "agency" ? "inherit" : "#FFFFFF",
                  fontWeight: 600
                }}
              >
                Category
              </span>
            </button>
            <button
              className={toggleButton}
              style={{
                borderBottomRightRadius: "4px",
                borderTopRightRadius: "4px",
                color: selectedChartView === "agency" ? "#f1f1f1" : "#00766C",
                background:
                  selectedChartView === "agency" ? "#00766C" : "#f1f1f1",
              }}
              onClick={() => {
                setSelectedChartView("agency")
              }}
            >
              <span
                style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: selectedChartView === "agency" ? "#FFFFFF" : "inherit",
                  fontWeight: 600
                }}
              >
                Agency
              </span>
            </button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <span
              style={{
                fontWeight: !percentDollarToggleChecked ? "600" : "inherit",
                marginRight: "4px",
                color: !percentDollarToggleChecked ? "#00766C" : "#666",
                minWidth: "80px",
                fontSize: "14px",
              }}
            >
              Percentage
            </span>
            <ToggleSwitch
              checked={percentDollarToggleChecked}
              handleChange={e => {
                setPercentDollarToggleChecked(e)
              }}
              customStyles={{
                onColor: "#00766C",
                offColor: "#00766C",
              }}
              percentDollarToggleChecked={percentDollarToggleChecked}
              setPercentDollarToggleChecked={setPercentDollarToggleChecked}
            ></ToggleSwitch>
            <span
              style={{
                fontWeight: percentDollarToggleChecked ? "600" : "inherit",
                marginLeft: "4px",
                color: percentDollarToggleChecked ? "#00766C" : "#666",
                marginBottom: "24px",
                minWidth: "80px",
                fontSize: "14px",
              }}
            >
              Dollars
            </span>
          </div>
          {firstTen?.map((item, i) => {
            return (
              <div className={chartsContainer} key={i}>
                <div
                  style={{
                    background: "#00766C",
                    width: `${item.percentage * (isMobile ? 1 : 2)}%`,
                    marginRight: "10px",
                    height: "40px",
                  }}
                ></div>
                <div
                  className={percentOrDollarContainer}
                  style={{
                    marginRight: item.percentage > 20 ? "0px" : "8px",
                  }}
                >
                  {percentDollarToggleChecked
                    ? `${capitalizeLastLetter(
                        Math.abs(item.dollarAmount) > 999999999999
                          ? numeral(item.dollarAmount).format("($ 0.00 a)")
                          : numeral(item.dollarAmount).format("($ 0 a)")
                      )}`
                    : `${item.percentage} %`}
                </div>
                <div className={descContainer}>
                  {item.classification_desc?.replace("Total--", "")}
                </div>
              </div>
            )
          })}
          <div className={chartsContainer} key={otherPercentage}>
            <div
              style={{
                background: "#00766C",
                width: `${otherPercentage * (isMobile ? 1 : 2)}%`,
                marginRight: "10px",
                height: "40px",
              }}
            ></div>
            <div className={percentOrDollarContainer}>
              {percentDollarToggleChecked
                ? `${capitalizeLastLetter(
                    Math.abs(otherTotal) > 999999999999
                      ? numeral(otherTotal).format("($ 0.0 a)")
                      : numeral(otherTotal).format("($ 0 a)")
                  )}`
                : `${otherPercentage} %`}
            </div>
            <div className={descContainer}>Other </div>
          </div>
        </Fragment>
      )}
    </ChartContainer>
  )
}

export default HowMuchDoesTheGovtSpend

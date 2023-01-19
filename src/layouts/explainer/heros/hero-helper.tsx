import {pillDataContainer, pillDataValue, pillDataPercent, explainerArrow}
  from "../hero-image/hero-image.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownLong, faUpLong} from "@fortawesome/free-solid-svg-icons";
import React from "react";

export const getShortForm = (
  value: string,
  fractionDigits: number = 0,
  abbreviate: boolean = true,
  defaultDigits: boolean = false,
): string => {

  const trimmed = Math.abs(Number(value)).toFixed();
  const inTrillions = trimmed.length > 12;
  const divisor = inTrillions ? 1000000000000 : 1000000000;
  const trillionLabel = abbreviate ? ' T' : ' trillion';
  const billionLabel = abbreviate ? ' B' : ' billion';
  const appendix = inTrillions ? trillionLabel : billionLabel;
  const digits = defaultDigits ?
    (inTrillions ? 2 : 0) : fractionDigits;

  return Math.abs(
    (parseFloat(value) / divisor)).toFixed(digits) + appendix;
};

export const getFootNotesDateRange = (
  priorFY: string,
  currentFY: string,
  currentRecordMonth: string): string => {
  const date = new Date();
  date.setDate(15);
  date.setMonth(parseInt(currentRecordMonth) - 1);
  const currentMonth = date.toLocaleString('en-US', {month: 'short'});
  const priorFiscalStartYear = Number(priorFY) -1;
  return (currentRecordMonth === 'Oct' ? (
    `Oct ${priorFiscalStartYear}`
  ) : (
    `Oct ${priorFiscalStartYear} - ${currentMonth} ${currentFY}`
  ));
};

export const getPillData = (
  value: number,
  percent: number,
  changeLabel: string,
  desktop: boolean,
  color: string,
  leftPillTooltipText: string,
  rightPillTooltipText: string,): JSX.Element => {
  const displayValue = getShortForm(value.toString(), 0);
  const displayPercent = percent.toFixed();
  const valueLength = displayValue.length + 1;
  const percentLength = displayPercent.length + 1;
  const getPillWidth = (displayValueLength) =>
    (displayValueLength > 4 ? ((displayValueLength - 4) / 2) + 4 : 4);

  return (
    <div className={pillDataContainer}>
        <div className={pillDataValue} title={leftPillTooltipText}
             style={{background:color, width:`${getPillWidth(valueLength)}rem`}}
        >
          ${displayValue}
        </div>
      {
        changeLabel === 'increased' ? (
            <div className={explainerArrow}>
              <FontAwesomeIcon icon={faUpLong} title={"up arrow"} />
            </div>
          )
          : (
            <div className={explainerArrow}>
              <FontAwesomeIcon icon={faDownLong} title={"down arrow"} />
            </div>
          )
      }
        <div className={pillDataPercent} title={rightPillTooltipText}
             style={{background:color, width:`${getPillWidth(percentLength)}rem`}}
        >
          {displayPercent}%
        </div>
    </div>
  )
};

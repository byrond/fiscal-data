import React, {FunctionComponent, useCallback, useEffect, useState} from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import BreadCrumbs from '../../components/breadcrumbs/breadcrumbs';
import {
  title,
  container,
  currencyBoxContainer,
  footer,
  icon,
  selectText,
  breadCrumbsContainer,
  selectorContainer,
  effectiveDateContainer,
  effectiveDateText,
  selector,
  box,
  legalDisclaimer,
} from './currency-exchange-rates-converter.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import ExchangeRatesBanner
  from "../../components/exchange-rates-converter/exchange-rates-banner/exchange-rates-banner";
import CurrencyEntryBox
  from "../../components/exchange-rates-converter/currency-entry-box/currency-entry-box";
import SelectControl from "../../components/select-control/select-control";
import {apiPrefix, basicFetch} from "../../utils/api-utils";
import { quarterNumToTerm, dateStringConverter, apiEndpoint, breadCrumbLinks, fastRound } from "./currency-exchange-rates-converter-helper";
import { BASE_URL } from "gatsby-env-variables";
import CustomLink from "../../components/links/custom-link/custom-link";

const envBaseUrl = BASE_URL;

const CurrencyExchangeRatesConverter: FunctionComponent = () => {

  const [data, setData] = useState(null);
  const [sortedCurrencies, setSortedCurrencies] = useState(null as Currency[]);
  const [currencyMap, setCurrencyMap] = useState(null as Record<string, Currency>);
  const [dropdownOptions, setDropdownOptions] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [nonUSCurrency, setNonUSCurrency] = useState(null);
  const [effectiveDate, setEffectiveDate] = useState(null);
  const [quarters, setQuarters] = useState([]);
  const [years, setYears] = useState([]);
  const [usDollarValue, setUSDollarValue] = useState('1.00');
  const [nonUSCurrencyExchangeValue, setNonUSCurrencyExchangeValue] = useState('1.00');
  const [yearToQuartersMap, setYearToQuartersMap] = useState(null);
  const [resetFilterCount, setResetFilterCount] = useState(0);

  type CurrencyYearQuarter = {
    effectiveDate: string,
    rate: string,
    data: Record<string, string>
  };

  type Currency = {
    label: string;
    yearQuarterMap: Record<string, CurrencyYearQuarter>
  };

  const yearQuarterParse = (dataRecord: Record<string, string>): string =>
    `${dataRecord.record_calendar_year}Q${dataRecord.record_calendar_quarter}`;

  useEffect(() => {
    basicFetch(`${apiPrefix}${apiEndpoint}`).then((res) => {
      const yearToQuartersMapLocal = {} as Record<string, number[]>;
      const currencyMapLocal: Record<string, Currency> = {};
      res.data.forEach(record => {
        if (!currencyMapLocal[record.country_currency_desc]) {
          currencyMapLocal[record.country_currency_desc] = {
            label: record.country_currency_desc,
            yearQuarterMap: {} as Record<string, CurrencyYearQuarter>
          } as Currency;
        }
        currencyMapLocal[record.country_currency_desc].yearQuarterMap[yearQuarterParse(record)] = {
          effectiveDate: record.effective_date,
          rate: record.exchange_rate,
          data: record
        };
        if (!yearToQuartersMapLocal[record.record_calendar_year]) {
          yearToQuartersMapLocal[record.record_calendar_year] = [];
        }
        if (!yearToQuartersMapLocal[record.record_calendar_year].includes(parseInt(record.record_calendar_quarter))) {
          yearToQuartersMapLocal[record.record_calendar_year].push(parseInt(record.record_calendar_quarter));
        }
      });
      Object.values(yearToQuartersMapLocal).forEach(quarters => {
        quarters = quarters.sort((a, b) => a-b);
      });
      setSortedCurrencies(Object.values(currencyMapLocal).sort((a,b)=>a.label.localeCompare(b.label)));
      setYearToQuartersMap(yearToQuartersMapLocal);
      setCurrencyMap(currencyMapLocal);

      const listOfYearOptions = Object.keys(yearToQuartersMapLocal).sort((a,b) => b.localeCompare(a))
      .map((year) => ({ label: year, value: parseInt(year) }));
      const mostRecentYear = Math.max(...listOfYearOptions.map(entry => entry.value));
      const newestQuarter = yearToQuartersMapLocal[mostRecentYear][yearToQuartersMapLocal[mostRecentYear].length - 1];
      // Setting default values based on default non US currency (Euro)
      const euro = currencyMapLocal['Euro Zone-Euro'].yearQuarterMap[`${mostRecentYear}Q${newestQuarter}`].data;
      setNonUSCurrency(euro);
      setNonUSCurrencyExchangeValue(euro.exchange_rate);

      const recordQuartersSet = [...new Set(res.data
      .filter((entry => entry.country_currency_desc === euro.country_currency_desc && entry.record_calendar_year === euro.record_calendar_year))
      .map(entry => parseInt(entry.record_calendar_quarter)))];
      recordQuartersSet.sort((a:number, b:number) => {return a-b});
      const listOfQuarterOptions = recordQuartersSet.map((quarter) => ({ label: quarterNumToTerm(quarter), value: quarter }));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // TODO: Fix this TS warning
      const mostRecentQuarter = Math.max(...listOfQuarterOptions.map(entry => entry.value));
      setYears(listOfYearOptions);
      setQuarters(listOfQuarterOptions);
      setSelectedYear({
        label: mostRecentYear.toString(),
        value: mostRecentYear
      });
      setSelectedQuarter({
        label: quarterNumToTerm(mostRecentQuarter),
        value: mostRecentQuarter
      });
      const date = new Date(euro.effective_date);
      setEffectiveDate(dateStringConverter(date));
      setData(res.data);
    });
  }, []);

  const updateCurrencyDropdownOptions = (selQuarter, selYear) => {
    const selectedYearQuarter = `${selYear.value}Q${selQuarter.value}`;
    setDropdownOptions(sortedCurrencies.map(currency =>
      ({
        label: currency.label,
        value: currency.yearQuarterMap[selectedYearQuarter] ? currency.yearQuarterMap[selectedYearQuarter].data : null
      })
    ));
  }

  useEffect(() => {
    if (selectedQuarter && selectedYear) {
      updateCurrencyDropdownOptions(selectedQuarter, selectedYear);
    }
  }, [selectedQuarter, selectedYear])

  const updateCurrencyForYearQuarter = (year, quarter, nonUSCurrencyLocal, currencyMapLocal) => {
    const selectedYearQuarter = `${year}Q${quarter}`;
    if (currencyMapLocal[nonUSCurrencyLocal.country_currency_desc] === undefined) {
      return;
    }
    else if (!currencyMapLocal[nonUSCurrencyLocal.country_currency_desc].yearQuarterMap[`${year}Q${quarter}`]) {
      setNonUSCurrency({});
      setNonUSCurrencyExchangeValue('--');
      setUSDollarValue('1.00');
      setEffectiveDate('');
      setResetFilterCount(resetFilterCount + 1);
    } else {
      // Update currency, exchange rate, and effective date entry to match quarter entry
      const matchedRecord = currencyMapLocal[nonUSCurrencyLocal.country_currency_desc].yearQuarterMap[selectedYearQuarter].data;
      setNonUSCurrency(matchedRecord);
      setNonUSCurrencyExchangeValue(matchedRecord.exchange_rate);
      const date = new Date(matchedRecord.effective_date);
      setEffectiveDate(dateStringConverter(date));
    }
  };

  const useHandleChangeQuarters = useCallback((option) => {

    updateCurrencyForYearQuarter(selectedYear.label, option.value, nonUSCurrency, currencyMap);
    setSelectedQuarter(option);
  }, [selectedQuarter, data, nonUSCurrency, currencyMap]);

  const handleChangeYears = useCallback((option) => {

    updateCurrencyForYearQuarter(option.label, selectedQuarter.value, nonUSCurrency, currencyMap);

    if (yearToQuartersMap[option.label][selectedQuarter.value]) {
      setSelectedQuarter({label: quarterNumToTerm(selectedQuarter.value), value: selectedQuarter.value});
    }
    else if (!yearToQuartersMap[option.label][selectedQuarter.value]) {
      // Set quarter to most recent for that year
      const newestQuarter = yearToQuartersMap[option.label][yearToQuartersMap[option.label].length - 1];
      setSelectedQuarter({label: quarterNumToTerm(newestQuarter), value: newestQuarter});
    }
    setSelectedYear(option);
    setQuarters(yearToQuartersMap[option.label].map((quarter) => ({
      label: quarterNumToTerm(quarter),
      value: quarter
    })));
  }, [selectedYear, data, nonUSCurrency, currencyMap]);

  const useHandleChangeUSDollar = useCallback((event) => {

    let product;
    setUSDollarValue(event.target.value);
    if (!isNaN(parseFloat(event.target.value))) {
      product = fastRound((parseFloat(event.target.value) * parseFloat(nonUSCurrency.exchange_rate)) * 100) / 100;
    }
    if (!isNaN(product)) {
      setNonUSCurrencyExchangeValue(product.toString());
    }
  }, [usDollarValue, nonUSCurrency]);

  const handleChangeNonUSCurrency = useCallback((event) => {
    let quotient;
    if(event !== null) {
      setNonUSCurrencyExchangeValue(event.target.value);
      if (!isNaN(parseFloat(event.target.value))) {
        quotient = (fastRound((parseFloat(event.target.value) / parseFloat(nonUSCurrency.exchange_rate)) * 100) / 100).toFixed(2);
      }
      if (!isNaN(quotient)) {
        setUSDollarValue(quotient.toString());
      }
    }
  }, [nonUSCurrencyExchangeValue, nonUSCurrency]);

  const handleCurrencyChange = useCallback((event) => {
    if (event !== null) {
      setNonUSCurrency(event.value);
      setNonUSCurrencyExchangeValue(event.value.exchange_rate);
      setEffectiveDate(dateStringConverter(new Date(event.value.effective_date)));
      setUSDollarValue('1.00');
    }
  }, []);


  const socialCopy = {
    title: 'Test title',
    description: 'Test description',
    body: 'Test body',
    emailSubject: 'Test email subject',
    emailBody: 'test email body',
    url: envBaseUrl+'/currency-exchange-rates-converter/',
    image: '',
  }

  return (
    <SiteLayout isPreProd={false}>
      <PageHelmet
        pageTitle= "Currency Exchange Rates Convertor Tool "
        description={"Fiscal Data’s Currency Exchange Rates Convertor Tool provides accurate " +
          "and reliable currency exchange rates based on trusted U.S. Treasury data that can " +
          "be used for purposes such as IRS Report of Foreign Bank and Financial Accounts " +
          "(FBAR) reporting."}
        descriptionGenerator={false}
        keywords=""
        image=""
        canonical=""
        datasetDetails=""
      />
      <div className={breadCrumbsContainer}>
        <BreadCrumbs links={breadCrumbLinks} />
      </div>
      <ExchangeRatesBanner text={'Currency Exchange Rates Converter'} copy={socialCopy} />
      <div className={container}>
          <span className={title}>
            Check foreign currency rates against the US Dollar.
          </span>
        {
          data && (
            <div className={selectorContainer}>
              <div className={selector} data-testid={'year-selector'}>
                <SelectControl label={'Year'} className={box} options={years} selectedOption={selectedYear} changeHandler={handleChangeYears} />
              </div>
              <div className={selector} data-testid={'quarter-selector'}>
                <SelectControl label={'Quarter'} className={box} options={quarters} selectedOption={selectedQuarter} changeHandler={useHandleChangeQuarters} />
              </div>
              <div className={effectiveDateContainer}>
                <div>Effective Date <FontAwesomeIcon icon={faCircleInfo as IconProp} className={icon} /> </div>
                <span className={effectiveDateText}> {effectiveDate} </span>
              </div>
            </div>
          )
        }
        <div className={selectText}>
            <span>
              Select a country-currency and then enter a value for US Dollars or for the foreign
              currency to see the conversion. {" "}
            </span>
          <FontAwesomeIcon icon={faCircleInfo as IconProp} className={icon} />
        </div>
        {
          nonUSCurrency !== null && (
            <div className={currencyBoxContainer} data-testid={'box-container'}>
              <CurrencyEntryBox
                defaultCurrency={'US Dollar'}
                currencyValue={usDollarValue}
                onCurrencyValueChange={useHandleChangeUSDollar}
                testId={'us-box'}
              />
              <CurrencyEntryBox
                selectedCurrency={{
                  label: nonUSCurrency.country_currency_desc ? nonUSCurrency.country_currency_desc :
                  null,
                  value: nonUSCurrency}}
                defaultCurrency={nonUSCurrency.country_currency_desc}
                currencyValue={nonUSCurrencyExchangeValue}
                dropdown={true}
                options={dropdownOptions}
                onCurrencyChange={handleCurrencyChange}
                onCurrencyValueChange={handleChangeNonUSCurrency}
                resetFilterCount={resetFilterCount}
                testId={'non-us-box'}
              />
            </div>
          )
        }
        {
          nonUSCurrency!== null && nonUSCurrency.exchange_rate ? (
            <span data-testid={'exchange-values'}>
              1.00 US Dollar = {nonUSCurrency.exchange_rate} {nonUSCurrency.country_currency_desc}
            </span>
          ) :
          <>
          </>
        }
        <span className={footer}>
            The Currency Exchange Rates Converter tool is driven by the Treasury Reporting Rates of
            Exchange dataset. This dataset is updated quarterly and covers the period from
            December 31, 2022 to Month, DD, YYYY. For more information and to see the full dataset,
            please visit the Treasury Reporting Rates of Exchange dataset page.
        </span>
      </div>
      <div className={legalDisclaimer}>
        <span> Important Legal Disclosures and Information</span>
        <p>
          The Treasury Reporting Rates of Exchange dataset provides the U.S. government's authoritative
          foreign currency exchange rates for federal agencies to consistently report U.S. dollar equivalents.
          For more information on the calculation of exchange rates used by federal agencies, please see the {' '}
          <CustomLink url={'https://tfm.fiscal.treasury.gov/v1/p2/c320'}>Treasury Financial Manual, volume 1, part 2, section 3235</CustomLink>.
          This Exchange Rate Converter Tool is designed to make foreign currency exchange data values
          easier to access for federal agency reporting purposes.
        </p>
      </div>
    </SiteLayout>
  )
};

export default CurrencyExchangeRatesConverter;

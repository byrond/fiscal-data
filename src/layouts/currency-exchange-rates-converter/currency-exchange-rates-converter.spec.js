import {render, cleanup, waitFor, within} from "@testing-library/react";
import React from "react";
import fetchMock from "fetch-mock";
import CurrencyExchangeRatesConverter from "./index";
import {fireEvent} from "@testing-library/dom";



describe('exchange rates converter', () => {

  const mockData = {
    "data": [
      {
        "record_date":"2022-12-31",
        "country":"Euro Zone",
        "currency":"Euro",
        "country_currency_desc":"Euro Zone-Euro",
        "exchange_rate":"89.11",
        "effective_date":"2022-12-31",
        "src_line_nbr":"1",
        "record_fiscal_year":"2023",
        "record_fiscal_quarter":"1",
        "record_calendar_year":"2022",
        "record_calendar_quarter":"4",
        "record_calendar_month":"12",
        "record_calendar_day":"31"
      },
      {
        "record_date":"2022-01-31",
        "country":"Euro Zone",
        "currency":"Euro",
        "country_currency_desc":"Euro Zone-Euro",
        "exchange_rate":"99.11",
        "effective_date":"2022-12-31",
        "src_line_nbr":"1",
        "record_fiscal_year":"2023",
        "record_fiscal_quarter":"1",
        "record_calendar_year":"2022",
        "record_calendar_quarter":"1",
        "record_calendar_month":"12",
        "record_calendar_day":"31"
      },
      {
        "record_date":"2023-12-31",
        "country":"Euro Zone",
        "currency":"Euro",
        "country_currency_desc":"Euro Zone-Euro",
        "exchange_rate":"4360.0",
        "effective_date":"2022-12-31",
        "src_line_nbr":"94",
        "record_fiscal_year":"2023",
        "record_fiscal_quarter":"1",
        "record_calendar_year":"2023",
        "record_calendar_quarter":"2",
        "record_calendar_month":"12",
        "record_calendar_day":"31"
      },
    ]
  }

  beforeEach(() => {

    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/od/rates_of_exchange?filter=record_date:gte:2022-12-31&sort=currency,-effective_date`,
      mockData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );

  });

  afterEach(cleanup);

  it('Renders the exchange rates converter page', async() => {

    const {getAllByText} = render(
      <CurrencyExchangeRatesConverter />
    )

    await waitFor(() => getAllByText('Currency Exchange Rates Converter'));

    expect(getAllByText('Currency Exchange Rates Converter').length).toBeGreaterThan(0);
  });

  it('Selecting year from year dropdown changes available quarters and defaults to correct value', async() => {
    const {getByTestId, getByText} = render(
      <CurrencyExchangeRatesConverter />
    )
    await waitFor(() => getByText('Year'));

    expect(getByText('Year')).toBeInTheDocument();
    expect(getByText('Quarter')).toBeInTheDocument();

    const yearSelector = within(getByTestId('year-selector')).getByTestId('toggle-button');
    expect(yearSelector).toBeDefined();

    // Click on parent selector
    fireEvent.click(yearSelector);

    const yearSelectorOptions = within(getByTestId('year-selector')).getAllByTestId('selector-option');
    expect(yearSelectorOptions[0]).toBeDefined();

    // Click on '2022'
    fireEvent.click(yearSelectorOptions[0]);

    // Make sure that quarters have changed to '4th' and '1st'
    const quarterSelector2022 = within(getByTestId('quarter-selector')).getByTestId('toggle-button');
    expect(quarterSelector2022).toBeDefined();
    // Make sure it defaults to latest quarter '4th'
    expect(quarterSelector2022.innerHTML).toContain('4th');
    fireEvent.click(quarterSelector2022);
    const quarterSelectorOptions2022 = within(getByTestId('quarter-selector')).getAllByTestId('selector-option');
    expect(quarterSelectorOptions2022.length).toEqual(2);
    // Make sure quarters are in ascending order
    expect(quarterSelectorOptions2022[0].innerHTML).toContain('1st');
    expect(quarterSelectorOptions2022[1].innerHTML).toContain('4th');

  });

  it('year dropdown selected for year with 1 available quarter', async() => {
    const {getByTestId, getByText} = render(
      <CurrencyExchangeRatesConverter />
    )
    await waitFor(() => getByText('Year'));

    const yearSelector = within(getByTestId('year-selector')).getByTestId('toggle-button');
    expect(yearSelector).toBeDefined();

    fireEvent.click(yearSelector);

    const yearSelectorOptions = within(getByTestId('year-selector')).getAllByTestId('selector-option');
    expect(yearSelectorOptions[0]).toBeDefined();

    // Click on '2023
    fireEvent.click(yearSelectorOptions[1]);

    // Make sure that quarters have changed to '2nd'
    const quarterSelector2023 = within(getByTestId('quarter-selector')).getByTestId('toggle-button');
    expect(quarterSelector2023).toBeDefined();
    // Make sure it defaults to latest quarter '2nd'
    expect(quarterSelector2023.innerHTML).toContain('2nd');
    fireEvent.click(quarterSelector2023);
    const quarterSelectorOptions2023 = within(getByTestId('quarter-selector')).getAllByTestId('selector-option');
    expect(quarterSelectorOptions2023.length).toEqual(1);
    expect(quarterSelectorOptions2023[0].innerHTML).toContain('2nd');

  });

  it('quarter selector changes relevant values', async()=> {

  });

})

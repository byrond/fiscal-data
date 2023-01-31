import {render, waitFor} from "@testing-library/react";
import {fireEvent} from "@testing-library/dom";
import {nationalDebtSectionIds} from "../../national-debt";
import React from "react";
import {determineBEAFetchResponse} from "../../../../../../utils/mock-utils";
import {mockBeaGDPData, mockExplainerPageResponse} from "../../../../explainer-test-helper";
import Analytics from "../../../../../../utils/analytics/analytics";
import {DebtTrendsOverTimeChart} from "./debt-trends-over-time-chart";
import fetchMock from "fetch-mock";


jest.useFakeTimers();

describe('The Growing National Debt', () => {
  const sectionId = nationalDebtSectionIds[3];

  beforeEach(() => {
    determineBEAFetchResponse(jest, mockExplainerPageResponse);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });


  it('contains the debt trends line chart', async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { findByTestId } = render(
      <DebtTrendsOverTimeChart beaGDPData={mockBeaGDPData} sectionId={sectionId} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());

    expect(await findByTestId('debtTrendsChart')).toBeInTheDocument();
  })

  it('Renders the chart point', async () => {
    const fetchSpy = jest.spyOn(global, "fetch");

    const { findByTestId, getByTestId } = render(
      <DebtTrendsOverTimeChart beaGDPData={mockBeaGDPData} sectionId={sectionId} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());

    expect(await findByTestId('debtTrendsChart')).toBeInTheDocument();
    const chartPoint = await getByTestId('debtTrendsChart')
      .querySelector('div > div > svg > g > g > circle:nth-child(1)');
    expect(chartPoint).toBeInTheDocument();
  });

  it('Renders the chart slices', async () => {
    const { findByTestId, getByTestId } = render(
      <DebtTrendsOverTimeChart beaGDPData={mockBeaGDPData} sectionId={sectionId} />

    );

    expect(await findByTestId('debtTrendsChart')).toBeInTheDocument();
    const chartSlice = await getByTestId('debtTrendsChart')
      .querySelector('div > div > svg > g > g > rect:nth-child(1)');

    expect(chartSlice).toBeInTheDocument();
  });

  it('initializes with the earliest data point', async () => {
    const { findAllByText } = render(
      <DebtTrendsOverTimeChart beaGDPData={mockBeaGDPData} sectionId={sectionId} />

    );

    const dateComponents = await findAllByText("2011");
    expect(dateComponents[0]).toBeInTheDocument();

    const valueComponent = await findAllByText("80%");
    expect(valueComponent[0]).toBeInTheDocument();
  })


  it('calls the appropriate analytics event when links are clicked on', async () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { findByText, findByTestId } = render(
      <DebtTrendsOverTimeChart beaGDPData={mockBeaGDPData} sectionId={sectionId} />

    );

    expect(await findByTestId('debtTrendsChart')).toBeInTheDocument();

    const historicalDebt = await findByText('Historical Debt Outstanding');
    const bea = await findByText('Bureau of Economic Analysis');

    historicalDebt.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Citation Click`,
      label: 'Debt - Federal Debt Trends Over Time'
    });
    spy.mockClear();

    bea.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Citation Click`,
      label: 'Debt - Federal Debt Trends Over Time'
    });
    spy.mockClear();
  });

  it('calls the appropriate analytics event when the chart is hovered over', async () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { findByTestId } = render(
      <DebtTrendsOverTimeChart beaGDPData={mockBeaGDPData} sectionId={sectionId} />
    );

    const chart = await findByTestId('debtTrendsChart');
    fireEvent.mouseOver(chart);
    jest.advanceTimersByTime(5000);
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Chart Hover`,
      label: 'Debt - Federal Debt Trends Over Time'
    });
    jest.runAllTimers();
  })
});

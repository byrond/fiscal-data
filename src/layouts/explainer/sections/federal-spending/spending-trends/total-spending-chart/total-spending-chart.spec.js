import { render, waitFor } from "@testing-library/react";
import React from "react";
import TotalSpendingChart from "./total-spending-chart";
import fetchMock from "fetch-mock";
import { determineBEAFetchResponse } from "../../../../../../utils/mock-utils";

describe("Total Spending Chart", () => {
  const mockCpiDataset = {
    "2015": "237.945",
    "2016": "241.428",
    "2017": "246.819",
    "2018": "252.439",
    "2019": "256.759",
    "2020": "260.280",
    "2021": "274.310",
    "2022": "296.808",
  };

  const mockCallOutData = {
    data: [
      {
        current_fytd_net_outly_amt: "3687622059038.44",
        record_date: "2015-09-30",
        record_fiscal_year: "2015",
      },
    ],
  };

  const mockSpendingData = {
    data: [
      {
        current_fytd_net_outly_amt: "3687622059038.44",
        record_date: "2015-09-30",
        record_fiscal_year: "2015",
      },
      {
        current_fytd_net_outly_amt: "3854100140609.65",
        record_date: "2016-09-30",
        record_fiscal_year: "2016",
      },
      {
        current_fytd_net_outly_amt: "3980605417586.44",
        record_date: "2017-09-30",
        record_fiscal_year: "2017",
      },
      {
        current_fytd_net_outly_amt: "4107741496584.31",
        record_date: "2018-09-30",
        record_fiscal_year: "2018",
      },
      {
        current_fytd_net_outly_amt: "4446583636480.58",
        record_date: "2019-09-30",
        record_fiscal_year: "2019",
      },
      {
        current_fytd_net_outly_amt: "6551872254653.64",
        record_date: "2020-09-30",
        record_fiscal_year: "2020",
      },
      {
        current_fytd_net_outly_amt: "6818157647016.83",
        record_date: "2021-09-30",
        record_fiscal_year: "2021",
      },
    ],
  };

  beforeAll(() => {    
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_date&page[size]=1`,
      mockCallOutData,
      { overwriteRoutes: true },
      { repeat: 0 }
    );
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_datet`,
      mockSpendingData,
      { overwriteRoutes: true },
      { repeat: 0 }
    );
    // fetchMock.get(
    //   `https://apps.bea.gov/api/data/?UserID=F9C35FFF-7425-45B0-B988-9F10E3263E9E&method=GETDATA&datasetname=NIPA&TableName=T10105&frequency=Q&year=X&ResultFormat=JSON`,
    //   mockSpendingData,
    //   { overwriteRoutes: true },
    //   { repeat: 0 }
    // );

    determineBEAFetchResponse(jest, mockSpendingData);
  });

  it("renders the calloutText", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { getByText } = render(
      <TotalSpendingChart cpiDataByYear={mockCpiDataset} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    //If this is set, that means all 3 API calls were sucessful.
    expect(await getByText("Since 2015, the Spending to GDP ratio has increased from 18% to 23%.", { exact: false })).toBeInTheDocument();
  });

  it("renders the chart", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { getByTestId } = render(
      <TotalSpendingChart cpiDataByYear={mockCpiDataset} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId("chartParent")).toBeInTheDocument();
  });

  it("renders the chart markers and data header labels", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { getAllByText, getByText } = render(
      <TotalSpendingChart cpiDataByYear={mockCpiDataset} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getAllByText("Total Spending")).toHaveLength(2);
    expect(await getAllByText("GDP")).toHaveLength(2);
    expect(await getByText("Fiscal Year")).toBeInTheDocument();
  });

  
});

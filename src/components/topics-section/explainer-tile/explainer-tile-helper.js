import React, { useEffect, useState } from "react";
import { apiPrefix, basicFetch } from "../../../utils/api-utils";
import { getShortForm } from "../../../layouts/explainer/heros/hero-helper";

export const SpendingBodyGenerator = () => {
  const fields =
    "fields=current_fytd_net_outly_amt,record_fiscal_year,record_date";
  const filter = "filter=line_code_nbr:eq:5691";
  const sort = "sort=-record_date";
  const pagination = "page[size]=1";
  const endpointUrl = `v1/accounting/mts/mts_table_5?${fields}&${filter}&${sort}&${pagination}`;
  const spendingUrl = `${apiPrefix}${endpointUrl}`;
  const [amount, setAmount] = useState("0");
  const [year, setYear] = useState("null");

  useEffect(() => {
    basicFetch(`${spendingUrl}`).then(res => {
      if (res.data) {
        const data = res.data[0];
        setAmount(data.current_fytd_net_outly_amt);
        setYear(data.record_fiscal_year);
      }
    });
  }, []);

  return (
    <>
      The U.S. government has spent ${getShortForm(amount, 2, false)} in fiscal
      year {year} to ensure the well-being of the people of the United States.
      Learn more about spending categories, types of spending, and spending
      trends over time.
    </>
  );
};

export const pageTileMap = {
  debt: {
    title: "What is the national debt?",
    body:
      "The national debt enables the federal government to pay for important programs and " +
      "services for the American public. Explore debt concepts, the latest values, and trends " +
      "over time.",
    altText:
      "Hands raised in the air holding various objects, including a calculator, a pencil, " +
      "money, and magnifying glass",
    desktopImage: "homepage_debt_1200x630",
    mobileImage: "homepage_debt_square",
    path: "/americas-finance-guide/national-debt/",
  },
  spending: {
    title: "How much has the U.S. government spent this year?",
    body:
      "The U.S. government has spent {$XX.X trillion (total spending)} in fiscal " +
      "year {YYYY (current fiscal year)} to ensure the well-being of the people of the " +
      "United States. Learn more about spending categories, types of spending, and " +
      "spending trends over time.",
    bodyGenerator: SpendingBodyGenerator,
    altText:
      "The US Treasury building is placed next to a row of homes. A pair of hands " +
      "exchange money in the foreground.",
    desktopImage: "homepage_spending_1200x630",
    mobileImage: "homepage_spending_square",
    mainFeature: true,
    path: "/americas-finance-guide/federal-spending/",
  },
  deficit: {
    title: "What is the national deficit?",
    body:
      "A national deficit occurs when the money going out exceeds the money coming in for a " +
      "given period of time. Learn more about the U.S. deficit and how it has changed over time.",
    altText:
      "A hand holding a gold coin beside a variety of symbols, including a pie chart, bar " +
      "graph, and lit lightbulb.",
    desktopImage: "homepage_deficit_1200x630",
    mobileImage: "homepage_deficit_square",
    path: "/americas-finance-guide/national-deficit/",
  },
  revenue: {
    title: "How much revenue has the U.S. government collected this year? ",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    altText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    desktopImage: "Revenue_C_1200x630",
    mobileImage: "Revenue_C_630x630",
    path: "americas-finance-guide/government-revenue",
  },
  "americas-finance-guide": {
    title: "Your Guide to America’s Finances",
    body:
      "Here you’ll find information on spending, revenue, the deficit, and debt. The Guide represents a series of interactive visualizations exploring each category and how it has changed over time.",
    altText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    desktopImage: "AFG-Overview_1200x630",
    mobileImage: "afg-feature-homepage-mobile",
    path: "americas-finance-guide",
  },
};

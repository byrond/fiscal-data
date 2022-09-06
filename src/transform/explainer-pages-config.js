const explainerPagesSource = {
  "national-debt": {
    slug: "/national-debt/",
    breadCrumbLinkName: "Debt",
    seoConfig: {
      pageTitle: "Understanding the National Debt",
      description: `Learn how the national debt works and how it impacts you.`,
    },
    prodReady: true,
    heroImage: {
      heading: "What is the national debt?",
      subHeading: `The national debt is the total amount of outstanding borrowing by the U.S. Federal
      Government accumulated over the nation’s history.`,
    },
    relatedDatasets: [
      "015-BFS-2014Q3-065",
      "015-BFS-2014Q3-071",
      "015-BFS-2014Q1-11",
      "015-BFS-2014Q3-056",
    ],
  },
  "national-deficit": {
    slug: "/national-deficit/",
    breadCrumbLinkName: "Deficit",
    seoConfig: {
      pageTitle: "National Deficit",
      description: `Learn about the national deficit, the difference between budget deficit and
      debt, and how the deficit has changed over time.`,
    },
    prodReady: true,
    heroImage: {
      heading: "What is the national deficit?",
      subHeading: "",
    },
    relatedDatasets: [
      "015-BFS-2014Q1-13",
      "015-BFS-2014Q3-096",
      "015-BFS-2014Q1-07",
      "015-BFS-2014Q1-03",
    ],
  },
  "federal-spending": {
    slug: "/federal-spending/",
    breadCrumbLinkName: "Spending",
    seoConfig: {
      pageTitle: "Federal Spending",
      description: `Explore federal spending by category or agency and learn how much the United
      States government spends each year.`,
    },
    prodReady: false,
    heroImage: {
      heading: "How much has the U.S. government spent this year?",
      subHeading: "",
    },
    relatedDatasets: [
      "015-BFS-2014Q1-13",
      "015-BFS-2014Q3-103",
      "015-BFS-2014Q1-03",
      "015-BFS-2014Q1-07",
    ],
  },
  "americas-finance-guide": {
    slug: "/americas-finance-guide/",
    breadCrumbLinkName: "Revenue",
    seoConfig: {
      pageTitle: "Government Revenue | U.S. Treasury Fiscal Data",
      description: `Learn how much the U.S. government collects in revenue, and what types of revenue it brings in.`,
    },
    prodReady: false,
    heroImage: {
      heading: "How much revenue has the U.S. government collected this year? ",
      subHeading: `Government revenue is income received from taxes and other sources to pay for government expenditures. The U.S. government has collected {$XX.X trillion (total revenue)} in fiscal year {YYYY (current FY)}.`,
    },
    relatedDatasets: [
      "015-BFS-2014Q1-13",
      "015-BFS-2014Q3-103",
      "015-BFS-2014Q1-03",
      "015-BFS-2014Q1-07",
    ],
  },
}

const freshExplainerPages = () => {
  const output = []

  Object.entries(explainerPagesSource).forEach(([pageName, ep]) => {
    output[output.length] = {
      ...ep,
      pageName,
    }
  })

  return output
}

exports.freshExplainerPages = freshExplainerPages

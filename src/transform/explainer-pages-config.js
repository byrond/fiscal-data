const explainerPagesSource = {
  'national-debt': {
    slug: '/national-debt/',
    breadCrumbLinkName: 'Debt',
    seoConfig: {
      pageTitle: 'Understanding the National Debt',
      description: `Learn how the national debt works and how it impacts you.`
    },
    prodReady: true,
    heroImage: {
      heading: 'What is the national debt?',
      subHeading: `The national debt is the total amount of outstanding borrowing by the U.S. Federal
      Government accumulated over the nation’s history.`
    },
    relatedDatasets: [ "015-BFS-2014Q3-065", "015-BFS-2014Q3-071", "015-BFS-2014Q1-11", "015-BFS-2014Q3-056" ]
  },
  'national-deficit': {
    slug: '/national-deficit/',
    breadCrumbLinkName: 'Deficit',
    seoConfig: {
      pageTitle: 'National Deficit',
      description: `Learn about the national deficit, the difference between budget deficit and
      debt, and how the deficit has changed over time.`
    },
    prodReady: false,
    heroImage: {
      heading: 'What is the national deficit?',
      subHeading: ''
    },
    relatedDatasets: ["015-BFS-2014Q1-13", "015-BFS-2014Q3-096", "015-BFS-2014Q1-07", "015-BFS-2014Q1-03"]
  }
}

const freshExplainerPages = () => {
  const output = [];

  Object.entries(explainerPagesSource).forEach(([pageName, ep]) => {
    output[output.length] = {
      ...ep,
      pageName
    };
  });

  return output;
}

exports.freshExplainerPages = freshExplainerPages;

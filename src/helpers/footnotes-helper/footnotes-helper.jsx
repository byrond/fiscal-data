export const getAFGFootnotes = currentFiscalYear => {
    return [
      {
        text: '1',
        link: 'CurrentFiscalYear',
        body: `The current fiscal year began on October 1, ${currentFiscalYear-1} and ends September 30, ${currentFiscalYear}.`,
      },
      {
        text: '2',
        link: 'PreviousFiscalYear',
        body: `The previous fiscal year began on October 1, ${currentFiscalYear-2} and ended September 30, ${currentFiscalYear-1}.`,
      },
    ];
  };
import { rowsShowing, tableFooter } from '../../dtg-table/dtg-table.module.scss';
import PaginationControls from '../../pagination/pagination-controls';
import React, { FunctionComponent, useEffect } from 'react';
import { Table } from '@tanstack/react-table';
import { range } from '../data-table.module.scss';

interface IDataTableFooter {
  table: Table<any>;
  showPaginationControls: boolean;
  pagingProps;
  dateRange;
  maxPage;
  setCurrentPage;
  rowsShowing;
  rowText;
  maxRows;
}

const DataTableFooter: FunctionComponent<IDataTableFooter> = ({
  table,
  showPaginationControls,
  pagingProps,
  dateRange,
  maxPage,
  setCurrentPage,
  rowText,
  rowsShowing,
  maxRows,
}) => {
  const [filteredRowLength, setFilteredRowLength] = React.useState(null);
  useEffect(() => {
    setFilteredRowLength(maxPage);
  }, [maxPage]);

  // const visibleRows = table => {
  //   const rowsVisible = table?.getRowModel().flatRows.length;
  //   const pageSize = pagingProps.itemsPerPage; //table.getState().pagination.pageSize;
  //   const pageIndex = table.getState().pagination.pageIndex;
  //   const minRow = pageIndex * pageSize + 1;
  //   const maxRow = pageIndex * pageSize + rowsVisible;
  //   return (
  //     <>
  //       Showing{' '}
  //       <span className={range}>
  //         {rowsShowing ? (
  //           `${rowsShowing.begin} - ${rowsShowing.end}`
  //         ) : (
  //         `${minRow} - ${maxRow}`
  //         )}
  //       </span>{' '}
  //       rows of {filteredRowLength} rows
  //     </>
  //   );
  // };

  // const handlePerPageChange = pageSize => {
  //   table.setPageSize(pageSize);
  //   pagingProps?.handlePerPageChange(pageSize);
  // };
  //
  // const handleJump = x => {
  //   console.log('handleJump: ', x);
  //   setCurrentPage(x - 1);
  // };

  return (
    <div data-test-id="table-footer" className={tableFooter}>
      <div data-test-id="rows-showing" className={rowsShowing}>
        {`Showing ${rowsShowing.begin} - ${rowsShowing.end} ${rowText[0]} of ${maxRows} ${rowText[1]}`}
      </div>
      {showPaginationControls && <PaginationControls pagingProps={pagingProps} />}
    </div>
  );
};

export default DataTableFooter;

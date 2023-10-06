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
  prepaginated: boolean;
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
  prepaginated,
}) => {
  const [filteredRowLength, setFilteredRowLength] = React.useState(null);
  useEffect(() => {
    setFilteredRowLength(table.getSortedRowModel().rows.length);
  }, [table.getSortedRowModel()]);

  const visibleRows = table => {
    const rowsVisible = table?.getRowModel().flatRows.length;
    const pageSize = table.getState().pagination.pageSize;
    const pageIndex = table.getState().pagination.pageIndex;
    const minRow = pageIndex * pageSize + 1;
    const maxRow = pageIndex * pageSize + rowsVisible;
    return (
      <>
        Showing <span className={range}>{prepaginated ? `${rowsShowing.begin} : ${rowsShowing.end}` : `${minRow} - ${maxRow}`}</span> rows of{' '}
        {prepaginated ? filteredRowLength : maxRows} rows
      </>
    );
  };

  const handlePerPageChange = pageSize => {
    table.setPageSize(pageSize);
    pagingProps?.handlePerPageChange(pageSize);
  };

  const paging = prepaginated
    ? pagingProps
    : {
        itemsPerPage: pagingProps?.itemsPerPage,
        handlePerPageChange: x => handlePerPageChange(x),
        handleJump: x => table.setPageIndex(x - 1),
        maxPage: table.getPageCount(),
        tableName: '',
        currentPage: table.getState().pagination.pageIndex + 1,
        maxRows: filteredRowLength,
        table: table,
      };

  // return (
  //   <div data-test-id="table-footer" className={tableFooter}>
  //     <div data-test-id="rows-showing" className={rowsShowing}>
  //       {visibleRows(table)}
  //     </div>
  //     {showPaginationControls && (
  //       <PaginationControls
  //         pagingProps={{
  //           itemsPerPage: pagingProps?.itemsPerPage,
  //           handlePerPageChange: x => handlePerPageChange(x),
  //           handleJump: x => table.setPageIndex(x - 1),
  //           maxPage: table.getPageCount(),
  //           tableName: '',
  //           currentPage: table.getState().pagination.pageIndex + 1,
  //           maxRows: filteredRowLength,
  //           table: table,
  //         }}
  //       />
  //     )}
  //   </div>
  // );

  return (
    <div data-test-id="table-footer" className={tableFooter}>
      <div data-test-id="rows-showing" className={rowsShowing}>
        {`Showing ${rowsShowing.begin} - ${rowsShowing.end} ${rowText[0]} of ${maxRows} ${rowText[1]}`}
      </div>
      {showPaginationControls && <PaginationControls pagingProps={paging} />}
    </div>
  );
};

export default DataTableFooter;

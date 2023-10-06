import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, getFilteredRowModel, SortingState } from '@tanstack/react-table';
import DataTableFooter from './data-table-footer/data-table-footer';

import StickyTable from 'react-sticky-table-thead';
import {
  tableContainer,
  tableStyle,
  overlayContainerNoFooter,
  selectColumnPanelActive,
  selectColumnPanelInactive,
  selectColumnsWrapper,
} from './data-table.module.scss';
import DataTableHeader from './data-table-header/data-table-header';
import DataTableColumnSelector from './column-select/data-table-column-selector';
import DataTableBody from './data-table-body/data-table-body';
import { columnsConstructor } from './data-table-helper';

type DataTableProps = {
  // defaultSelectedColumns will be null unless the dataset has default columns specified in the dataset config
  rawData;
  defaultSelectedColumns: string[];
  setTableColumnSortData;
  hasPublishedReports: boolean;
  publishedReports: any[];
  hideCellLinks: boolean;
  resetFilters: boolean;
  shouldPage: boolean;
  showPaginationControls: boolean;
  setSelectColumnPanel;
  selectColumnPanel;
  setResetFilters: (value: boolean) => void;
  pageSize: number;
  setFiltersActive: (value: boolean) => void;
  dateRangeColumns: string[];
};

const DataTable: FunctionComponent<DataTableProps> = ({
  rawData,
  defaultSelectedColumns,
  setTableColumnSortData,
  shouldPage,
  showPaginationControls,
  publishedReports,
  hasPublishedReports,
  setSelectColumnPanel,
  selectColumnPanel,
  resetFilters,
  setResetFilters,
  hideCellLinks,
  pageSize,
  setFiltersActive,
  dateRangeColumns,
}) => {
  const allColumns = columnsConstructor(rawData, dateRangeColumns);
  const data = rawData.data;
  if (hasPublishedReports && !hideCellLinks) {
    // Must be able to modify allColumns, thus the ignore
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    allColumns[0].cell = ({ getValue }) => {
      if (
        publishedReports.find(report => {
          return report.report_date.toISOString().split('T')[0] === getValue();
        }) !== undefined
      ) {
        const path = publishedReports.find(report => {
          return report.report_date.toISOString().split('T')[0] === getValue();
        }).path;
        return <a href={path}>{getValue()}</a>;
      } else {
        return <span>{getValue()}</span>;
      }
    };
  }
  const [columns] = useState(() => [...allColumns]);

  const dataTypes = rawData.meta.dataTypes;

  const [sorting, setSorting] = useState<SortingState>([]);

  const defaultInvisibleColumns = {};
  const [columnVisibility, setColumnVisibility] = useState(defaultSelectedColumns ? defaultInvisibleColumns : {});

  const table = useReactTable({
    columns,
    data,
    columnResizeMode: 'onChange',
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      },
    },
    state: {
      columnVisibility,
      sorting,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const getSortedColumnsData = table => {
    const columns = table.getVisibleFlatColumns();
    const mapped = columns.map(column => ({
      id: column.id,
      sorted: column.getIsSorted(),
      filterValue: column.getFilterValue(),
      rowValues: table.getFilteredRowModel().flatRows.map(row => row.original[column.id]),
      allColumnsSelected: table.getIsAllColumnsVisible(),
    }));
    setTableColumnSortData(mapped);
  };

  useEffect(() => {
    getSortedColumnsData(table);
  }, [sorting, columnVisibility, table.getFilteredRowModel()]);

  useEffect(() => {
    if (resetFilters) {
      table.resetColumnFilters();
      table.resetSorting();
      setResetFilters(false);
    }
  }, [resetFilters]);

  const [defaultColumns, setDefaultColumns] = useState([]);
  const [additionalColumns, setAdditionalColumns] = useState([]);

  // We need to be able to access the accessorKey (which is a type violation) hence the ts ignore
  if (defaultSelectedColumns) {
    for (const column of allColumns) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!defaultSelectedColumns.includes(column.accessorKey)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        defaultInvisibleColumns[column.accessorKey] = false;
      }
    }
  }

  const constructDefaultColumnsFromTableData = () => {
    const constructedDefaultColumns = [];
    const constructedAdditionalColumns = [];
    for (const column of table.getAllLeafColumns()) {
      if (defaultSelectedColumns.includes(column.id)) {
        constructedDefaultColumns.push(column);
      } else if (!defaultSelectedColumns.includes(column.id)) {
        constructedAdditionalColumns.push(column);
      }
    }
    constructedAdditionalColumns.sort((a, b) => {
      return a.id.localeCompare(b.id);
    });
    setDefaultColumns(constructedDefaultColumns);
    setAdditionalColumns(constructedAdditionalColumns);
  };

  useEffect(() => {
    if (defaultSelectedColumns) {
      constructDefaultColumnsFromTableData();
    }
  }, []);
  const dataTableRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (defaultSelectedColumns) {
      dataTableRef.current?.focus();
    }
  }, []);

  return (
    <>
      <div 
        data-test-id="table-content" 
        className={overlayContainerNoFooter}
      >
        <div className={selectColumnsWrapper}>
          <div 
            className={selectColumnPanel ? selectColumnPanelActive : selectColumnPanelInactive} 
            data-testid="selectColumnsMainContainer"

          >
              {defaultSelectedColumns && (
                <DataTableColumnSelector
                  dataTableRef={dataTableRef}
                  fields={allColumns}
                  resetToDefault={() => setColumnVisibility(defaultInvisibleColumns)}
                  setSelectColumnPanel={setSelectColumnPanel}
                  defaultSelectedColumns={defaultSelectedColumns}
                  table={table}
                  additionalColumns={additionalColumns}
                  defaultColumns={defaultColumns}
                />
              )}
          </div>
          <div className={tableStyle}>
            <div data-test-id="table-content" className={tableContainer}>
              <StickyTable height={521}>
                <table>
                  <DataTableHeader
                    table={table}
                    dataTypes={dataTypes}
                    resetFilters={resetFilters}
                    setFiltersActive={setFiltersActive}
                    dateRangeColumns={dateRangeColumns}
                  />
                  <DataTableBody table={table} dataTypes={dataTypes} />
                </table>
              </StickyTable>
            </div>
          </div>
        </div>
      </div>
      {shouldPage && <DataTableFooter table={table} showPaginationControls={showPaginationControls} />}
    </>
  );
};

export default DataTable;

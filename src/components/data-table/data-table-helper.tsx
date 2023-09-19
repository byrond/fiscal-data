import { Column, ColumnDef } from '@tanstack/react-table';
import React, { FunctionComponent, useEffect, useState } from 'react';
import SearchBar from '../search-bar/search-bar';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import moment from 'moment';
import { currencyFormatter, numberFormatter } from '../../helpers/text-format/text-format';

const customFormat = (stringValue, decimalPlaces) => {
  // if block is to show "-$123,123.23" instead of "$-123,123.23"
  const absVal = Math.abs(stringValue);
  let returnString = '$' + absVal.toFixed(decimalPlaces).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  if (Number(stringValue) < 0) {
    returnString = '-' + returnString;
  }
  return returnString;
};

export const columnsConstructor = (rawData: any): any => {
  if (rawData.meta) {
    return Object.entries(rawData.meta.labels).map(([field, label]) => {
      if (field === 'record_date') {
        return {
          accessorKey: field,
          header: label,
          filterFn: 'equalsString',
          cell: ({ getValue }) => {
            return moment(getValue()).format('M/D/YYYY');
          },
        } as ColumnDef<any, any>;
      } else if (rawData.meta.dataTypes[field] === 'DATE') {
        return {
          accessorKey: field,
          header: label,
          cell: ({ getValue }) => {
            return moment(getValue()).format('M/D/YYYY');
          },
        } as ColumnDef<any, any>;
      } else if (rawData.meta.dataTypes[field] === 'NUMBER') {
        return {
          accessorKey: field,
          header: label,
          cell: ({ getValue }) => {
            return numberFormatter.format(getValue());
          },
        } as ColumnDef<any, any>;
      } else if (rawData.meta.dataTypes[field] === 'PERCENTAGE') {
        return {
          accessorKey: field,
          header: label,
          cell: ({ getValue }) => {
            return `${getValue()}%`;
          },
        } as ColumnDef<any, any>;
      } else if (rawData.meta.dataTypes[field] === 'SMALL_FRACTION') {
        return {
          accessorKey: field,
          header: label,
          cell: ({ getValue }) => {
            return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 5 }).format(getValue());
          },
        } as ColumnDef<any, any>;
      } else if (rawData.meta.dataTypes[field] === 'CURRENCY') {
        return {
          accessorKey: field,
          header: label,
          cell: ({ getValue }) => {
            return currencyFormatter.format(getValue());
          },
        } as ColumnDef<any, any>;
      } else if (rawData.meta.dataTypes[field].includes('CURRENCY') && /\d/.test(rawData.meta.dataTypes[field].split('CURRENCY')[1])) {
        const decimalPlaces = parseInt(rawData.meta.dataTypes[field].split('CURRENCY')[1]);
        return {
          accessorKey: field,
          header: label,
          cell: ({ getValue }) => {
            return customFormat(getValue(), decimalPlaces);
          },
        } as ColumnDef<any, any>;
      } else if (rawData.meta.dataTypes[field] === 'STRING') {
        return {
          accessorKey: field,
          header: label,
          cell: ({ getValue }) => {
            if (getValue().includes('%')) {
              return getValue().replace(/-/g, '\u2011');
            } else {
              return getValue();
            }
          },
        } as ColumnDef<any, any>;
      }
      return { accessorKey: field, header: label } as ColumnDef<any, any>;
    });
  } else {
    return [];
  }
};

export const Filter: FunctionComponent<any> = ({
  column,
  resetFilters,
  setFiltersActive,
}: {
  column: Column<any, any>;
  resetFilters: boolean;
  setFiltersActive: (value: boolean) => void;
}) => {
  const [active, setActive] = useState(false);
  const [filterDisplay, setFilterDisplay] = useState('');
  const clearFilter = () => {
    // fire artificial event to reset field
    onFilterChange({
      target: {
        value: '',
      },
    });
    column.setFilterValue('');
    setFilterDisplay('');
  };

  const onFilterChange = event => {
    const val = event && event.target ? event.target.value : '';
    column.setFilterValue(val);
    setFilterDisplay(val);
    setFiltersActive(val.length > 0);
  };

  useEffect(() => {
    clearFilter();
  }, [resetFilters]);

  return <SearchBar onChange={onFilterChange} filter={filterDisplay} handleClear={clearFilter} height="28px" active={active} setActive={setActive} />;
};

export const rightAlign = (type: string): boolean => {
  const types = ['DATE', 'CURRENCY', 'NUMBER', 'PERCENTAGE'];
  return types.includes(type) || type?.includes('CURRENCY');
};

export const SingleDateFilter: FunctionComponent<any> = ({ column }: { column: Column<any, any> }) => {
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (date) {
      if (!isNaN(date.toDate().getTime())) {
        column.setFilterValue(moment(date.toDate()).format('YYYY-MM-DD'));
      } else {
        column.setFilterValue('');
      }
    } else {
      column.setFilterValue('');
    }
  }, [date]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        sx={{
          '& .MuiInputBase-root': {
            height: '28px',
            fontSize: '14px',
            marginTop: '0.25rem',
          },
          '& .MuiInputLabel-root': {
            fontSize: '14px',
          },
        }}
        value={date}
        onChange={newValue => setDate(dayjs(newValue))}
        views={['year', 'month', 'day']}
        slotProps={{ textField: { size: 'small' } }}
      />
    </LocalizationProvider>
  );
};

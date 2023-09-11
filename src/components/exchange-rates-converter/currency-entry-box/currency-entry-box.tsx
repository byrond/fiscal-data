import React, { FunctionComponent } from 'react';
import {
  currencyBody,
  currencyBox,
  currencySelection,
  currencyText,
  headerIcon,
  boxLabel,
  headerContainer,
  comboCurrencySelection,
} from './currency-entry-box.module.scss';
import ComboCurrencySelect from '../../combo-select/combo-currency-select/combo-currency-select';
import { faDollarSign, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface ICurrencyEntryBox {
  defaultCurrency: string;
  currencyValue: string;
  dropdown?: boolean;
  selectedCurrency?;
  onCurrencyChange?;
  onCurrencyValueChange;
  options?: [];
  testId: string;
  header: string;
}

const noNonNumericChar = event => {
  // Prevents users from typing 'e', 'E', or '-'
  return (
    (event.key === 'e' || event.key === 'E' || event.key === '-') &&
    event.preventDefault()
  );
};

const CurrencyEntryBox: FunctionComponent<ICurrencyEntryBox> = ({
  defaultCurrency,
  dropdown = false,
  currencyValue,
  onCurrencyValueChange,
  onCurrencyChange,
  options,
  selectedCurrency,
  testId,
  header,
}) => {
  console.log(options);
  return (
    <>
      <div className={currencyBox} data-testid={testId}>
        <div className={headerContainer}>
          <FontAwesomeIcon
            icon={
              (header === 'U.S. DOLLAR' ? faDollarSign : faGlobe) as IconProp
            }
            className={headerIcon}
          />
          <span>{header}</span>
        </div>
        <div className={boxLabel}>Amount</div>
        <div className={currencyBody}>
          <div className={currencyText}>
            {currencyValue === '--' ? (
              <div>{currencyValue}</div>
            ) : (
              <input
                type="number"
                inputMode="numeric"
                step="any"
                onKeyDown={noNonNumericChar}
                onChange={onCurrencyValueChange}
                value={currencyValue}
                data-testid="input-dropdown"
              />
            )}
          </div>
        </div>
        <div className={boxLabel}>Country-Currency</div>
        {dropdown && options ? (
          <div className={comboCurrencySelection}>
            <ComboCurrencySelect
              selectedOption={selectedCurrency}
              options={options}
              labelDisplay={true}
              changeHandler={onCurrencyChange}
              isExchangeTool={true}
              required={true}
              disabledMessage="This option has no data for the selected quarter."
            />
          </div>
        ) : (
          <div className={currencySelection}>
            <span>{defaultCurrency}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default CurrencyEntryBox;

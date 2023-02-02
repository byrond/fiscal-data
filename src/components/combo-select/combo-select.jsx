import React, {useEffect, useRef, useState} from 'react';
import { inputContainer, iconButton } from './combo-select.module.scss';
import * as styles from '../select-control/select-control.module.scss';
import { filterYearOptions } from '../published-reports/util/util';
import useOnClickOutside from 'use-onclickoutside';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export default function ComboSelect(
  {
    options,
    changeHandler,
    optionLabelKey = 'label',
    selectedOption,
    yearFilter = false,
    scrollable,
    label,
    labelClass = '',
    required = false
  }) {
  const [filterCharacters, setFilterCharacters] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [droppedDown, setDroppedDown] = useState(false);
  const [inputRef, setInputFocus] = useFocus();

  const updateSelection = (selection) => {
    changeHandler(selection);
    setTimeout(() => {setDroppedDown(false);});
  };

  let timeOutId;

  // Prevent NAN pasted values like .3.2 or --1, etc. since neither keyPress nor onChange can be
  // reliably expected to fire in those cases.
  const restrictKeyPress = (event) => {
    // Extend browser behavior for numeric field preventing the field from echoing '.-+' or
    // digits beyond 4
    if (event.key && !(/\d/.test(event.key))) {
      event.preventDefault();
    }
  };

  // The above restrictKeyPress() isn't fully redundant with this function because when valid
  // number is made NAN by keyboard entry this function would have the effect of blanking the
  // whole field, but the keyPress intercepts that character before the value becomes NAN. So,
  // if a user types '201-' the result is '201' but would be '' without the onKeyPress
  // method. It's also not sufficient to place this sanitizing logic in the onChange method,
  // because onChange doesn't fire when the entry is NAN due to browser validation of numeric
  // input fields.
  const restrictInput = (event) => {
    if (yearFilter) {
      event.target.value = event.target.value.replace(/[^\d]/g, '').substr(0, 4);
    }
  };

  const toggleDropdown = () => {
    if (droppedDown) {
      onBlurHandler();
    } else {
      clearTimeout(timeOutId);
      setDroppedDown(true);
      setInputFocus();
    }
  }
  /* accessibility-enabling event handlers for interpreting focus state on control */
  const onBlurHandler = (event) => {
    if (!event || !(event.target.parentElement.contains(event.relatedTarget))) {
      timeOutId = setTimeout(() => {
        if (selectedOption && selectedOption.value) {
          setFilterCharacters(selectedOption.value);
        }
        setDroppedDown(false);
      });
    }
  };

  const onFocusHandler = () => {
   clearTimeout(timeOutId);
  };

  const ref = React.useRef(null)
  useOnClickOutside(ref, onBlurHandler)

  useEffect(() => {
    if (selectedOption && selectedOption.value) {
      setFilterCharacters(selectedOption.value);
    }
  }, [selectedOption]);

  const filterOptionsByEntry = (opts, entry) => {
    let filteredList = opts;
    if (entry?.length) {
      filteredList = opts.filter(opt => opt.label.toUpperCase().includes(entry.toUpperCase()));
    }
    if (filteredList.length === 0) {
      // No options matching ${filterCharacters}
      filteredList = [{label: `No matches. Please revise your search.`, value: null}];
    }
    return filteredList;
  };

  const clear = () => {
    changeHandler(null);
    // fire artificial event to reset field
    onFilterChange({
      target: {
        value: ''
      }
    })
  };

  const onFilterChange = (event) => {
    const val = (event && event.target) ? event.target.value : null;
    setFilterCharacters(val);
    const localFilteredOptions = yearFilter ?
      filterYearOptions(options, val) :
      filterOptionsByEntry(options, val);
    setFilteredOptions(localFilteredOptions);
    if (localFilteredOptions.length === 1
      && (localFilteredOptions[0].value
        && localFilteredOptions[0].value.toString() === val)) {
      updateSelection(localFilteredOptions[0]);
    } else {
      clearTimeout(timeOutId);
      setDroppedDown(true);
    }
  };

  const labelText = yearFilter ?
    `Year (${options[options.length -1].label} - ${options[0].label})` :
    label;
  return (
    <div className={styles.selector_container}>
      <div className={`${styles.selector_label} ${labelClass}`} data-testid="label">
        {labelText}
        {required && (<span className="required">*</span>)}
      </div>
      <div ref={ref} onFocus={onFocusHandler}>
        <div>
          {yearFilter ? (
            <input type="number"
                   className={styles.comboSelectField}
                   onChange={onFilterChange}
                   value={filterCharacters}
                   onFocus={onFilterChange}
                   max={options[0].value}
                   min={options[options.length -1].label}
                   maxLength={4}
                   placeholder={'Enter or select a year'}
                   onKeyPress={restrictKeyPress}
                   onInput={restrictInput}
                   title={'Enter a year'}
                   autoComplete={'off'}
            />
          ):(
            <div className={inputContainer}>
              <input type="text"
                     className={styles.comboSelectField}
                     onChange={onFilterChange}
                     value={filterCharacters}
                     onFocus={onFilterChange}
                     max={options[0].value}
                     min={options[options.length -1].label}
                     placeholder={'Enter or select option'}
                     autoComplete={'off'}
                     ref={inputRef}
              />
                  {(!filterCharacters || !(filterCharacters.length > 0))
                  ? (
                      <button
                        data-testid="dropdown-button"
                        className={iconButton}
                        onClick={toggleDropdown}
                        aria-label={droppedDown ? 'Collapse options' : 'Show options'}
                      >
                        <FontAwesomeIcon icon={faChevronDown} data-testid="down-arrow" />
                      </button>
                    )
                  : (
                      <button
                        data-testid="clear-button"
                        className={iconButton}
                        onClick={clear}
                        aria-label={filterCharacters.length > 0 ? 'clear filter' : ''}
                      >
                        <FontAwesomeIcon icon={faTimesCircle} data-testid="clear-filter-icon" />
                      </button>
                    )
                  }
            </div>
          )}
        </div>

      {droppedDown && (
        <ul className={`${styles.selector_list} ${scrollable ? styles.scrollable : ''}`}
            data-testid="selectorList"
        >
          {filteredOptions.map((option, index) => (
            <React.Fragment key={index}>
                <li className={styles.selector_option}>
                  <button
                    className={
                      classNames([
                        styles.selector_optionButton, option === selectedOption ?
                          styles.selector_optionSelected : ''
                      ])
                    }
                    onClick={() => {updateSelection(option)}}
                    disabled={required && !option.value}
                  >
                    {option[optionLabelKey]}
                  </button>
                </li>
            </React.Fragment>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}

const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current &&  htmlElRef.current.focus();
  }

  return [ htmlElRef, setFocus ];
}

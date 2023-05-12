import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  listContainer,
  title,
  sectionHeader,
  sectionTerms,
  termContainer,
  termText,
  scrollGradient,
  scrollContainerTop,
  backToList,
  arrowIcon
} from './glossary-list.module.scss';
import { IGlossaryMap } from '../../../helpers/glossary-helper/glossary-data';
import GlossaryDefinition from '../glossary-definition/glossary-definition';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { IGlossaryTerm } from '../../../models/IGlossaryTerm';


interface IGlossaryList {
  termMap?: IGlossaryTerm[],
  termList?: IGlossaryTerm[],
  filter: string,
  defaultTerm?: IGlossaryTerm,
}

const GlossaryList:FunctionComponent<IGlossaryList> = ({ termMap, termList, filter, defaultTerm}) => {
  const [scrollTop, setScrollTop] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState(defaultTerm);
  const [displayList, setDisplayList] = useState(termMap);
  const [noResults, setNoResults] = useState(false);


  const handleScroll = (scrollContainer) => {
    setScrollTop(scrollContainer.scrollTop === 0);
  }

  const filterTermsByEntry = (sortedList, entry) => {
    const filteredList = [];

    const filterNestedList = (terms) => {
      const matchedTerms = terms.filter(term => term.term.toUpperCase().includes(entry.toUpperCase()))
      if (matchedTerms.length > 0) {
        filteredList.push(matchedTerms);
      }
    }

    if (entry?.length) {
      sortedList.forEach(terms => filterNestedList(terms));
    }
    if (filteredList?.length === 0) {
      setNoResults(true);
    }
    return entry?.length > 0 ? filteredList : sortedList;
  };

  useEffect(() => {
    const localFilterOptions = filterTermsByEntry(termMap, filter);
    setDisplayList(localFilterOptions);
  }, [filter])

  useEffect(() => {
    const scrollContainer = document.querySelector('[data-testid="scrollContainer"]');

    if(scrollContainer) {
      scrollContainer.addEventListener('scroll', () => handleScroll(scrollContainer), {passive: true});

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }

  }, [selectedTerm]);

  const onTermClick = (e, term) => {
    if (e.key === undefined || e.key === 'Enter') {
      e.stopPropagation();
      setSelectedTerm(term);
    }
  }

  const onClickBack = () => {
    setSelectedTerm(null);
  }

  const underlineMatch = (term, filter) => {
    const termLength = term.length;
    const filterLength = filter.length;
    const start = term.indexOf(filter);
    const end = start + filterLength - 1;
    console.log(term.indexOf(filter));
    return (
      filterLength === 0 ? (
          <span>{term}</span>
          ) : (
          <>
            <span>{term.substr(0,start)}</span>
            <span>{term.substr(start,end)}</span>
            <span>{term.substr(end, termLength - 1)}</span>
          </>
        )
    );
  }

  return (
    <>
      {selectedTerm ? (
        <>
          <button onClick={onClickBack} className={backToList}>
            <FontAwesomeIcon icon={faArrowLeft as IconProp} className={arrowIcon} />
            Back to list
          </button>
          <GlossaryDefinition glossaryTerm={selectedTerm} />
        </>
        ) : (
          <>
            <span className={title}>All Terms </span>
            <div className={scrollTop ? scrollContainerTop : scrollGradient} data-testid={'scrollGradient'} />
            <div className={listContainer}>
              <div className={termContainer} data-testid={'scrollContainer'}>
                  {
                    displayList.map((section) => {
                      const header = section[0]?.term?.charAt(0);
                      return (
                        <React.Fragment key={header}>
                          <div className={sectionHeader}>
                            {header}
                          </div>
                          <div className={sectionTerms}>
                            {
                              section.map((term) => {
                                return (
                                  <div
                                    className={termText}
                                    tabIndex={0}
                                    role={'button'}
                                    key={term.term}
                                    onClick={(e) => onTermClick(e, term)}
                                    onKeyPress={(e) => onTermClick(e, term)}
                                  >
                                    {underlineMatch(term.term, filter)}
                                  </div>
                                );
                              })
                            }
                          </div>
                        </React.Fragment>
                      )
                    })
                  }

              </div>
            </div>
          </>
        )}
    </>
  )
}

export default GlossaryList;

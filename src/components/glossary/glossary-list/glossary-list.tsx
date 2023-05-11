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

  // const keys = Reflect.ownKeys(termMap);

  const handleScroll = (scrollContainer) => {
    setScrollTop(scrollContainer.scrollTop === 0);
  }

  const filterOptionsByEntry = (sortedList, entry) => {
    let filteredList = sortedList;

    const filterNestedList = (terms) => terms.filter(term => term.term.toUpperCase().includes(entry.toUpperCase()))

    if (entry?.length) {
      filteredList = sortedList.filter(terms => filterNestedList(terms).length > 0)
    }
    if (filteredList?.length === 0) {
      // No options matching ${filterCharacters}
      filteredList = [{label: `No matches. Please revise your search.`, value: null}];
    }
    return filteredList;
  };

  useEffect(() => {
    const localFilterOptions = filterOptionsByEntry(termMap, filter);
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
                                {term.term}
                              </div>
                            );
                          })
                        }
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

/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React, { FunctionComponent, useEffect, useState } from 'react';
import { glossaryContainer, glossaryHeaderContainer, open, overlay, tray } from './glossary.module.scss';
import GlossaryHeader from './glossary-header/glossary-header';
import GlossaryListContainer from './glossary-list/glossary-list-container';
import { getSortedGlossaryList } from '../../helpers/glossary-helper/glossary-data';
import { IGlossaryTerm } from '../../models/IGlossaryTerm';
import { removeAddressPathQuery } from '../../helpers/address-bar/address-bar';

interface IGlossary {
  termList: IGlossaryTerm[],
  activeState: boolean,
  setActiveState: (boolean) => void,
  glossaryEvent: boolean,
  glossaryClickEventHandler: (boolean) => void,
}

const getQueryTerm = (termList):IGlossaryTerm => {
  if (typeof window !== 'undefined') {
    const queryParameters= new URLSearchParams(window.location.search);
    const termSlug = queryParameters.get("glossary");
    if (termSlug) {
      return termList.find((element: IGlossaryTerm) => {
        if (termSlug !== null) {
          return element.slug === termSlug;
        }
      });
    }
  }
}

const Glossary:FunctionComponent<IGlossary> = ({ termList, activeState, setActiveState, glossaryEvent, glossaryClickEventHandler }) => {
  const [filter, setFilter] = useState('');

  const sortedTermList = getSortedGlossaryList(termList);
  const [queryTerm, setQueryTerm] = useState(getQueryTerm(termList));
  const [initialQuery, setInitialQuery] = useState(false);

  useEffect(() => {
    if (!initialQuery) {
      setInitialQuery(true);
      setActiveState(queryTerm !== null && queryTerm !== undefined);
      removeAddressPathQuery(window.location);
    }
  })

  useEffect(() => {
    if (glossaryEvent) {
      const term = getQueryTerm(termList);
      if (term) {
        setQueryTerm(term);
        setTimeout(() => {
          setActiveState(true);
          glossaryClickEventHandler(false);
          removeAddressPathQuery(window.location);
        });
      }
    }
  }, [glossaryEvent]);

  const toggleState = (e) => {
    if (!e.key || e.key === 'Enter') {
      setActiveState(!activeState);
      setQueryTerm(null);
    }
  }

  return (
    <div
      className={`${glossaryContainer} ${activeState ? open : ''}`}
      data-testid="glossaryContainer"
    >
      <div
        className={overlay}
        data-testid="overlay"
        onClick={toggleState}
      />
      <div className={`${tray} ${activeState ? open : ''}`}>
        {activeState && (
          <>
            <div className={glossaryHeaderContainer}>
              <GlossaryHeader clickHandler={toggleState} filter={filter} filterHandler={setFilter} />
            </div>
            <GlossaryListContainer
              sortedTermList={sortedTermList}
              filter={filter}
              filterHandler={setFilter}
              defaultTerm={queryTerm ? queryTerm : null}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Glossary;

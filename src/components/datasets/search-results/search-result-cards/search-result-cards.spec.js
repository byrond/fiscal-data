import React from "react";
import renderer from 'react-test-renderer';
import SearchResultCards from "./search-result-cards";
import DatasetCard from "../../../dataset-card/dataset-card";
import { SortOptions } from "../search-results-helper";
import {setWindowMockFontSize} from "../../../../utils/mock-utils";

const mockAllDatasets = [
    {name: 'Dataset A', datasetId: '0'},
    {name: 'Dataset B', datasetId: '1'},
    {name: 'Dataset C', datasetId: '2'},
    {name: 'Dataset D', datasetId: '3'},
    {name: 'Dataset E', datasetId: '4'}
];

const mockFilteredDatasets = [
  mockAllDatasets[0],
  mockAllDatasets[1],
  mockAllDatasets[2]
];

const activeSort = SortOptions[1];
const mockSorter = jest.fn();
activeSort.sortFn = mockSorter;

describe('Search Results Cards', () => {
  HTMLCanvasElement.prototype.getContext = jest.fn();
  let component;
  setWindowMockFontSize('16px');
  renderer.act(() => {
      component = renderer.create(
          <SearchResultCards allDatasets={mockAllDatasets}
                             filteredDatasets={mockFilteredDatasets}
                             activeSort={activeSort}
                             width={100}
          />
      );
  });

  const instance = component.root;

  it('creates a card for each item in the array of filteredDatasets', () => {
      expect(instance.findAllByType(DatasetCard).length).toBe(mockAllDatasets.length);
  });

  it('places cards by inline style', () => {
      expect(instance.findAllByProps({'data-testid': 'cardPlacement'})[1].props.style)
        .toStrictEqual({
            left: '0%',
            top: '351px'
        })
  });

  it('calls the active sort function', () => {
      expect(mockSorter).toHaveBeenCalled();
  });

  it('sets the height for the container', () => {
      expect(instance.findByProps({'data-test-id': 'wrapper'}).props.style.height).toBeDefined();
  });
});

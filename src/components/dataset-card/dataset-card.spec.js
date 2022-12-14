import React from 'react';
import renderer from 'react-test-renderer';
import Analytics from '../../utils/analytics/analytics';
import * as Gatsby from 'gatsby';

import DatasetCard from './dataset-card';
import * as datasetStyles from './dataset-card.module.scss';
import {render} from "@testing-library/react";

describe('DatasetCard', () => {

  // Jest gives an error about the following not being implemented even though the tests pass.
  HTMLCanvasElement.prototype.getContext = jest.fn();

  const mockConfig =
    {
      "apis": [
        {
          "dateField": "data_date",
          "endpoint": "accounting/od/debt_to_penny",
          "fields": null,
          "dimension": null,
          "filter": null
        }
      ],
      "name": "Debt to the Penny",
      "popular": true,
      "dataStartYear": 2005,
      "tagLine": "test tag line",
      "slug": "/debt-to-the-penny/",
      "summaryText": "Debt to the Penny is the total public debt outstanding reported each business day at3:00 P.M. Eastern Time with the previous business day’s data. The Debt to the Pennyis made up of intragovernmental holdings and debt held by the public, including securities issued by the U.S. Department of the Treasury (Treasury). Treasury securities primarily consist of marketable Treasury securities (bills, notes and bonds), savings bonds, and special securities issued to state and local governments.",
      "tags": [
        "Debt",
        "MVP"
      ],
      "techSpecs": {
        "lastUpdated": "12/19/2019",
        "fileFormat": null
      }
    };

  const context = "Related Dataset";
  const referrer = "Referring Dataset";

  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <DatasetCard
          dataset={mockConfig}
          context={context}
          referrer={referrer}
      />
    );
  });
  const instance = component.root;

  it('entire card, when clicked, links to relevant dataset detail page',() => {
    const spy = jest.spyOn(Gatsby, 'navigate');
    const thisCard = instance.findAllByProps({ className: datasetStyles.card});

    renderer.act(() => thisCard[0].props.onClick());

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(`/datasets${mockConfig.slug}`);
  });

  it('contains the dataset name within an < a > tag', () => {
    const titleLink = instance.findByProps({ className: datasetStyles.card_headerLink});
    expect(titleLink.props.to).toBe(`/datasets${mockConfig.slug}`);
    expect(titleLink.props.children.props.children).toBe(mockConfig.name);
  });

  it('contains the dataset name in the title of the < a > tag', () => {
    const titleLink = instance.findByProps({ className: datasetStyles.card_headerLink});
    expect(titleLink.props.to).toBe(`/datasets${mockConfig.slug}`);
    expect(titleLink.props.title).toBe(mockConfig.name);
  });

  it('contains the text "Dataset Details" within an < a > tag', () => {
    const link = instance.findByProps({ className: datasetStyles.card_link});
    expect(link.props.to).toBe(`/datasets${mockConfig.slug}`);
    expect(link.props.children).toBe('Dataset Details');
  });

  it('contains the tagLine', () => {
    const tagLineComponent = instance.findByProps({ className: datasetStyles.card_tagLine});
    expect(tagLineComponent).toBeDefined();
    expect(tagLineComponent.children[0].props.children).toBe(mockConfig.tagLine);
  });

  it('tracks when dataset card is click', () => {
    const spy = jest.spyOn(Analytics, 'event');

    const thisCard = instance.findAllByProps({ className: datasetStyles.card });
    renderer.act(() => thisCard[0].props.onClick());

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      'category': `${context} Click`,
      'action': `from ${referrer}`,
      'value': mockConfig.name
    });
  });

  it('tracks when dataset card is clicked from explainer page', () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByText } = render(
      <DatasetCard
        dataset={mockConfig}
        context={'Related Datasets'}
        referrer={'Spending'}
        explainer={true}
      />);
    const datasetCard = getByText('Debt to the Penny');

    datasetCard.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Citation Click`,
      label: 'Spending - Related Datasets'
    });
    spy.mockClear();
  });
});

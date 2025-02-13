import React, { FunctionComponent, useState } from 'react';
import Analytics from '../../utils/analytics/analytics';
import { navigate } from 'gatsby';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import { MuiThemeProvider } from '@material-ui/core';
import { theme } from '../../theme';
import { IDataset } from '../../models/IDataset';
import { card, card_withFocus, card_withFocus_FireFox, cardHeroImage, datasetName } from './dataset-card.module.scss';
import DatasetStats from './dataset-stats/dataset-stats';
import { isFirefox } from 'react-device-detect';
import heroImage0 from '../../../static/images/dataset-search-hero-images/Hero-0.png';
import heroImage1 from '../../../static/images/dataset-search-hero-images/Hero-1.png';
import heroImage2 from '../../../static/images/dataset-search-hero-images/Hero-2.png';
import heroImage3 from '../../../static/images/dataset-search-hero-images/Hero-3.png';
import heroImage4 from '../../../static/images/dataset-search-hero-images/Hero-4.png';
import heroImage5 from '../../../static/images/dataset-search-hero-images/Hero-5.png';
import heroImage6 from '../../../static/images/dataset-search-hero-images/Hero-6.png';
import heroImage7 from '../../../static/images/dataset-search-hero-images/Hero-7.png';
import heroImage8 from '../../../static/images/dataset-search-hero-images/Hero-8.png';

type DatasetCardProps = {
  dataset: IDataset;
  context: string;
  referrer: string;
  explainer?: boolean;
};

const DatasetCard: FunctionComponent<DatasetCardProps> = ({ dataset, context, referrer, explainer }) => {
  const cardLink = `/datasets${dataset.slug}`;
  const [applyFocusStyle, setApplyFocusStyle] = useState(false);
  const focusStyle = isFirefox ? card_withFocus_FireFox : card_withFocus;

  const assignHeroImage = () => {
    switch (dataset.heroNumber) {
      case 0:
        return heroImage0;
      case 1:
        return heroImage1;
      case 2:
        return heroImage2;
      case 3:
        return heroImage3;
      case 4:
        return heroImage4;
      case 5:
        return heroImage5;
      case 6:
        return heroImage6;
      case 7:
        return heroImage7;
      case 8:
        return heroImage8;
    }
  };

  const clickHandler: () => void = () => {
    if (context && referrer) {
      if (explainer) {
        Analytics.event({
          category: `Explainers`,
          action: 'Citation Click',
          label: `${referrer} - ${context}`,
        });
        // GA4 Data Layer - Dataset Click
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: `${referrer} - Citation Click`,
          citationClickEventLabel: `${dataset.name}`,
        });
        // GA4 Data Layer - Clear
        (window as any).dataLayer.push({
          event: `${referrer} - Citation Click`,
          citationClickEventLabel: undefined,
        });
      } else {
        Analytics.event({
          category: `${context} Click`,
          action: `from ${referrer}`,
          value: dataset.name,
        });
        // GA4 Data Layer - Dataset Click
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: `${context} Click`,
          eventLabel: `from ${referrer} to ${dataset.name}`,
        });
      }
    }
    navigate(cardLink);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Card className={applyFocusStyle ? focusStyle : card} onClick={clickHandler} id={explainer ? dataset.name : null}>
        <CardActionArea onFocus={() => setApplyFocusStyle(true)} onBlur={() => setApplyFocusStyle(false)} style={{ padding: 0 }}>
          <div>
            <img src={assignHeroImage()} alt={'hero'} className={cardHeroImage} />
            <div className={datasetName}>{dataset.name}</div>
          </div>
          <DatasetStats dataset={dataset} />
        </CardActionArea>
      </Card>
    </MuiThemeProvider>
  );
};

export default DatasetCard;

import React, { FunctionComponent } from 'react';
import BreadCrumbs from '../../components/breadcrumbs/breadcrumbs';
import PageHelmet from '../../components/page-helmet/page-helmet';
import SiteLayout from '../../components/siteLayout/siteLayout';
import explainerSections from './sections/sections';
import HeroImage from './hero-image/hero-image';
import { IExplainerPage } from '../../models/IExplainerPage';
import {
  explainerClassMap,
  explainerColorMap,
  explainerHeroMap
} from './explainer-helpers/explainer-helpers';

import {
  breadCrumbsContainer,
  contentContainer,
  relatedDatasetsStyle,
  mainContainer,
  mainContent,
  section,
  sectionBorder,
  sectionHeading,
  social,
  socialShare
} from './explainer.module.scss';
import SecondaryNav from '../../components/secondary-nav/secondary-nav';
import SocialShare from "./social-share/social-share";
import ExplainerRelatedDatasets from "./explainer-related-datasets/explainer-related-datasets";

const ExplainerPageLayout: FunctionComponent<IExplainerPage> = ({ path, pageContext }) => {
  const { pageName, breadCrumbLinkName, heroImage, seoConfig, relatedDatasets } = pageContext;

  const breadCrumbLinks: Record<string, unknown>[] = [
    {
      name: breadCrumbLinkName,
      link: path
    },
    {
      name: 'Home',
      link: '/'
    }
  ];

  return (
    <SiteLayout isPreProd={false}>
      <PageHelmet
        pageTitle={seoConfig.pageTitle}
        description={seoConfig.description}
        keywords=""
        image=""
        canonical=""
        datasetDetails=""
      />
      <div className={breadCrumbsContainer}>
        <BreadCrumbs links={breadCrumbLinks} />
      </div>
      <div className={mainContainer}>
        <HeroImage
          heading={heroImage.heading}
          subHeading={heroImage.subHeading}
          primaryColor={explainerColorMap[pageName].primary}
        >
          {explainerHeroMap[pageName]}
        </HeroImage>
        <div className={contentContainer}>
          <SecondaryNav
            sections={explainerSections[pageName]}
            activeClass={explainerClassMap[pageName].active}
            hoverClass={explainerClassMap[pageName].hover}
          >

            <div className={social}>
              <div className={socialShare}>
                <SocialShare/>
              </div>
              <div className={mainContent}>
                {explainerSections[pageName].map((s) => (
                  <React.Fragment key={s.index}>
                    <section
                      id={s.id}
                      className={section}
                    >
                      <h2
                        className={sectionHeading}
                        style={{ color: explainerColorMap[pageName].primary}}
                        data-testid="section-heading"
                      >
                        {s.title}
                      </h2>
                      {s.component}
                      {s.index !== explainerSections[pageName].length - 1 && (
                        <div
                          className={sectionBorder}
                          style={{ backgroundColor: explainerColorMap[pageName].secondary }}
                        />
                      )}
                    </section>
                  </React.Fragment>
                ))}
              </div>

            </div>
          </SecondaryNav>
        </div>
        <div className={relatedDatasetsStyle}>
          <ExplainerRelatedDatasets datasets={relatedDatasets} referrer={"example"}/>
        </div>
      </div>
    </SiteLayout>
  )
}

export default ExplainerPageLayout;

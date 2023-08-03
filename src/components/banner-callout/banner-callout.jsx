import React from 'react';
import CustomLink  from '../links/custom-link/custom-link';
import { banner, sideTab, calloutText, icon } from './banner-callout.module.scss';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BannerCallout = ({bannerCallout}) => {
    const calloutCopy = {
        "XRCallout":
            <>
              To calculate foreign currency exchange rates for tax reporting, visit the{" "}
              <CustomLink url={"/currency-exchange-rates-converter/"}>Currency Exchange Rates Converter</CustomLink>
              {" "}page.
            </>,
        "DTSAPIUpdate":
            <>
              NOTICE: UPDATES COMING SOON! The Daily Treasury Statement (DTS) dataset will be updated to match the published DTS.
              All DTS API endpoints will be renamed to show DTS table names. The Federal Tax Deposits and Short-Term
              Cash Investments tables will contain historical data only (through Feb. 13, 2023). There will be a new API endpoint
              for the Inter-Agency Tax Transfers table, which started on Feb. 14, 2023.
            </>
    }

    const currentCallout = calloutCopy[bannerCallout];

    if (currentCallout) {
        return (
            <div className={banner} data-testid="banner">
                <div className={sideTab} />
                <span className={calloutText}>
                    <FontAwesomeIcon className={icon} icon={faCircleInfo} />
                    <div>
                      {currentCallout}
                    </div>
                </span>
            </div>
        );
    } else {
        return null;
    }
}

export default BannerCallout;

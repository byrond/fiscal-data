import React, { useEffect, useState } from "react";
import { Grid } from '@material-ui/core';
import * as styles from './compare-section.module.scss';
import {spendingExplainerPrimary} from
    '../../../../layouts/explainer/sections/federal-spending/federal-spending.module.scss';
import {debtExplainerPrimary} from
    '../../../../layouts/explainer/sections/national-debt/national-debt.module.scss';
import {deficitExplainerPrimary} from
    '../../../../layouts/explainer/sections/national-deficit/national-deficit.module.scss'
import {revenueExplainerPrimary} from
    '../../afg-overview.module.scss'
import AfgIcon from '../afg-icon/afg-icon';
import {
  faCoins,
  faHandHoldingDollar,
  faChartArea,
  faMagnifyingGlassDollar
} from "@fortawesome/free-solid-svg-icons";
import { basicFetch } from "../../../../utils/api-utils"
import { getShortForm } from "../../../../layouts/explainer/heros/hero-helper"
import ApiRequest from "../../../../helpers/api-request"
import {
  deficitRequest,
  revenueCategoryRequest,
  revenueRequest,
  spendingCategoryRequest,
  spendingRequest,
  debtRequest
} from "../../../../layouts/explainer/explainer-helpers/afg-overview-helpers"


export default function CompareSection({currentFiscalYear}) {

  const priorFiscalYear = (Number(currentFiscalYear) - 1).toString();
  const priorPriorYear = (Number(currentFiscalYear) - 2).toString();
  const priorRevenueRequest = new ApiRequest(revenueRequest).forEndOfFiscalYear(priorFiscalYear);
  const priorRevenueCategoryRequest = new ApiRequest(revenueCategoryRequest)
    .forEndOfFiscalYear(priorFiscalYear);
  const priorSpendingRequest = new ApiRequest(spendingRequest).forEndOfFiscalYear(priorFiscalYear);
  const priorSpendingCategoryRequest = new ApiRequest(spendingCategoryRequest)
    .forEndOfFiscalYear(priorFiscalYear);
  const priorDeficitRequest = new ApiRequest(deficitRequest).forEndOfFiscalYear(priorFiscalYear);
  const priorDebtRequest = new ApiRequest(debtRequest).forEndOfFiscalYear(priorFiscalYear);
  const priorPriorDebtRequest = new ApiRequest(debtRequest).forEndOfFiscalYear(priorPriorYear);

  const [revenue, setRevenue] = useState('');
  const [revenueCategory, setRevenueCategory] = useState('');
  const [spending, setSpending] = useState('');
  const [spendingCategory, setSpendingCategory] = useState('');
  const [deficit, setDeficit] = useState('');
  const [deficitChange, setDeficitChange]  = useState('');
  const [deficitDirection, setDeficitDirection]  = useState('');
  const [debt, setDebt] = useState('');
  const [debtChange, setDebtChange]  = useState('');
  const [debtDirection, setDebtDirection]  = useState('');


  useEffect(() => {
    basicFetch(priorRevenueRequest.getUrl())
      .then((res) => {
        if (res.data) {
          const data = res.data[0];
          setRevenue(getShortForm(data.current_fytd_net_rcpt_amt.toString(), 2, false));
        }
      });
    basicFetch(priorRevenueCategoryRequest.getUrl())
      .then((res) => {
        if (res.data) {
          const data = res.data[0];
          setRevenueCategory(data.classification_desc);
        }
      });
    basicFetch(priorSpendingRequest.getUrl())
      .then((res) => {
        if (res.data) {
          const data = res.data[0];
          setSpending(getShortForm(data.current_fytd_net_outly_amt.toString(), 2, false));
        }
      });
    basicFetch(priorSpendingCategoryRequest.getUrl())
      .then((res) => {
        if (res.data) {
          const data = res.data[0];
          setSpendingCategory(data.classification_desc);
        }
      });
    basicFetch(priorDeficitRequest.getUrl())
      .then((res) => {
        if (res.data) {
          const data = res.data[0];
          const deficitAmount = Number(data.current_fytd_net_outly_amt);
          const priorDeficitAmount = Number(data.prior_fytd_net_outly_amt);
          const formattedAmount = Math.abs(deficitAmount) >= 1000000000000 ?
            getShortForm(Math.abs(deficitAmount).toString(), 2, false) :
            getShortForm(Math.abs(deficitAmount).toString(), 0, false);
          setDeficit(formattedAmount);
          const difference = deficitAmount - priorDeficitAmount;
          setDeficitDirection(difference < 0 ? 'increased' : 'decreased');
          const formattedChange = Math.abs(difference) >= 1000000000000 ?
            getShortForm(Math.abs(difference).toString(), 2, false) :
            getShortForm(Math.abs(difference).toString(), 0, false);
          setDeficitChange(formattedChange);
        }
      });
    basicFetch(priorDebtRequest.getUrl())
      .then((res) => {
        if (res.data) {
          const data = res.data[0];
          setDebt(getShortForm(data.tot_pub_debt_out_amt.toString(), 2, false));
          basicFetch(priorPriorDebtRequest.getUrl())
            .then((priorRes) => {
              if (priorRes.data) {
                const priorData = priorRes.data[0];

                const difference = Number(data.tot_pub_debt_out_amt) -
                  Number(priorData.tot_pub_debt_out_amt);

                setDebtDirection(difference > 0 ? 'increased' : 'decreased');
                setDebtChange(getShortForm(Math.abs(difference).toString(), 2, false));
              }
            })
        }
      });

  }, []);

  const subSections = [{
        heading:
          <>
            In {priorFiscalYear} the federal government {' '}
            <span style={{ color: revenueExplainerPrimary, fontStyle: 'italic' }}>collected</span>
            {' '} ${revenue}
          </>,
        body: <>
                The primary source of revenue for the U.S. government
                in {priorFiscalYear} was {revenueCategory}. Revenue collected by
                the U.S. government is used to fund a variety of goods, programs, and services to
                support the American public and pay interest incurred from borrowing.
              </>,
        faIcon: faCoins ,
        mainColor: revenueExplainerPrimary
    },
    {
        heading:
          <>
            In {priorFiscalYear}, the federal government {' '}
            <span style={{ color: spendingExplainerPrimary, fontStyle: 'italic' }}>spent</span>
            {' '} ${spending}
          </>,
        body:
          <>
            Federal government spending pays for everything from Social Security and Medicare to
            military equipment, highway maintenance, building construction, research, and
            education. In {priorFiscalYear}, the federal government spent the most
            on {spendingCategory}.
          </>,
        faIcon: faHandHoldingDollar ,
        mainColor: spendingExplainerPrimary
    },
    {
        heading:
          <>
            In {priorFiscalYear}, the federal government
            spent ${deficit} more than it collected, resulting in a {' '}
            <span style={{ color: deficitExplainerPrimary, fontStyle: 'italic' }}>deficit.</span>
          </>,
        body:
          <>
            To pay for government programs while operating under a deficit, the
            federal government borrows money by selling U.S. Treasury bonds, bills,
            and other securities. The national debt is the accumulation of this
            borrowing along with associated interest owed to investors who purchased
            these securities. In {priorFiscalYear}, the national
            deficit {deficitDirection} by ${deficitChange} compared
            to {priorPriorYear}.
          </>,
        faIcon: faChartArea ,
        mainColor: deficitExplainerPrimary
    },
    {
        heading:
          <>
            At the end of {priorFiscalYear} the government had ${debt}, in
            federal <span style={{ color: debtExplainerPrimary, fontStyle: 'italic' }}>debt.</span>
          </>,
        body:
          <>
            The national debt enables the federal government to pay for important
            programs and services for the American public. In {priorFiscalYear}, the
            national debt {debtDirection} by {debtChange} compared
            to {priorPriorYear}.
          </>,
        faIcon: faMagnifyingGlassDollar ,
        mainColor: debtExplainerPrimary
    }]

    return (
        <div className={styles.compareSection} data-testid="compare-section">
            <h3 className={styles.heading}>
              How did these totals compare to {priorFiscalYear} year-end?
            </h3>
            <Grid container spacing={4}>
                {subSections.map((s) => (
                    <Grid
                      container
                      item md={6}
                      spacing={0}
                      key={s.mainColor}
                      classes={{ root: styles.compareGridItem }}
                    >
                        <Grid item xs={2} classes={{ root: styles.compareIcon }}>
                            <AfgIcon faIcon={s.faIcon} iconColor={s.mainColor} />
                        </Grid>
                        <Grid item xs={10} classes={{ root: styles.compareText }}>
                            <h5 className={styles.subHeading}>{s.heading}</h5>
                            <div className={styles.body}>{s.body}</div>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
};

import React, { FunctionComponent } from "react";
import Accordion from "../../../components/accordion/accordion";
import { section } from "./data-sources-methodologies.module.scss";

type DsmProps = {
  children?: React.ReactNode;
  pageName?: string;
};

const analyticsEventMap: Record<
  string,
  { openEventNumber: string; closeEventNumber: string }
> = {
  "national-debt": {
    openEventNumber: "40",
    closeEventNumber: "41",
  },
};

const DataSourcesMethodologies: FunctionComponent<DsmProps> = ({
  children,
  pageName,
}: DsmProps) => {
  const analyticsProps = analyticsEventMap[pageName];
  return (
    <section className={`${section} dataSourceAccordion`}>
      <Accordion {...analyticsProps} title="Data Sources & Methodologies">
        {children}
      </Accordion>
    </section>
  );
};

export default DataSourcesMethodologies;

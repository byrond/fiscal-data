/* istanbul ignore file */
import React from 'react';
import {graphql, useStaticQuery} from 'gatsby';
import '../../../styles.scss';
import * as styles from '../../../pages/about-us/about-us.module.scss';
import {MDXRenderer} from "gatsby-plugin-mdx";
import FDGMdxProvider from "../../../components/mdx/FDGMdxProvider";
import { MDXProvider } from "@mdx-js/react";
import {aboutUsComponents} from "../helpers/helpers";
import MDX from '@mdx-js/runtime';


const AboutUs = ({mdxBody}) => {

  return (
    <>
      {mdxBody &&
      <section className={styles.section}>
        <MDX components={aboutUsComponents}>
          {mdxBody}
        </MDX>
      </section>
      }
    </>
  );

};

export default AboutUs;

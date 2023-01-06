import React from 'react'
import { Grid } from '@material-ui/core';
import { ChartPlaceholder } from
    '../../../explainer-helpers/national-deficit/national-deficit-helper';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightLong} from "@fortawesome/free-solid-svg-icons";
import * as styles from "./afg-topic-section.module.scss";

export default function AfgTopicSection({
    heading,
    body,
    linkUrl,
    linkText,
    linkColor,
    image,
    imageAltText
}) {

    return (
        <Grid classes={{ root: styles.topicSection }} container spacing={0} data-testid="topic-section" key={linkUrl}>
            <Grid item md classes={{ root: styles.textContainer }}>
                <h5 className={styles.topicHeading}>{heading}</h5>
                <p className={styles.body}>{body}</p>
                <a href={linkUrl} style={{ color: linkColor, marginTop: '2rem' }} className={styles.link}>{linkText}
                    <FontAwesomeIcon icon={faArrowRightLong} title={"right arrow"} className={styles.arrow}/>
                </a>
            </Grid>
            <Grid item md classes={{ root: styles.imageContainer }}>
                {image ? <img src={image} alt={imageAltText} /> : <ChartPlaceholder />}
            </Grid>
        </Grid>
    )
}

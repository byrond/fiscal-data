import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faRedditAlien,
} from "@fortawesome/free-brands-svg-icons"

import {
  socialShareContent,
  shareButtonContent,
  facebookIcon,
  twitterIcon,
  linkedInIcon,
  redditIcon,
  emailIcon,
  shareButton,
  shareButtonText,
  shareButtonContainer,
} from "./social-share.module.scss"
import { withWindowSize } from "react-fns"
import { pxToNumber } from "../../../helpers/styles-helper/styles-helper"
import { breakpointLg } from "../../../variables.module.scss"
import { Helmet } from "react-helmet"
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  RedditShareButton,
  EmailShareButton,
} from "react-share"
import globalConstants from "../../../helpers/constants"
import Analytics from "../../../utils/analytics/analytics"
import { useWindowSize } from "../../../hooks/windowResize"

const baseUrl = globalConstants.BASE_SITE_URL

const shareButtonContentMap = {
  facebook: {
    className: facebookIcon,
    text: "Facebook",
    icon: faFacebookF,
  },
  twitter: {
    className: twitterIcon,
    text: "Twitter",
    icon: faTwitter,
  },
  linkedin: {
    className: linkedInIcon,
    text: "LinkedIn",
    icon: faLinkedinIn,
  },
  reddit: {
    className: redditIcon,
    text: "Reddit",
    icon: faRedditAlien,
  },
  email: {
    className: emailIcon,
    text: "Email",
    icon: faEnvelope,
  },
}

const analyticsClickHandler = (page, social) => {
  Analytics.event({
    category: "Explainers",
    action: `Share Click`,
    label: `${page} - Share on ${social}`,
  })
}

export const ShareButtonContent = ({ name, width, orientation }) => {
  const [hovered, setHovered] = useState(false)

  const handleMouseEnter = () => {
    if (width >= pxToNumber(breakpointLg)) {
      setHovered(true)
    }
  }

  const handleMouseLeave = () => {
    setHovered(false)
  }

  const style = hovered ? { color: "#555555" } : {}
  const text =
    width >= pxToNumber(breakpointLg) ? shareButtonContentMap[name].text : ""
  return (
    <>
      <div
        className={shareButtonContent}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <FontAwesomeIcon
          className={shareButtonContentMap[name].className}
          icon={shareButtonContentMap[name].icon}
          style={style}
        />
        {!orientation && (
          <span className={shareButtonText} style={style}>
            {text}
          </span>
        )}
      </div>
    </>
  )
}

const SocialMetaData = ({ image, title, description, url }) => {
  return (
    <>
      <Helmet>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>
    </>
  )
}

export const SocialShareComponent = ({
  title,
  description,
  body,
  emailSubject,
  emailBody,
  url,
  image,
  pageName,
  width,
  orientation,
}) => {
  const [_, height] = useWindowSize()
  const breakpoint = {
    desktop: 1015,
    tablet: 600,
  }
  // TODO: test out functionality, and what do about both images? one of them is uploaded already
  const defaultOrientationStyles = {
    horizontal: {
      socialShareContent: {
        display: "flex",
        maxWidth: "360px",
        maxHeight: "48px",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: "39px",
        paddingRight: "39px",
      },
      shareButton: {
        display: "flex",
        textAlign: "justify",
        paddingTop: "1rem",
        paddingBottom: "1rem",
        justifyContent: "center",
        height: "1rem",
        marginTop: "0",
      },
      shareButtonContainer: {
        display: "flex",
        alignItems: "center",
        textAlign: "justify",
        justifyContent: "center",
        width: "16px",
        height: "16px",
        marginRight: "48px",
      },
    },
  }
  const [orientationStyles, setOrientationStyles] = useState(
    defaultOrientationStyles
  )
  useEffect(() => {
    // TODO: abstract this into a function
    const isMobile = window.innerWidth < breakpoint.desktop
    if (isMobile) {
      console.log(" IS mobile")
      if (orientation === "horizontal") {
        const updatedStyles = Object.assign(
          orientationStyles,
          { horizontal: { socialShareContent: { padding: "0", margin: "0" } } },
          {}
        )
        setOrientationStyles(updatedStyles)
      }
    } else {
      if (orientation === "horizontal") {
        const updatedStyles = Object.assign(
          orientationStyles,
          {
            horizontal: {
              socialShareContent: { paddingLeft: "39px", paddingRight: "39px" },
            },
          },
          {}
        )
        setOrientationStyles(updatedStyles)
      }
    }
  }, [width, height])

  const orientationStyle = orientationStyles[orientation] || {}
  console.log(orientationStyle, "orientationStyle")
  return (
    <>
      <SocialMetaData
        image={image}
        title={title}
        description={description}
        url={url}
      />
      <div
        className={socialShareContent}
        style={{
          ...orientationStyle.socialShareContent,
        }}
      >
        {!orientation && (
          <h3>{width >= pxToNumber(breakpointLg) ? "Share this page:" : ""}</h3>
        )}
        <div
          className={shareButtonContainer}
          style={{
            ...orientationStyle.shareButtonContainer,
          }}
        >
          <FacebookShareButton
            className={shareButton}
            style={{
              ...orientationStyle.shareButton,
            }}
            url={url}
            quote={body}
            beforeOnClick={() => analyticsClickHandler(pageName, "Facebook")}
          >
            <ShareButtonContent
              orientation={orientation}
              name={"facebook"}
              width={width}
            />
          </FacebookShareButton>
        </div>
        <div
          className={shareButtonContainer}
          style={{
            ...orientationStyle.shareButtonContainer,
          }}
        >
          <TwitterShareButton
            className={shareButton}
            style={{
              ...orientationStyle.shareButton,
            }}
            url={url}
            title={body}
            beforeOnClick={() => analyticsClickHandler(pageName, "Twitter")}
          >
            <ShareButtonContent
              orientation={orientation}
              name={"twitter"}
              width={width}
            />
          </TwitterShareButton>
        </div>
        <div
          className={shareButtonContainer}
          style={{
            ...orientationStyle.shareButtonContainer,
          }}
        >
          <LinkedinShareButton
            className={shareButton}
            style={{
              ...orientationStyle.shareButton,
            }}
            url={url}
            title={title}
            summary={body}
            source={baseUrl}
            beforeOnClick={() => analyticsClickHandler(pageName, "LinkedIn")}
          >
            <ShareButtonContent
              orientation={orientation}
              name={"linkedin"}
              width={width}
            />
          </LinkedinShareButton>
        </div>
        <div
          className={shareButtonContainer}
          style={{
            ...orientationStyle.shareButtonContainer,
          }}
        >
          <RedditShareButton
            className={shareButton}
            style={{
              ...orientationStyle.shareButton,
            }}
            url={url}
            title={title}
            beforeOnClick={() => analyticsClickHandler(pageName, "Reddit")}
          >
            <ShareButtonContent
              orientation={orientation}
              name={"reddit"}
              width={width}
            />
          </RedditShareButton>
        </div>
        <div
          className={shareButtonContainer}
          style={
            orientation === "horizontal"
              ? {
                  ...orientationStyle.shareButtonContainer,
                  marginRight: "unset",
                }
              : {}
          }
        >
          <EmailShareButton
            className={shareButton}
            style={{
              ...orientationStyle.shareButton,
            }}
            url={url}
            subject={emailSubject}
            body={emailBody}
            separator={"\n"}
            beforeOnClick={() => analyticsClickHandler(pageName, "Email")}
          >
            <ShareButtonContent
              orientation={orientation}
              name={"email"}
              width={width}
            />
          </EmailShareButton>
        </div>
      </div>
    </>
  )
}

export default withWindowSize(SocialShareComponent)

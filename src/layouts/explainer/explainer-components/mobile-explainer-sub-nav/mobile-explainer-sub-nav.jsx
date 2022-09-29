import React, {useState, useEffect, useRef} from 'react';
import * as styles from './../explainer-sub-nav/explainer-sub-nav.module.scss';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHouseChimney} from "@fortawesome/free-solid-svg-icons";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";
import {faCaretRight} from "@fortawesome/free-solid-svg-icons";
import {navigate} from 'gatsby'
import {
  MenuList,
  buttonOverview,
  spending,
  revenue,
  deficit,
  debt,
  carrot,
  faHouse,
  stylingStyledMenu,
  overviewStyle,
  mainContainer,
  mainContainerSticky,
  mainContainerHidden,
  mainContainerShow,
  activeMenu,
  mainListSticky
} from "./mobile-explainer-sub-nav.module.scss";

const StyledMenu = withStyles({
  paper: {
    width: "288px",
    backgroundColor: "transparent",
  },
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    "&:focus": {
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {},
    },
  },
}))(MenuItem);

export default function MobileExplainerSubNav({ hidePosition }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [previousScrollPosition, setPreviousScrollPosition] = useState(0);
  const [navBlockStyle, setNavBlockStyle] = useState(mainContainerShow);
  const [navBlockList, setNavBlockList] = useState(mainContainerShow);
  const [isRevenue, setIsRevenue] = useState(false);
  const [isSpending, setIsSpending] = useState(false);
  const [isDeficit, setIsDeficit] = useState(false);
  const [isDebt, setIsDebt] = useState(false);
  const [isOverview, setIsOverview] = useState(false);
  const [defaultOpen, setDefaultOpen] = useState(false);

  const handleScroll = () => {
    let position = window.pageYOffset;
    setPreviousScrollPosition(scrollPosition);
    setScrollPosition(position);

    if (position > hidePosition) {

      if (previousScrollPosition < scrollPosition) {
        setNavBlockStyle(mainContainerHidden);
        setNavBlockList(mainContainerHidden);
        handleClose();
      } else {
        setNavBlockStyle(mainContainerSticky);
        setNavBlockList(mainListSticky);
        handleClose();
      }
    } else {
      setNavBlockStyle(mainContainerShow);
      setNavBlockList(mainContainerHidden);
      handleClose();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setDefaultOpen(false);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setDefaultOpen(false);
    setAnchorEl(null);
  };

  useEffect(() => {
    const isBrowser = () => typeof window !== "undefined";
    let thisHref = "";
    if (isBrowser()) {
      thisHref = window.location.href;
      if (thisHref.includes("government-revenue")) {
        setIsRevenue(true);
      } else if (thisHref.includes("federal-spending")) {
        setIsSpending(true);
      } else if (thisHref.includes("national-deficit")) {
        setIsDeficit(true);
      } else if (thisHref.includes("national-debt")) {
        setIsDebt(true);
      } else {
        setIsOverview(true);
      }
    }
  }, []);

  return (
    <div className={mainContainer} data-testid="mobileSubNav">
      <div className={navBlockStyle}>
        <button
          aria-controls="customized-menu"
          aria-haspopup="true"
          variant="contained"
          color="#0a2f5a"
          onClick={handleClick}
          onKeyPress={handleClick}
          className={`${isOverview ? [buttonOverview, activeMenu].join(" ") : buttonOverview}`}
        >
          <span onClick={() => navigate('/americas-finance-guide/')} className={overviewStyle} id="home">
            <FontAwesomeIcon className={faHouse} icon={faHouseChimney} />
            Overview
          </span>
          <FontAwesomeIcon className={carrot} icon={anchorEl ? faCaretDown: faCaretRight} />
        </button>
        <StyledMenu
          anchorEl={anchorEl}
          keepMounted
          disableScrollLock={true}
          open={defaultOpen || Boolean(anchorEl)}
          onClose={handleClose}
          className={[mainListSticky, stylingStyledMenu].join(" ")}
          id="styled-menu"
        >
          <StyledMenuItem className={MenuList}>
            <ListItemText
              className={`${isRevenue ? [revenue, activeMenu].join(" ") : revenue}`}
              onClick={() =>
                navigate("/americas-finance-guide/government-revenue/")
              }
              primary=" Revenue"
            />
          </StyledMenuItem>
          <StyledMenuItem className={MenuList}>
            <ListItemText
              className={`${isSpending ? [spending, activeMenu].join(" ") : spending}`}
              onClick={() =>
                navigate("/americas-finance-guide/federal-spending/")
              }
              primary="Spending"
            />
          </StyledMenuItem>
          <StyledMenuItem className={MenuList}>
            <ListItemText
              className={`${isDeficit ? [deficit, activeMenu].join(" ") : deficit}`}
              onClick={() =>
                navigate("/americas-finance-guide/national-deficit/")
              }
              primary="Deficit"
            />
          </StyledMenuItem>
          <StyledMenuItem className={MenuList}>
            <ListItemText
              className={`${isDebt ? [debt, activeMenu].join(" ") : debt}`}
              onClick={() => navigate("/americas-finance-guide/national-debt/")}
              primary="Debt"
            />
          </StyledMenuItem>
        </StyledMenu>
      </div>
    </div>
  );
}

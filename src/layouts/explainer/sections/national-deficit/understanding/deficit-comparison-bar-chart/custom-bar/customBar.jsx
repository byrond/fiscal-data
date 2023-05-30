import React, {useEffect, useState} from "react";
import {animated, useSpring} from "@react-spring/web";
import {
  boldWeight,
  semiBoldWeight,
  fontBodyCopy,
  fontSize_12,
  fontSize_16,
} from "../../../national-deficit.module.scss";
import {getShortForm} from "../../../../../../../utils/rounding-utils";

const CustomBar = ({bar: { x, y, width, height, color,  key, data}}) => {
  const [pauseAnimation, setPauseAnimation ] = useState(true);
  const [opacity, setOpacity] = useState(0);

  // 80 is bar width for desktop
  const desktop = width >= 80;

  const config = {
    mass: 10,
    friction: 10,
    tension: 120,
    clamp: true,
  }

  const props = {
    from: {
      y: height ,
      height: 0,
    },
    to: {
      y: 0,
      height: height
    },
    pause: pauseAnimation
  }

  const springs_Revenue = useSpring({
    ...props,
    config: {
      ...config,
      duration: data.data["revenue_animation_duration"]
    },
    delay: 250

  })

  const springs_Deficit = useSpring({
    ...props,
    config: {
      ...config,
      duration: data.data["deficit_animation_duration"]
    },
    delay: (data.data["revenue_animation_duration"] + 1000)
  })

  const springs_Spending = useSpring({
    ...props,
    config: {
      ...config,
      duration: data.data["spending_animation_duration"]
    },
    delay: (data.data["revenue_deficit_animation_duration"] + 2000)
  })

  const springs = key.includes("revenue") ? springs_Revenue : 
    (key.includes("deficit") ? springs_Deficit : springs_Spending);


  const xPosDesktop = data.index ? x + width + 62 : x - 65;
  const yPosDesktop = y + (height / 2) - 5;

  const xPosMobile = data.index ? x + width + 40 : x - 42;
  const yPosMobile = y + (height / 2) - 3;

  const getTextDelay = () => {
    let delay;
    if(key.includes("revenue")) {
      delay = 0;
    } else if(key.includes("deficit")) {
      delay = data.data["revenue_animation_duration"] + 250;
    }
    else {
      delay = data.data["revenue_deficit_animation_duration"] + 1000;
    }
    return delay;
  }



  const textStyle = {
    fontSize: desktop ? fontSize_16 : fontSize_12,
    fill: fontBodyCopy,
    textAnchor: "middle",
    opacity: opacity,
    transition: "opacity .25s ease-in",
  };

  useEffect(() => {
    let observer;
    if(typeof window !== "undefined") {
      const config = {
        rootMargin: '-50% 0% -50% 0%',
        threshold: 0
      }
      observer = new IntersectionObserver(entries => {
        entries.forEach((entry) => {
          if(entry.isIntersecting) {
            setPauseAnimation(false);
            setTimeout(() => {
              setOpacity(1);
            }, [getTextDelay()])
          }
        })
      }, config)
      setTimeout(() =>
        observer.observe(document.querySelector('[data-testid="deficitComparisonChart"]')), 1000)
    }

  }, [])

  // things to check
  // - desktop vs mobile styling
  // - browser stack
  // - write tests

  // check font weights on top and bottom and mobile vs desktop does it need to change 

    return(
        <>
          <text
            x={desktop ? xPosDesktop : xPosMobile }
            y={desktop ? yPosDesktop : yPosMobile }
            style={{...textStyle, fontWeight: semiBoldWeight}}
          >
            {`$${getShortForm(data.value)}`}
          </text>

          <text
            x={desktop ? xPosDesktop : xPosMobile }
            y={desktop ? yPosDesktop + 25 : yPosMobile }
            style={{...textStyle, fontWeight: boldWeight}}
          >
            {data.key}
            Test
          </text>
          
          <animated.rect
            width={width}
            height={height}
            x={x}
            y={y}
            fill={color}
            style={{...springs}}
          />
        </>
      )
};

export default CustomBar;

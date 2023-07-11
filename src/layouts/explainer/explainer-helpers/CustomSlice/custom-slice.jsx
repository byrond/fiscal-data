import React, { useEffect, useState } from 'react';


 const CustomSlices = (
  {
    slices,
    data,
    setCurrentSlice,
    groupMouseLeave,
    mouseMove,
    inView,
    duration,
  }) => {

  const [style, setStyle] = useState({});
  const [animationTriggeredOnce, setAnimationTriggeredOnce] = useState(false);

  useEffect(() => {
    if (!animationTriggeredOnce && inView && data.length) {
      setAnimationTriggeredOnce(true);
      const stepDuration = duration ? duration : 50;

      slices.forEach((slice, index) => {
        setTimeout(() => {
          setCurrentSlice(slice);
          mouseMove(slice);
        }, (stepDuration * index) + 550);
      });

      setTimeout(() => {
        setCurrentSlice(slices[slices.length - 1]);
        mouseMove(slices[slices.length - 1]);
        if (groupMouseLeave) {
          console.log('hello')
          setCurrentSlice(null)
        }
      }, (stepDuration * (slices.length + 1)) + 550);
    }
  }, [inView, animationTriggeredOnce, slices]);

  return (
    <g data-testid="customSlices"
       onMouseLeave={ () => {
         if (groupMouseLeave) {
           groupMouseLeave()
         }
       }}
    >
      {slices.map((slice, index) => (
        <rect
          key={index}
          x={slice.x0}
          y={slice.y0}
          tabIndex={0}
          width={slice.width}
          height={slice.height}
          strokeWidth={0}
          strokeOpacity={0.25}
          fillOpacity={0}
          style={style}
          onMouseEnter={() => setCurrentSlice(slice)}
          onFocus={() => {
            setStyle({})
            if(mouseMove) {
              mouseMove(slice)
            }
            setCurrentSlice(slice)
          }}
          onMouseMove={() =>{
            setStyle({outline: "none"})
            if(mouseMove) {
              mouseMove(slice)
            }
            setCurrentSlice(slice)}
          }
          onMouseLeave={() => {
            setCurrentSlice(null)
          }}
        />
      ))}
    </g>
  );
};

export default CustomSlices;

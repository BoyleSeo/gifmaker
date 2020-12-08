import React, { useState, useEffect } from 'react';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

function VideoViewer(props) {
  const [range, setRange] = useState({ rangeStart: 0, rangeEnd: 100 });
  let video = props.video;

  return (
    <div>
      <video id="videoPlayer" controls src={video} />
      <Range
        className="w-3/4 m-auto"
        step={0.1}
        min={0}
        max={100}
        defaultValue={[0, 100]}
        allowCross={false}
        onChange={(e) => {
          setRange({ rangeStart: e[0], rangeEnd: e[1] });
        }}
      />
    </div>
  );
}
export default VideoViewer;

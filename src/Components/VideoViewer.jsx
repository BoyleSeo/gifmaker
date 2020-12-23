import React, { useState, useEffect, useRef } from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function VideoViewer(props) {
  const [range, setRange] = useState({ start: 0, end: 100 });
  const [info, setInfo] = useState({
    duration: null,
    width: null,
    height: null,
  });
  const [placeholder, setPlaceholder] = useState();
  const [crop, setCrop] = useState({
    unit: '%',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  let video = props.video;

  const videoView = useRef();
  const sliderBar = useRef();

  const updateTimeLine = (e) => {
    setRange({ start: e[0], end: e[1] });
    //편집점 설정 시 영상currentTime 업데이트
    videoView.current.currentTime = (info.duration * e[0]) / 100;
  };

  //ReactCrop 의 소스로 쓰일 place holder 이미지 생성
  const createPlaceholder = (e) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = (1000 * e.target.videoHeight) / e.target.videoWidth;

    // const ctx = canvas.getContext('2d');
    // ctx.fillStyle = '#FF0000';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    console.log(canvas);
    const img = canvas.toDataURL();
    console.log('createPlaceholder()');
    setPlaceholder(img);
  };
  const playVideo = () => {
    if (!videoView.current.paused) {
      videoView.current.pause();
    } else {
      videoView.current.play();
    }
  };
  return (
    <div>
      <video
        className="absolute w-3/4"
        ref={videoView}
        src={video}
        // 영상 메타데이터 기록
        onLoadedMetadata={(e) => {
          // let name = e.target.src;
          setInfo({
            duration: e.target.duration,
            // format: name.substring(name.lastIndexOf('.') + 1, name.length),
            width: e.target.videoWidth,
            height: e.target.videoHeight,
          });
          //편집타임라인 초기화
          sliderBar.current.setState({ bounds: [0, 100] });
          createPlaceholder(e);
        }}
      />
      <ReactCrop
        src={placeholder}
        ruleOfThirds
        crop={crop}
        onChange={(Crop, newCrop) => setCrop(newCrop)}
      ></ReactCrop>
      <div>
        <button className="bg-green-400 m-5" onClick={playVideo}>
          Play / pause
        </button>
        <Range
          ref={sliderBar}
          className="w-3/4 m-auto"
          step={0.1}
          defaultValue={[0, 100]}
          allowCross={false}
          onChange={updateTimeLine}
        />
        <div
          className="bg-green-400 m-20"
          onClick={() => {
            const ss = info.duration * (range.start / 100);
            const t = info.duration * (range.end / 100) - ss;
            const c = {
              x: (info.width * crop.x) / 100,
              y: (info.height * crop.y) / 100,
              w: (info.width * crop.width) / 100,
              h: (info.height * crop.height) / 100,
            };
            props.convertToGif(t, ss, c);
          }}
        >
          🔻변환🔻
        </div>
      </div>
    </div>
  );
}
export default VideoViewer;

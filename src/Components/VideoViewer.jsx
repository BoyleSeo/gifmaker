import React, { useState, useRef } from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import B_Play from '../img/B_Play.png';
import B_Pause from '../img/B_Pause.png';
import B_Convert from '../img/B_Convert.png';
import P_Current from '../img/P_Current.png';
import P_End from '../img/P_End.png';
import P_Start from '../img/P_Start.png';

function VideoViewer(props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [pButton, setPButton] = useState(B_Play);
  const [range, setRange] = useState([0, 0, 100]); //0:start, 1:current, 2:end
  const [info, setInfo] = useState({
    duration: null,
    width: null,
    height: null,
  });
  const [croperFrame, setCroperFrame] = useState();
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

  const onVideoLoaded = (e) => {
    // let name = e.target.src;
    setInfo({
      duration: e.target.duration,
      // format: name.substring(name.lastIndexOf('.') + 1, name.length), //확장명정보 추가 보류
      width: e.target.videoWidth,
      height: e.target.videoHeight,
    });
    //편집타임라인 초기화
    sliderBar.current.setState({ bounds: [0, 0, 100] });
    createCroperFrame(e);
  };

  //ReactCrop 의 소스로 쓰일 CroperFrame 이미지 생성
  const createCroperFrame = (e) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = (1000 * e.target.videoHeight) / e.target.videoWidth;
    // const ctx = canvas.getContext('2d');
    // ctx.fillStyle = '#FF0000';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    const img = canvas.toDataURL();
    setCroperFrame(img);
  };

  const updateTimelineByVideo = (e) => {
    // !!! 재생시점 포인터(range[1])와 끝점(ranga[2])이 완전히 겹칠때도 약간의 재생시간이 남아있는 점 해결필요 !!!
    if (isPlaying) {
      const boundsCopy = range;
      const endTime = (boundsCopy[2] / 100) * e.target.duration;
      boundsCopy[1] = (e.target.currentTime / e.target.duration) * 100;
      sliderBar.current.setState({ bounds: boundsCopy });
      if (e.target.currentTime >= endTime) {
        videoView.current.pause();
        setIsPlaying(false);
        setPButton(B_Play);
        const startTime = (boundsCopy[0] / 100) * e.target.duration;
        videoView.current.currentTime = startTime;
      }
    }
  };

  const updateTimelineByslider = (e) => {
    //편집점 설정 시 영상currentTime 업데이트
    //영상이 일시정지할 때에만 range 업데이트 하도록
    if (!isPlaying) {
      if (range[0] !== e[0]) {
        videoView.current.currentTime = (info.duration * e[0]) / 100;
      } else if (range[1] !== e[1])
        videoView.current.currentTime = (info.duration * e[1]) / 100;
      setRange(e);
    }
  };

  const playOrPauseVideo = () => {
    if (!videoView.current.paused) {
      videoView.current.pause();
      setIsPlaying(false);
      setPButton(B_Play);
    } else {
      videoView.current.play();
      setIsPlaying(true);
      setPButton(B_Pause);
    }
  };

  const passConversionInfo = () => {
    const ss = info.duration * (range[0] / 100);
    const t = info.duration * (range[2] / 100) - ss;
    const c = {
      x: (info.width * crop.x) / 100,
      y: (info.height * crop.y) / 100,
      w: (info.width * crop.width) / 100,
      h: (info.height * crop.height) / 100,
    };
    props.convertToGif(t, ss, c); //변환 시작
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="my-10">
        <ReactCrop
          className="absolute max-w-lg z-10"
          src={croperFrame}
          ruleOfThirds={true}
          crop={crop}
          onChange={(crop, newCrop) => setCrop(newCrop)}
        />
        <video
          className="z-0"
          ref={videoView}
          src={video}
          // 영상 메타데이터 기록
          onLoadedMetadata={onVideoLoaded}
          onTimeUpdate={updateTimelineByVideo}
        />
      </div>

      <div className="flex max-w-lg">
        <button className=" mx-0.5 w-20" onClick={playOrPauseVideo}>
          <img src={pButton} />
        </button>
        <Range
          className="mx-2 mt-0"
          ref={sliderBar}
          step={0.01}
          count={2}
          defaultValue={[0, 0, 100]}
          railStyle={{
            backgroundColor: 'rgba(32, 31, 30, 1)',
            borderRadius: '0px',
            border: 'solid',
            borderColor: 'rgba(237, 235, 233, 1)',
            height: '40px',
          }}
          trackStyle={[
            {
              backgroundColor: 'rgba(237, 235, 233, 1)',
              border: 'solid',
              borderRadius: '0px',
              borderTopColor: 'rgba(32, 31, 30, 1)',
              borderBottomColor: 'rgba(32, 31, 30, 1)',
              borderLeftColor: 'magenta',
              borderRightColor: 'yellow',
              height: '40px',
            },
            {
              backgroundColor: 'rgba(237, 235, 233, 1)',
              border: 'solid',
              borderRadius: '0px',
              borderTopColor: 'rgba(32, 31, 30, 1)',
              borderBottomColor: 'rgba(32, 31, 30, 1)',
              borderLeftColor: 'yellow',
              borderRightColor: 'cyan',
              height: '40px',
            },
          ]}
          handleStyle={[
            {
              backgroundColor: 'magenta',
              borderColor: 'rgba(237, 235, 233, 0.5)',
              zIndex: '1',
            },
            {
              backgroundColor: 'yellow',
              borderColor: 'rgba(237, 235, 233, 0.5)',
              zIndex: '0',
              top: '40px',
              // backgroundImage: `url(${P_Current})` ,
            },
            {
              backgroundColor: 'cyan',
              borderColor: 'rgba(237, 235, 233, 0.5)',
              zIndex: '2',
            },
          ]}
          pushable={false}
          allowCross={false}
          onBeforeChange={() => {
            videoView.current.pause();
            setIsPlaying(false);
            setPButton(B_Play);
          }}
          onChange={updateTimelineByslider}
        />
        <div className="mx-0.5 w-20" onClick={passConversionInfo}>
          <img src={B_Convert} />
        </div>
      </div>
    </div>
  );
}
export default VideoViewer;

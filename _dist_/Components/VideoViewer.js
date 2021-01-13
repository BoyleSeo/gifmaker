import React, {useState, useRef} from "../../web_modules/react.js";
import {Range} from "../../web_modules/rc-slider.js";
import "../../web_modules/rc-slider/assets/index.css.proxy.js";
import ReactCrop from "../../web_modules/react-image-crop.js";
import "../../web_modules/react-image-crop/dist/ReactCrop.css.proxy.js";
import B_Play2 from "../img/B_Play.png.proxy.js";
import B_Pause2 from "../img/B_Pause.png.proxy.js";
import B_Convert2 from "../img/B_Convert.png.proxy.js";
import P_Current2 from "../img/P_Current.png.proxy.js";
import P_End2 from "../img/P_End.png.proxy.js";
import P_Start2 from "../img/P_Start.png.proxy.js";
function VideoViewer(props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [pButton, setPButton] = useState(B_Play2);
  const [range, setRange] = useState([0, 0, 100]);
  const [info, setInfo] = useState({
    duration: null,
    width: null,
    height: null
  });
  const [croperFrame, setCroperFrame] = useState();
  const [crop, setCrop] = useState({
    unit: "%",
    x: 0,
    y: 0,
    width: 100,
    height: 100
  });
  let video = props.video;
  const videoView = useRef();
  const sliderBar = useRef();
  const onVideoLoaded = (e) => {
    setInfo({
      duration: e.target.duration,
      width: e.target.videoWidth,
      height: e.target.videoHeight
    });
    sliderBar.current.setState({bounds: [0, 0, 100]});
    createCroperFrame(e);
  };
  const createCroperFrame = (e) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1e3;
    canvas.height = 1e3 * e.target.videoHeight / e.target.videoWidth;
    const img = canvas.toDataURL();
    setCroperFrame(img);
  };
  const updateTimelineByVideo = (e) => {
    if (isPlaying) {
      const boundsCopy = range;
      const endTime = boundsCopy[2] / 100 * e.target.duration;
      boundsCopy[1] = e.target.currentTime / e.target.duration * 100;
      sliderBar.current.setState({bounds: boundsCopy});
      if (e.target.currentTime >= endTime) {
        videoView.current.pause();
        setIsPlaying(false);
        setPButton(B_Play2);
        const startTime = boundsCopy[0] / 100 * e.target.duration;
        videoView.current.currentTime = startTime;
      }
    }
  };
  const updateTimelineByslider = (e) => {
    if (!isPlaying) {
      if (range[0] !== e[0]) {
        videoView.current.currentTime = info.duration * e[0] / 100;
      } else if (range[1] !== e[1])
        videoView.current.currentTime = info.duration * e[1] / 100;
      setRange(e);
    }
  };
  const playOrPauseVideo = () => {
    if (!videoView.current.paused) {
      videoView.current.pause();
      setIsPlaying(false);
      setPButton(B_Play2);
    } else {
      videoView.current.play();
      setIsPlaying(true);
      setPButton(B_Pause2);
    }
  };
  const passConversionInfo = () => {
    const ss = info.duration * (range[0] / 100);
    const t = info.duration * (range[2] / 100) - ss;
    const c = {
      x: info.width * crop.x / 100,
      y: info.height * crop.y / 100,
      w: info.width * crop.width / 100,
      h: info.height * crop.height / 100
    };
    props.convertToGif(t, ss, c);
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: "max-w-lg mx-auto"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "my-10"
  }, /* @__PURE__ */ React.createElement(ReactCrop, {
    className: "absolute max-w-lg z-10",
    src: croperFrame,
    ruleOfThirds: true,
    crop,
    onChange: (crop2, newCrop) => setCrop(newCrop)
  }), /* @__PURE__ */ React.createElement("video", {
    className: "z-0",
    ref: videoView,
    src: video,
    onLoadedMetadata: onVideoLoaded,
    onTimeUpdate: updateTimelineByVideo
  })), /* @__PURE__ */ React.createElement("div", {
    className: "flex max-w-lg"
  }, /* @__PURE__ */ React.createElement("button", {
    className: " mx-0.5 w-20",
    onClick: playOrPauseVideo
  }, /* @__PURE__ */ React.createElement("img", {
    src: pButton
  })), /* @__PURE__ */ React.createElement(Range, {
    className: "mx-2 mt-0",
    ref: sliderBar,
    step: 0.01,
    count: 2,
    defaultValue: [0, 0, 100],
    railStyle: {
      backgroundColor: "rgba(32, 31, 30, 1)",
      borderRadius: "0px",
      border: "solid",
      borderColor: "rgba(237, 235, 233, 1)",
      height: "40px"
    },
    trackStyle: [
      {
        backgroundColor: "rgba(237, 235, 233, 1)",
        border: "solid",
        borderRadius: "0px",
        borderTopColor: "rgba(32, 31, 30, 1)",
        borderBottomColor: "rgba(32, 31, 30, 1)",
        borderLeftColor: "magenta",
        borderRightColor: "yellow",
        height: "40px"
      },
      {
        backgroundColor: "rgba(237, 235, 233, 1)",
        border: "solid",
        borderRadius: "0px",
        borderTopColor: "rgba(32, 31, 30, 1)",
        borderBottomColor: "rgba(32, 31, 30, 1)",
        borderLeftColor: "yellow",
        borderRightColor: "cyan",
        height: "40px"
      }
    ],
    handleStyle: [
      {
        backgroundColor: "magenta",
        borderColor: "rgba(237, 235, 233, 0.5)",
        zIndex: "1"
      },
      {
        backgroundColor: "yellow",
        borderColor: "rgba(237, 235, 233, 0.5)",
        zIndex: "0",
        top: "40px"
      },
      {
        backgroundColor: "cyan",
        borderColor: "rgba(237, 235, 233, 0.5)",
        zIndex: "2"
      }
    ],
    pushable: false,
    allowCross: false,
    onBeforeChange: () => {
      videoView.current.pause();
      setIsPlaying(false);
      setPButton(B_Play2);
    },
    onChange: updateTimelineByslider
  }), /* @__PURE__ */ React.createElement("div", {
    className: "mx-0.5 w-20",
    onClick: passConversionInfo
  }, /* @__PURE__ */ React.createElement("img", {
    src: B_Convert2
  }))));
}
export default VideoViewer;

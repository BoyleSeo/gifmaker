import React, {useState, useEffect} from "../../web_modules/react.js";
import {createFFmpeg, fetchFile} from "../../web_modules/@ffmpeg/ffmpeg.js";
import VideoViewer2 from "./VideoViewer.js";
import B_Upload2 from "../img/B_Upload.png.proxy.js";
import B_Download2 from "../img/B_Download.png.proxy.js";
const ffmpeg2 = createFFmpeg({log: true});
function VideoEditor() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();
  const [isProcessing, setIsProcessing] = useState(false);
  const load = async () => {
    await ffmpeg2.load();
    setReady(true);
  };
  useEffect(() => {
    load();
  }, []);
  const convertToGif = async (t, ss, crop) => {
    setIsProcessing(true);
    setGif(null);
    ffmpeg2.FS("writeFile", "in.mp4", await fetchFile(video));
    await ffmpeg2.run("-i", "in.mp4", "-t", `${t}`, "-ss", `${ss}`, "-vf", `crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}`, "-f", "gif", "out.gif");
    setIsProcessing(false);
    const data = ffmpeg2.FS("readFile", "out.gif");
    const url = URL.createObjectURL(new Blob([data.buffer]), {
      type: "image/gif"
    });
    setGif(url);
  };
  return ready ? /* @__PURE__ */ React.createElement("div", {
    className: "bg-black-custom h-full min-h-screen w-screen"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "m-auto w-14 h-10 mt-5"
  }, /* @__PURE__ */ React.createElement("label", {
    htmlFor: "videoUp"
  }, /* @__PURE__ */ React.createElement("img", {
    className: "w-14",
    src: B_Upload2
  })), /* @__PURE__ */ React.createElement("input", {
    className: "w-0 h-0",
    type: "file",
    accept: "video/*",
    id: "videoUp",
    onChange: (e) => {
      setVideo(URL.createObjectURL(e.target.files?.item(0)));
    }
  })), video && /* @__PURE__ */ React.createElement(VideoViewer2, {
    video,
    convertToGif
  }), isProcessing ? /* @__PURE__ */ React.createElement("div", {
    className: "loader"
  }) : /* @__PURE__ */ React.createElement("div", null), gif && /* @__PURE__ */ React.createElement("div", {
    className: "max-w-sm mt-10 mx-auto relative"
  }, /* @__PURE__ */ React.createElement("a", {
    href: gif,
    className: "",
    download: "out.gif"
  }, /* @__PURE__ */ React.createElement("img", {
    className: "w-14 absolute top-0 right-0",
    src: B_Download2
  })), /* @__PURE__ */ React.createElement("img", {
    style: {maxHeight: "50vh"},
    src: gif
  }))) : /* @__PURE__ */ React.createElement("p", {
    className: "loader top-1/4"
  });
}
export default VideoEditor;

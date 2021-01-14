import React from "../web_modules/react.js";
import VideoEditor2 from "./Components/VideoEditor.js";
function App() {
  return /* @__PURE__ */ React.createElement("div", {
    className: "bg-black-custom h-full min-h-screen"
  }, /* @__PURE__ */ React.createElement("nav", {
    className: "bg-white-custom px-8 w-screen pt-2 shadow-md"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "-mb-px flex justify-center"
  }, /* @__PURE__ */ React.createElement("a", {
    className: "no-underline text-black-custom border-b-2 border-transparent uppercase tracking-wide font-bold text-xs py-3 mr-8",
    href: "#"
  }, "Home"), /* @__PURE__ */ React.createElement("a", {
    className: "no-underline text-black-custom border-b-2 border-yellow-400 uppercase tracking-wide font-bold text-xs py-3 mr-8",
    href: "#"
  }, "Gif-Maker"), /* @__PURE__ */ React.createElement("a", {
    className: "no-underline text-black-custom border-b-2 border-transparent uppercase tracking-wide font-bold text-xs py-3 mr-8",
    href: "#"
  }, "Vid-Downloader"))), /* @__PURE__ */ React.createElement(VideoEditor2, null), /* @__PURE__ */ React.createElement("footer", {
    className: "bg-white-custom text-center uppercase font-bold text-xs py-3 absolute origin-bottom w-full"
  }, "\xA9 Copyright 2020"));
}
export default App;

import React from 'react';
import VideoEditor from './Components/VideoEditor.js';

function App() {
  return (
    <div className="bg-black-custom h-full min-h-screen">
      <nav className="bg-white-custom px-8 pt-2 shadow-md">
        <div className="-mb-px flex justify-center">
          <a
            className="no-underline text-black-custom border-b-2 border-transparent uppercase tracking-wide font-bold text-xs py-3 mr-8"
            href="#"
          >
            Home
          </a>
          <a
            className="no-underline text-black-custom border-b-2 border-yellow-400 uppercase tracking-wide font-bold text-xs py-3 mr-8"
            href="#"
          >
            Gif-Maker
          </a>
          <a
            className="no-underline text-black-custom border-b-2 border-transparent uppercase tracking-wide font-bold text-xs py-3 mr-8"
            href="#"
          >
            Vid-Downloader
          </a>
        </div>
      </nav>
      <VideoEditor />
      <footer className="bg-white-custom text-center uppercase font-bold text-xs py-3 absolute origin-bottom w-full">
        © Copyright 2020
      </footer>
    </div>
  );
}
export default App;

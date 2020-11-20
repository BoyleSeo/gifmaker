import React, { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();

  //비동기처리
  const load = async () => {
    await ffmpeg.load(); //ffmpeg load promise를 받으면 ready를 true로
    setReady(true);
  };
  useEffect(() => {
    load();
  }, []); // '[]' ONLY RUN ONCE

  return ready ? (
    <div className="App">
      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
    </div>
  ) : (
    <p> L O A D I N G . . . </p>
  );
}

export default App;
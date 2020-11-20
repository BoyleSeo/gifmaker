import React, { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();
  //비동기처리
  const load = async () => {
    await ffmpeg.load(); //ffmpeg load promise를 받으면 ready를 true로
    setReady(true);
  };
  useEffect(() => {
    load();
  }, []); // '[]' ONLY RUN ONCE

  const convertToGif = async () => {
    //웹어셈블리의 메모리에 video를 지정한 이름으로 쓰기
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    //커맨드라인 실행시키듯 (-ss 플래그 : starting second)
    await ffmpeg.run(
      '-i',
      'test.mp4',
      '-t',
      '2.5',
      '-ss',
      '2.0',
      '-f',
      'gif',
      'out.gif',
    );

    // 메모리에서 결과물 읽어들임
    const data = ffmpeg.FS('readFile', 'out.gif');

    // 브라우져에서 사용할 수 있도록 URL 생성
    const url = URL.createObjectURL(new Blob([data.buffer]), {
      type: 'image/gif',
    });
    setGif(url);
  };

  return ready ? (
    <div className="App">
      {video && (
        <video controls width="250" src={URL.createObjectURL(video)}></video>
      )}
      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
      <h3> 결과물 </h3>
      <button onClick={convertToGif}>변환</button>
      {gif && <img src={gif} width="250" />}
    </div>
  ) : (
    <p> L O A D I N G . . . </p>
  );
}

export default App;

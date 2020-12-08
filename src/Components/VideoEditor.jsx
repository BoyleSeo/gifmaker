import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import Slider, { Range } from 'rc-slider';
import VideoViewer from './VideoViewer';
import 'rc-slider/assets/index.css';
import vid from '../MediaForTest/in.mp4';

const ffmpeg = createFFmpeg({ log: true });

function VideoEditor() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState(vid);
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
      '1',
      '-ss',
      '0.0',
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

  //////////////////////////////////

  return ready ? (
    <div className="bg-yellow-600 w-1/2 h-screen m-auto">
      {video && <VideoViewer video={video} />}

      <label className="bg-green-400 m-10" htmlFor="videoUp">
        영상 올리기
      </label>
      <input
        className="w-0 h-0"
        type="file"
        accept="video/*"
        id="videoUp"
        onChange={(e) => setVideo(URL.createObjectURL(e.target.files?.item(0)))}
      />

      <div className="bg-green-400 m-10" onClick={convertToGif}>
        🔻변환🔻
      </div>

      {gif && (
        <div className="m-auto">
          <img src={gif} />
          <a className="bg-green-400 m-10" href={gif} download="out.gif">
            내려받기
          </a>
        </div>
      )}
    </div>
  ) : (
    <p> L O A D I N G . . . </p>
  );
}
export default VideoEditor;

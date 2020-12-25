import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import VideoViewer from './VideoViewer';
import vid from '../MediaForTest/in.mp4';
import giph from '../MediaForTest/giph.gif';

const ffmpeg = createFFmpeg({ log: true });

function VideoEditor() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState(vid);
  const [gif, setGif] = useState(giph);

  const load = async () => {
    //ffmpeg load promise를 받으면 ready를 true로
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const convertToGif = async (t, ss, crop) => {
    //웹어셈블리의 메모리에 video를 지정한 이름으로 쓰기
    ffmpeg.FS('writeFile', 'in.mp4', await fetchFile(video));

    //커맨드라인 실행시키듯 (-ss 플래그 : starting second)
    await ffmpeg.run(
      '-i',
      'in.mp4',
      '-t',
      `${t}`,
      '-ss',
      `${ss}`,
      '-vf',
      `crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}`,
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
    <div className="bg-yellow-600 h-screen w-screen">
      <label className="bg-green-400 " htmlFor="videoUp">
        영상 올리기
      </label>
      <input
        className="w-0 h-0"
        type="file"
        accept="video/*"
        id="videoUp"
        onChange={(e) => {
          setVideo(URL.createObjectURL(e.target.files?.item(0)));
        }}
      />

      {video && <VideoViewer video={video} convertToGif={convertToGif} />}

      {gif && (
        <div className="max-w-lg my-10 mx-auto">
          <img src={gif} />
          <a className="bg-green-400" href={gif} download="out.gif">
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

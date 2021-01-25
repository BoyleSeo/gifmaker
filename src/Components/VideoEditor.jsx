import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import VideoViewer from './VideoViewer';
import B_Upload from '../img/B_Upload.png';
import B_Download from '../img/B_Download.png';

const ffmpeg = createFFmpeg({ log: true });

function VideoEditor() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();
  const [isProcessing, setIsProcessing] = useState(false);

  const load = async () => {
    //ffmpeg load promise를 받으면 ready를 true로
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const convertToGif = async (t, ss, crop) => {
    setIsProcessing(true);
    setGif(null);

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
    setIsProcessing(false);
    // 메모리에서 결과물 읽어들임
    const data = ffmpeg.FS('readFile', 'out.gif');

    // 브라우져에서 사용할 수 있도록 URL 생성
    const url = URL.createObjectURL(new Blob([data.buffer]), {
      type: 'image/gif',
    });
    setGif(url);
  };

  return ready ? (
    <div className="bg-black-custom h-full min-h-screen w-screen">
      <div className="m-auto w-14 h-10 mt-5">
        <label htmlFor="videoUp">
          <img className="w-14" src={B_Upload} />
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
      </div>

      {video && <VideoViewer video={video} convertToGif={convertToGif} />}

      {isProcessing ? <div className="loader" /> : <div />}
      {gif && (
        <div className="max-w-sm mt-10 mx-auto relative">
          <a href={gif} className="" download="out.gif">
            <img className="w-14 absolute top-0 right-0" src={B_Download} />
          </a>
          <img style={{ maxHeight: '50vh' }} src={gif} />
        </div>
      )}
    </div>
  ) : (
    <p className="loader top-1/4" />
  );
}
export default VideoEditor;

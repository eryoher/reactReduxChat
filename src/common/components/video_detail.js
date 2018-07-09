import React from 'react';

const VideoDetail = ({video, customClass}) => {
  if(!video){
    return <div></div>
  }
  const videoId = video.id.videoId;
  const url = `https://www.youtube.com/embed/${videoId}`;
  return (
    <div className={customClass}>
      <div className="embed-responsive embed-responsive-16by9">
        <iframe className="embed-responsive-item" src={url}></iframe>
      </div>
    </div>
  );
};

export default VideoDetail;

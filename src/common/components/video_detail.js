import React from 'react';

const VideoDetail = ({video, customClass, username}) => {
  var userDiv = '';
  if(!video){
    return <div></div>
  }
  if(username != undefined){
    var userDiv = (
      <div className="mt-3">
        <b>{username}</b>
      </div>
    );
  }
  const videoId = video.id.videoId;
  const url = `https://www.youtube.com/embed/${videoId}`;
  return (
    <div className={customClass}>
      <div className="embed-responsive embed-responsive-16by9">
        <iframe className="embed-responsive-item" src={url}></iframe>
      </div>
      {userDiv}
    </div>
  );
};

export default VideoDetail;

import React, { PropTypes } from 'react';
import VideoDetail from './video_detail';

export default class MessageListItem extends React.Component {
  static propTypes = {
    message: PropTypes.object.isRequired
  };

  handleClick(user) {
    this.props.handleClickOnUser(user);
  }

  render() {
    const { message, user } = this.props;
    var divVideo = '';
    var classDiv = 'contenedor';
    var classVideo = 'video-detail offset-md-1 col-md-6 contenedor';
    
    if( message.user.username == user.username ){
      classDiv = 'contenedor darker';
      classVideo = 'video-detail offset-md-1 col-md-6 contenedor darker-video';
    }

    if (message.video) {
      divVideo = (
        <div className="search_bar">
          <VideoDetail video={message.video.selectedVideo}
            customClass={classVideo}  />
        </div>
      );

    }else{
      divVideo = (
        <div className={classDiv}>
          {/* <img src="/w3images/bandmember.jpg" alt="Avatar"> */}
          <b> {message.user.username} </b>
          <p>{message.text}</p>
          <span className="time-right">{message.time}</span>
        </div>
      );
    }

    return (
        <div>
          {divVideo}
        </div>
    );
  }
}

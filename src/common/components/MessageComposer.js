import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Input } from 'react-bootstrap';
import uuid from 'node-uuid';
const API_KEY = 'AIzaSyDV6VIdP5kCU2xOSNZYipU8Azqu2zjjCsk';
import YTSearch from 'youtube-api-search';

export default class MessageComposer extends Component {

  static propTypes = {
    activeChannel: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      text: '',
      typing: false,
      videos: [],
      selectedVideo : null
    };
  }

  videoSearch(term){
    if(term){
      YTSearch({key:API_KEY, term:term}, (videos) => {
        var resVideos = {
          videos: videos,
          selectedVideo:videos[0]
        }
        this.props.onSelectdTermChange(resVideos);
        this.setState(resVideos);
      });
    }else{
      this.setState({videos: [], selectedVideo : null});
      this.props.onSelectdTermChange({videos: [], selectedVideo : null});
    }

  }

  handleSubmit(event) {
    const { user, socket, activeChannel} = this.props;
    const text = event.target.value.trim();
    if (event.which === 13) {
      event.preventDefault();
      var youtube = false;
      //Save video
      if (this.state.selectedVideo != null) {
        youtube = {
          selectedVideo : this.state.selectedVideo
        }
      }

      var newMessage = {
        id: `${Date.now()}${uuid.v4()}`,
        channelID: this.props.activeChannel,
        text: text,
        user: user,
        time: moment.utc().format('lll'),
        video: youtube
      };

      socket.emit('new message', newMessage);
      socket.emit('stop typing', { user: user.username, channel: activeChannel });
      this.props.onSave(newMessage);
      this.setState({ text: '', typing: false });
      this.setState({videos: [], selectedVideo : null});
      this.props.onSelectdTermChange({videos: [], selectedVideo : null});
    }
  }

  handleChange(event) {
    const { socket, user, activeChannel } = this.props;
    var term = event.target.value;
    var search = term.search('/youtube');
    if (search == 0) {
      var textSearch = term.substring(9);
      if( textSearch.length > 3 ){
          this.videoSearch(textSearch);
      }else{
        this.videoSearch(null);
      }
    }
    this.setState({ text: term });

    if (term.length > 0 && !this.state.typing) {
      socket.emit('typing', { user: user.username, channel: activeChannel });
      this.setState({ typing: true});
    }

    if (term.length === 0 && this.state.typing) {
      socket.emit('stop typing', { user: user.username, channel: activeChannel });
      this.setState({ typing: false});
    }
  }
  render() {
    return (
      <div style={{
        zIndex: '52',
        left: '21.1rem',
        right: '1rem',
        width: '100%',
        flexShrink: '0',
        order: '2',
        marginTop: '0.5em'
      }}>
        <Input
          type="text"
          name="message"
          ref="messageComposer"
          autoFocus="true"
          placeholder="Type here to chat!"
          value={this.state.text}
          onChange={::this.handleChange}
          onKeyDown={::this.handleSubmit}
        />
      </div>
    );
  }
}

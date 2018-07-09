import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import MessageComposer from './MessageComposer';
import SearchBar from './search_bar';
import VideoDetail from './video_detail';
import MessageListItem from './MessageListItem';
import Channels from './Channels';
import * as actions from '../actions/actions';
import * as authActions from '../actions/authActions';
import TypingListItem from './TypingListItem';
import YTSearch from 'youtube-api-search';
import { Modal, DropdownButton, MenuItem, Button, Navbar, NavDropdown, Nav, NavItem } from 'react-bootstrap';
const API_KEY = 'AIzaSyDV6VIdP5kCU2xOSNZYipU8Azqu2zjjCsk';


export default class Chat extends Component {

  static propTypes = {
    messages: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    channels: PropTypes.array.isRequired,
    activeChannel: PropTypes.string.isRequired,
    typers: PropTypes.array.isRequired,
    socket: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      privateChannelModal: false,
      targetedUser: '',
      videos: [],
      selectedVideo: null
    }
  }

  videoSearch(videos){
    console.log(videos);
    this.setState(videos);
  }

  componentDidMount() {
    const { socket, user, dispatch } = this.props;

    socket.emit('chat mounted', user);
    socket.on('new bc message', msg =>
      dispatch(actions.receiveRawMessage(msg))
    );
    socket.on('typing bc', user =>
      dispatch(actions.typing(user))
    );
    socket.on('stop typing bc', user =>
      dispatch(actions.stopTyping(user))
    );
    socket.on('new channel', channel =>
      dispatch(actions.receiveRawChannel(channel))
    );
    socket.on('receive socket', socketID =>
      dispatch(authActions.receiveSocket(socketID))
    );
    socket.on('receive private channel', channel =>
      dispatch(actions.receiveRawChannel(channel))
    );
  }


  componentDidUpdate() {
    const messageList = this.refs.messageList;
    messageList.scrollTop = messageList.scrollHeight;

  }
  handleSave(newMessage) {
    const { dispatch } = this.props;
    if (newMessage.text.length !== 0) {
      dispatch(actions.createMessage(newMessage));
    }
  }

  handleSignOut() {
    const { dispatch } = this.props;
    dispatch(authActions.signOut());
  }

  changeActiveChannel(channel) {
    const { socket, activeChannel, dispatch } = this.props;
    socket.emit('leave channel', activeChannel);
    socket.emit('join channel', channel);
    dispatch(actions.changeChannel(channel));
    dispatch(actions.fetchMessages(channel.name));
  }

  handleClickOnUser(user) {
    this.setState({ privateChannelModal: true, targetedUser: user });
  }

  closePrivateChannelModal(event) {
    event.preventDefault();
    this.setState({privateChannelModal: false});
  }

  handleSendDirectMessage() {
    const { dispatch, socket, channels, user } = this.props;
    const doesPrivateChannelExist = channels.filter(item => {
      return item.name === (`${this.state.targetedUser.username}+${user.username}` || `${user.username}+${this.state.targetedUser.username}`)
    })
    if (user.username !== this.state.targetedUser.username && doesPrivateChannelExist.length === 0) {
      const newChannel = {
        name: `${this.state.targetedUser.username}+${user.username}`,
        id: Date.now(),
        private: true,
        between: [this.state.targetedUser.username, user.username]
      };
      dispatch(actions.createChannel(newChannel));
      this.changeActiveChannel(newChannel);
      socket.emit('new private channel', this.state.targetedUser.socketID, newChannel);
    }
    if(doesPrivateChannelExist.length > 0) {
      this.changeActiveChannel(doesPrivateChannelExist[0]);
    }
    this.setState({ privateChannelModal: false, targetedUser: '' });
  }

  render() {
    const { messages, socket, channels, activeChannel, typers, dispatch, user, screenWidth} = this.props;
    const filteredMessages = messages.filter(message => message.channelID === activeChannel);
    const username = this.props.user.username;
    // const videoSearch = _.debounce((term) => {this.videoSearch(term)}, 300);
    // const videoSearch = _.debounce((term) => {this.videoSearch(term)}, 300);

    const dropDownMenu = (
      <div className="container row" >
        <div className="col-md-6 mt-2 text-center">
            <h3> {username} </h3>
        </div>
        <div className="col-md-6 text-right">
          <Button onClick={::this.handleSignOut} className="btn-custom chat-channels-buttons btn btn-xs btn-default"> Sign out</Button>
        </div>

      </div>
    );
    const bigNav = (
      <div className="col-md-3 chat-channels">
        {dropDownMenu}
        <section style={{order: '2', marginTop: '1.5em'}}>
          <Channels socket={socket} onClick={::this.changeActiveChannel} channels={channels} messages={messages} dispatch={dispatch} />
        </section>
        <section>
          <div className="search_bar">
            <VideoDetail video={this.state.selectedVideo} customClass="video-detail offset-md-1 col-md-12 contenedor darker"  />
          </div>
        </section>
      </div>
    );
    return (
      <div className="chat-container row">
        {bigNav}
        <div className="main col-md-8">
          <div className="chat-container-header">
            <div>
            {activeChannel}
            </div>
          </div>
          <div className="chat-messages-list" ref="messageList">
              {filteredMessages.map(message =>
                <MessageListItem handleClickOnUser={::this.handleClickOnUser} message={message} user={user} key={message.id} />
              )}
          </div>
          <div className="chat-input-message">
            <MessageComposer onSelectdTermChange={::this.videoSearch} socket={socket} activeChannel={activeChannel} user={user} onSave={::this.handleSave} />
          </div>
          <div className="chat-footer">
            {/* <footer className="chat-footer"> */}
              {typers.length === 1 &&
                <div>
                  <span>
                    <TypingListItem username={typers[0]} key={1}/>
                    <span> is typing</span>
                  </span>
                </div>}
              {typers.length === 2 &&
              <div>
                <span>
                  <TypingListItem username={typers[0]} key={1}/>
                  <span> and </span>
                  <TypingListItem username={typers[1]} key={2}/>
                  <span> are typing</span>
                </span>
              </div>}
              {typers.length > 2 &&
              <div>
                <span>Several people are typing</span>
              </div>}
            {/* </footer> */}
          </div>
        </div>
      </div>
    );
  }
}

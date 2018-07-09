import React, { Component, PropTypes } from 'react';
import * as actions from '../actions/actions';
import {receiveAuth} from '../actions/authActions';
import Chat from '../components/Chat';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import cookie from 'react-cookie';

const socket = io('', { path: '/api/chat' });
const initialChannel = 'Lobby'; // NOTE: I hard coded this value for my example.  Change this as you see fit

class ChatContainer extends Component {

  componentDidMount() {
    var { dispatch, user } = this.props;

    const userCokkie = cookie.load('userSession')

    if (cookie.load('userSession')) {
      var user = cookie.load('userSession');
    }
    if(!user.username) {
      dispatch(receiveAuth());
    }
    dispatch(actions.fetchMessages(initialChannel));
    dispatch(actions.fetchChannels(user.username));
  }

  render() {
    var user = cookie.load('userSession');
    return (
        <Chat {...this.props} socket={socket} user={user} />
    );
  }
}

ChatContainer.propTypes = {
  messages: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  channels: PropTypes.array.isRequired,
  activeChannel: PropTypes.string.isRequired,
  typers: PropTypes.array.isRequired
}

function mapStateToProps(state) {
  return {
      messages: state.messages.data,
      channels: state.channels.data,
      activeChannel: state.activeChannel.name,
      user: state.auth.user,
      typers: state.typers,
      screenWidth: state.environment.screenWidth
  }
}
export default connect(mapStateToProps)(ChatContainer)

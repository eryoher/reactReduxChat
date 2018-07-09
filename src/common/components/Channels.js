import React, { Component, PropTypes } from 'react';
import ChannelListItem from './ChannelListItem';
import ChannelListModalItem from './ChannelListModalItem';
import { Modal, Glyphicon, Input, Button } from 'react-bootstrap';
import * as actions from '../actions/actions';
import uuid from 'node-uuid';

export default class Channels extends Component {

  static propTypes = {
    channels: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    messages: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      addChannelModal: false,
      channelName: '',
      moreChannelsModal: false
    };
  }

  handleChangeChannel(channel) {
    if(this.state.moreChannelsModal) {
      this.closeMoreChannelsModal();
    }
    this.props.onClick(channel);
  }

  render() {
    const { channels, messages } = this.props;
    const filteredChannels = channels.slice(0, 8);
    const moreChannelsBoolean = channels.length > 8;
    const restOfTheChannels = channels.slice(8);
    return (
      <section>
        <div>
          <span style={{paddingLeft: '0.8em', fontSize: '1.5em'}}>
            Channels
          </span>
        </div>
        <div>
          <ul style={{display: 'flex', flexDirection: 'column', listStyle: 'none', margin: '0', overflowY: 'auto', padding: '0'}}>
            {filteredChannels.map(channel =>
              <ChannelListItem  messageCount={messages.filter(msg => {
                return msg.channelID === channel.name;
              }).length} channel={channel} key={channel.id} onClick={::this.handleChangeChannel} />
              )}
          </ul>
        </div>
      </section>
    );
  }
}

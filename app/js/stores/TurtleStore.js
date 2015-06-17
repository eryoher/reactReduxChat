import TurtleDispatcher from '../dispatcher/TurtleDispatcher';
import TurtleConstants from '../constants/TurtleConstants';
import TurtleUtils from '../utils/TurtleUtils';
import ThreadStore from '../stores/ThreadStore';

var ActionTypes = TurtleConstants.ActionTypes;

var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _messages = {};

function _addMessages(rawMessages) {
  rawMessages.forEach(function(message) {
    if (!_messages[message.id]) {
      _messages[message.id] = TurtleUtils.convertRawMessage(
        message,
        ThreadStore.getCurrentID()
      );
    }
  });
}

function _markAllInThreadRead(threadID) {
  for (var id in _messages) {
    if (_messages[id].threadID === threadID) {
      _messages[id].isRead = true;
    }
  }
}


var TurtleStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getAll: function() {
    return _messages
  },

  getAllForThread: function(threadID) {
    var threadMessages = [];
    for (var id in _messages) {
      if (_messages[id].threadID === threadID) {
        threadMessages.push(_messages[id]);
      }
    }
    threadMessages.sort(function(a, b) {
      if (a.date < b.date) {
        return -1;
      } else if (a.date > b.date) {
        return 1;
      }
      return 0;
    });
    return threadMessages;
  },

  getAllForCurrentThread: function() {
    return this.getAllForThread(ThreadStore.getCurrentID());
  }

});

TurtleStore.dispatchToken = TurtleDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case TurtleConstants.CREATE_MESSAGE:
      var message = TurtleUtils.getCreatedMessageData(
        action.text,
        action.currentThreadID
      );
      _messages[message.id] = message;
      TurtleStore.emitChange();
      break;

    case ActionTypes.CLICK_THREAD:
      TurtleDispatcher.waitFor([ThreadStore.dispatchToken]);
      _markAllInThreadRead(ThreadStore.getCurrentID());
      MessageStore.emitChange();
      break;

    case ActionTypes.RECEIVE_RAW_MESSAGES:
      _addMessages(action.rawMessages);
      TurtleDispatcher.waitFor([ThreadStore.dispatchToken]);
      _markAllInThreadRead(ThreadStore.getCurrentID());
      MessageStore.emitChange();
      break;

  default:
    // do nothing
  }
});

module.exports = TurtleStore;
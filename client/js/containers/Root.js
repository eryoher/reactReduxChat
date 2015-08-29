import React, { PropTypes } from 'react';
import { Redirect, Router, Route, Link } from 'react-router';
import { provide, Provider } from 'react-redux';
import * as reducers from '../reducers';
import Login from '../components/Login';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import Chat from '../components/Chat';
import Register from '../components/Register';
import App from './App';
import Logout from '../components/Logout';
import Cookies from 'cookies-js';
import thunk from 'redux-thunk';
import promiseMiddleware from '../middleware/promiseMiddleware';
import logger from 'redux-logger';

import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { reduxRouteComponent } from 'redux-react-router';

const createStoreWithMiddleware = compose(
  applyMiddleware(thunk, promiseMiddleware),
  devTools(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
  createStore
);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

export default class Root extends React.Component {

  static propTypes = {
    history: PropTypes.object.isRequired
  }

  render() {
    const { history, dispatch } = this.props
    return (
      <div>
        <Provider store={store}>
          {renderRoutes.bind(null, history)}
        </Provider>
        <DebugPanel top right bottom>
          <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
      </div>
    );
  }
}

function requireAuth(nextState, transition) {
  if(!Cookies.get('eat')) {
    transition.to('/login', null, { nextPathname: nextState.location.pathname });
  }
}

function renderRoutes (history) {
  return (
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="/chat" component={Chat} onEnter={requireAuth} />
        <Route path="/login" component={Login}>
        </Route>
        <Route path="/register" component={Register}>
        </Route>
        <Route path="/logout" component={Logout}>
          <Redirect from="/logout " to="/" />
        </Route>
      </Route>
    </Router>
  )
}
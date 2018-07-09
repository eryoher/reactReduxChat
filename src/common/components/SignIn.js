import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Input } from 'react-bootstrap';
import * as authActions from '../actions/authActions';

class SignIn extends Component {

  static propTypes = {
    welcomePage: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      username: this.props.welcomePage || '',
      password: '',
      loginError : false,
    };
  }

  componentDidMount() {
    if (this.state.username.length) {
      this.refs.passwordInput.getInputDOMNode().focus();
    } else {
      this.refs.usernameInput.getInputDOMNode().focus();
    }
  }
  handleChange(event) {
    if (event.target.name === 'username') {
      this.setState({ username: event.target.value });
    }
    if (event.target.name === 'password') {
      this.setState({ password: event.target.value });
    }
  }
  handleSubmit(event) {
    event.preventDefault();
    const { dispatch } = this.props;
    if (this.state.username.length < 1) {
      this.refs.usernameInput.getInputDOMNode().focus();
    }
    if (this.state.username.length > 0 && this.state.password.length < 1) {
      this.refs.passwordInput.getInputDOMNode().focus();
    }
    if (this.state.username.length > 0 && this.state.password.length > 0) {
      var userObj = {
        username: this.state.username,
        password: this.state.password
      };
      dispatch(authActions.signIn(userObj))
      this.setState({username : '', password: ''});
    }
  }
  render() {
    var divError = '';
    if( this.state.loginError ){
      divError = (
        <div className="alert alert-danger">
            The data is incorrect
        </div>
      );
    }

    return (
      <div className="container">
        <div className="col-sm-6 mx-auto">
          <div className="card mt-5">
            <div className="card-body">
              <h1 className="text-center">
                <span className="fa fa-sign-in"></span> Login
              </h1>
              <form onSubmit={::this.handleSubmit}>
                {divError}
                <div className="form-group">
                  <Input
                    className="form-control"
                    label="Username"
                    ref="usernameInput"
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={this.state.username}
                    onChange={::this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <Input
                    className="form-control"
                    label="Password"
                    ref="passwordInput"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={this.state.password}
                    onChange={::this.handleChange}
                  />
                </div>
                <Button
                  className ="btn btn-dark btn-lg"
                  type="submit" >
                    Login
                </Button>
              </form>
              <div className="text-center">
                <p>Need an account? <a href="/signup">Signup</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
      welcomePage: state.welcomePage,
  }
}
export default connect(mapStateToProps)(SignIn)

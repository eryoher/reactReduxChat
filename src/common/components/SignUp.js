import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import { Input, Button } from 'react-bootstrap';
import * as authActions from '../actions/authActions';

class SignUp extends Component {

  static propTypes = {
    welcomePage: PropTypes.string.isRequired,
    userValidation: PropTypes.array.isrequired,
    dispatch: PropTypes.func.isRequired
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      username: this.props.welcomePage || '',
      password: '',
      confirmPassword: ''
    };
  }
  componentWillMount() {
    const { dispatch, userValidation } = this.props;
    if(userValidation.length === 0) {
      dispatch(actions.usernameValidationList());
    }
  }
  componentDidMount() {
    if (this.state.username.length) {
      this.refs.passwordInput.getInputDOMNode().focus();
    } else {
      this.refs.usernameInput.getInputDOMNode().focus();
    }
  }
  handleSubmit(event) {
    event.preventDefault();
    const { dispatch } = this.props;
    if (!this.state.username.length) {
      this.refs.usernameInput.getInputDOMNode().focus();
    }
    if (this.state.username.length && !this.state.password.length) {
      this.refs.passwordInput.getInputDOMNode().focus();
    }
    if (this.state.username.length && this.state.password.length && !this.state.confirmPassword.length) {
      this.refs.confirmPasswordInput.getInputDOMNode().focus();
    }
    if (this.state.username.length && this.state.password.length && this.state.confirmPassword.length) {
      const userObj = {
        username: this.state.username,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword
      };
      dispatch(authActions.signUp(userObj))
      const initLobby = {
        name: "Lobby",
        id: 0,
        private: false
      };
      dispatch(actions.createChannel(initLobby));
      this.setState({ username: '', password: '', confirmPassword: ''});
    }
  }
  handleChange(event) {
    if (event.target.name === 'username') {
      this.setState({ username: event.target.value });
    }
    if (event.target.name === 'password') {
      this.setState({ password: event.target.value });
    }
    if (event.target.name === 'confirm-password') {
      this.setState({ confirmPassword: event.target.value });
    }
  }
  validateUsername() {
    const { userValidation } = this.props;
    if (userValidation.filter(user => {
      return user === this.state.username.trim();
    }).length > 0) {
      return 'error';
    }
    return 'success';
  }
  validateConfirmPassword() {
    if (this.state.confirmPassword.length > 0 && this.state.password.length > 0) {
      if (this.state.password === this.state.confirmPassword) {
        return 'success';
      }
      return 'error';
    }
  }
  render() {
    return (
      <div className="container">
        <div className="col-sm-6 mx-auto">
          <div className="card mt-5">
            <div className="card-body">
              <h1 className="text-center">
                <span className="fa fa-sign-in"></span> Signup
              </h1>
              <form onSubmit={::this.handleSubmit} >
                <div className="form-group">
                  <Input
                    className="form-control"
                    label="Username"
                    ref="usernameInput"
                    type="text"
                    help={this.validateUsername() === 'error' && 'A user with that name already exists!'}
                    bsStyle={this.validateUsername()}
                    hasFeedback
                    name="username"
                    autoFocus="true"
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
                    value={this.state.password}
                    placeholder="Enter password"
                    onChange={::this.handleChange}
                  />

                </div>
                <div className="form-group">
                  <Input
                    className="form-control"
                    label="Confirm Password"
                    ref="confirmPasswordInput"
                    help={this.validateConfirmPassword() === 'error' && 'Your password doesn\'t match'}
                    type="password"
                    name="confirm-password"
                    placeholder="Enter password again" value={this.state.confirmPassword}
                    onChange={::this.handleChange}
                  />
                </div>
                <Button
                  disabled={this.validateUsername() === 'error' || this.validateConfirmPassword() === 'error' && true}
                  className="btn btn-dark btn-lg"
                  onClick={::this.handleSubmit}
                  type="submit">
                  Sign Up
                </Button>
              </form>
              <div className="text-center">
                <p>Already have an account? <a href="/">Login</a></p>
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
      userValidation: state.userValidation.data
  }
}

export default connect(mapStateToProps)(SignUp)

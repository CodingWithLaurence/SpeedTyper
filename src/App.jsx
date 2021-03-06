import React, { Component } from 'react'
import { BrowserRouter, Route, Redirect, Link } from 'react-router-dom'
import { createBrowserHistory } from 'history';
import Type from './components/type-game/Type'
import Login from './components/user-form/Login'
import firebase from './firebase-config'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const history = createBrowserHistory();
const theme = createMuiTheme({
  typography: {
    useNextVariants: true, // Removes deprecation warning
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      user: false,
      showAlert: false
    }
    this.submitUsername = this.submitUsername.bind(this)
  }
  submitUsername = () => {
    const userNameRef = firebase.database().ref('users')
    if (!this.state.username.length < 1) {
      this.setState({ showAlert: true })
    }
    //Check if username already exists
    userNameRef.orderByChild('username')
      .equalTo(this.state.username)
      .once('value', v => {
        if (v.val()) {
          this.setState({ showAlert: true })
        } else {
          console.log('Username NOT already in use')
          userNameRef.push({ username: this.state.username, highscore: 0 })
          this.setState({
            user: true
          })
        }
      })
  }
  keyPress = (e) => {
    // Checks if enter is pressed on login input
    if (e.keyCode == 13) {
      this.submitUsername()
    }
  }
  handleChange = (e) => {
    this.setState({ username: e.target.value })
  }

  render() {
    return (
      <BrowserRouter history={history}>
        <MuiThemeProvider theme={theme}>
          <div className="">
            <nav>
              <Link
                style={{ textDecoration: 'none' }}
                to="/" id="title">WordBeater</Link>
            </nav>
            <Route
              exact path='/'
              render={() => (
                <Login
                  username={this.state.username}
                  showAlert={this.state.showAlert}
                  keyPress={this.keyPress}
                  submitUsername={this.submitUsername}
                  handleChange={this.handleChange} />
              )} />
            {this.state.user ? (
              <Redirect to='/type-racer' />
            ) : null}
            <Route
              path='/type-racer'
              render={() =>
                <Type
                  username={this.state.username}
                />
              }
            />
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    )
  }
}
export default App
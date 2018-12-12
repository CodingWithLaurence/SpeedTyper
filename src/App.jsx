import React, { Component } from 'react'
import { BrowserRouter, Route, Redirect, withRouter } from 'react-router-dom'
import Type from './components/type-game/Type'
import Login from './components/user-form/Login'
import firebase from './firebase-config'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      user: false,
    }
  }
  submitUsername = () => {
    const userNameRef = firebase.database().ref('users')
    if(!this.state.username.length > 1) {
       window.alert('Username too short')}
    //Check if username already exists
    userNameRef.orderByChild('username')
      .equalTo(this.state.username)
      .once('value', v => {
        if (v.val()) {
          window.alert('Username already in use')
        } else {
          console.log('Username NOT already in use')
          userNameRef.push({ username: this.state.username, highscore: 0 })
          // this.props.history.push('/type-reacer')
        }
      })
  }
  handleChange = (e) => {
    this.setState({ username: e.target.value })
  }
  render() {
    if (this.state.user) {
      return <Redirect to='/type-racer' />
    }
    return (
      <BrowserRouter>
        <div className="">
          <nav>WordBeater</nav>
          <Route
            exact path='/'
            render={() => (<Login
              username={this.state.username}
              submitUsername={this.submitUsername}
              handleChange={this.handleChange} />)}
          />
        
          <Route
            path='/type-racer'
            render={() =>  (
              <Type
                username={this.state.username}
              />)
            }
          />
        </div>
      </BrowserRouter>
    )
  }
}
export default App
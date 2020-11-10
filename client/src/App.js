import React from 'react';
import API from './API.js';
import NavBar from './components/NavBar.js';
import LoginForm from './components/LoginForm.js';
import BookingBody from './components/BookingBody.js';
import DashboardBody from './components/DashboardBody.js';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = { loginError: null };
  }

  componentDidMount() {
    //check if the user is authenticated
    API.isAuthenticated()
      .then((user) => { console.log(user); this.setState({ user: user.username, role: user.roleId, name: user.name }); })
      .catch(() => this.setState({ user: null }));
  }

  login = (username, password) => {

    API.login(username, password)
      .then((obj) => this.setState({ loginError: null, user: obj.username, role: obj.roleId, name: obj.name }))
      .catch((err) => this.setState({ loginError: err.code }));
  }

  logout = () => {
    API.logout().then(() => {
      setTimeout(() => this.setState({ user: null }), 300); //short delay to avoid immediate page reloading
    });
  }

  render() {
    return <div className="App">
      <Router>
        <NavBar user={this.state.user} role={this.state.role} name={this.state.name} logout={this.logout} />
        <Switch>
          <Route path="/login">
            <Container className="login-container">
              <h2>Login</h2>
              <LoginForm onLogin={this.login} loginError={this.state.loginError} logged={this.state.user} ></LoginForm>
            </Container>
          </Route>
          <Route path="/" render={() => {
            if (this.state.user === null)
              return <Redirect to="/login"></Redirect>
            else {
              if (this.state.role === "1") {
                return <Container className="custom-container">
                  <Row>
                    <BookingBody name={this.state.name}></BookingBody>
                  </Row>
                </Container>
              } else {
                return <Container className="custom-container">
                  <Row>
                    <DashboardBody name={this.state.name}></DashboardBody>
                  </Row>
                </Container>
              }
            }

          }}>
          </Route>
        </Switch>
      </Router>
    </div>

  }

}

export default App;

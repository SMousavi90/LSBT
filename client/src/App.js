import React from 'react';
import API from './API/API.js';
import NavBar from './components/NavBar.js';
import LoginForm from './components/LoginForm.js';
import BookingBody from './components/BookingBody.js';
import DashboardBody from './components/DashboardBody.js';
import { AuthContext } from './auth/AuthContext';
import NotificationTable from './components/NotificationTable.js';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  withRouter
} from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BookingHistory from './components/BookingHistory.js';


class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = { loginError: null, notification_list:[] };
  }

  componentDidMount() {
    //check if the user is authenticated
    API.isAuthenticated()
      .then((user) => { //console.log(user);
        if(user.roleId == 2)//if it's a teacher check if there are some lecture notification to send
        {
          this.checkNotification();
        }
        this.setState({ userId: user.userId, user: user.username, role: user.roleId, name: user.name }); })
      .catch(() => this.setState({ user: null }));
  }

  checkNotification(){
        API.isAuthenticated()
        .then((user) => { //console.log(user);
        if(user.roleId == 2)//if it's a teacher check if there are some lecture notification to send
        {
          API.getNotification(user.userId).then((notifications)=>{
            this.setState({notification_list:notifications });
            API.updateNotificationStatus(user.userId)
              .then(()=>{console.log("ok")})
              .catch(()=>{}); 
            console.log(this.state.notification_list);
          }).catch(()=>{}); 
        }
      });
  }
  

  login = (username, password) => {

    API.login(username, password)
      .then((obj) => {
        if(obj.roleId)
        {
          console.log("teacher!");
          this.checkNotification();
        }
        
        this.setState({ loginError: null, user: obj.username, authUser: obj, role: obj.roleId, name: obj.name, userId: obj.userId })
      })
      .catch((err) => this.setState({ loginError: err.code }));
  }

  logout = () => {
    API.logout().then(() => {
      setTimeout(() => this.setState({ user: null }), 300); //short delay to avoid immediate page reloading
    });
  }

  render() {
    // compose value prop as object with user object and logout method
    const value = {
      authUser: this.state.authUser,
      authErr: this.state.authErr,
      loginUser: this.login,
      logoutUser: this.logout
    }
    return (
      <AuthContext.Provider value={value}>
        <div className="App">
          <Router>
          <NavBar user={this.state.user} role={this.state.role} name={this.state.name} notifications = {this.state.notification_list} logout={this.logout} />
            <Switch>
            <Route path="/notification">
              <Container className="login-container">
                  <h2>Notifications</h2>
                  <NotificationTable notifications = {this.state.notification_list}/>
              </Container>
            </Route>
              <Route path="/login">
                <Container className="login-container">
                  <h2>Login</h2>
                  <LoginForm onLogin={this.login} loginError={this.state.loginError} logged={this.state.user} ></LoginForm>

                </Container>
              </Route>
              <Route path="/BookingHistory">
                <Container className="custom-container col-md-12">
                  <Row>
                    <Col sm={12}>
                      <BookingHistory />
                    </Col>
                  </Row>
                </Container>
              </Route>
              <Route path="/" render={() => {
                if (this.state.user === null)
                  return <Redirect to="/login"></Redirect>
                else {
                  if (this.state.role === "1") {
                    return <Container className="custom-container col-md-12">
                      <Row>
                        <BookingBody name={this.state.name}></BookingBody>
                      </Row>
                    </Container>
                  } else {
                    return <Container className="custom-container">
                      <Row>
                        <DashboardBody name={this.state.name} id ={this.state.userId}></DashboardBody>
                      </Row>
                    </Container>
                  }
                }
              }}>
              </Route>
            </Switch>
          </Router>
        </div>
      </AuthContext.Provider>
    );
  }

}

export default App;

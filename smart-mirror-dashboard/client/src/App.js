import React, { Component } from 'react';
import { Switch, Router, Route } from 'react-router-dom';
import history from './history';
import landing from './pages/landingPage.js';
import register from './pages/registerPage.js';
import login from './pages/loginPage.js';
import dashboard from './pages/dashboardPage.js';
import widget from './pages/widgetSettings.js';
import facial from './pages/facialSettings.js';
import logout from './pages/logoutPage.js'
import forgotPassword from './pages/forgotPassword.js'
import changePassword from './pages/changePassword.js'

class App extends Component { 
  render() {
    return (
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={landing}/>
            <Route path="/register" component={register}/>
            <Route path="/login" component={login}/>
            <Route path="/dashboard" component={dashboard}/>
            <Route path="/widget" component={widget}/>
            <Route path="/facial" component={facial}/>
            <Route path="/logout" component={logout}/>
            <Route path="/forgotPassword" component={forgotPassword}/>
            <Route path="/changePassword/:token" component={changePassword}/>
          </Switch>
        </Router>  
    );
  }
}

export default App;
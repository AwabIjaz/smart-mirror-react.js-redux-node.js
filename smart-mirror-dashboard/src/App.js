import React, { Component } from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import landing from './pages/landingPage.js';
import register from './pages/registerPage.js';
import login from './pages/loginPage.js';
import dashboard from './pages/dashboardPage.js';
import widget from './pages/widgetSettings.js';
import facial from './pages/facialSettings.js';

class App extends Component { 
  render() {
    return (
        <Router>
          <Switch>
            <Route exact path="/" component={landing}/>
            <Route path="/register" component={register}/>
            <Route path="/login" component={login}/>
            <Route path="/dashboard" component={dashboard}/>
            <Route path="/widget" component={widget}/>
            <Route path="/facial" component={facial}/>
          </Switch>
        </Router>  
    );
  }
}

export default App;
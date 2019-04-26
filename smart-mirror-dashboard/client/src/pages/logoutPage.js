import React, { Component } from 'react';
import '../App.css';
import {Redirect} from 'react-router-dom'


class Logout extends Component {

	componentDidMount(){
		localStorage.clear()
	}
  

	render() {
		return <Redirect to='/login'/>
	}
}

export default Logout;
import React, { Component } from 'react';
import '../App.css';
import {Redirect, Link} from 'react-router-dom'

let localName = '';


class Landing extends Component {

	constructor(props) {
		super(props);
		localName = localStorage.getItem('userName')
	}
  

	render() {

		if (localName){
  			console.log('already logged in!')
			return <Redirect to='/dashboard'/>
		}

		return (
				
			<div className="middleAll">
			  

				<h2 id="theHeading">Welcome to the Smart Mirror Portal</h2>
			
				<span>
					<Link to='/login'>
						<button type="button" className="btn btn-success" >Login</button>
					</Link>
				</span>
    			
				<span>or</span>
				
				<span>
					<Link to='/register'>
						<button type="button" className="btn btn-success">Sign Up</button>
					</Link>
				</span>	  
	    	  

    	    </div>
						
		);
	}
}

export default Landing;
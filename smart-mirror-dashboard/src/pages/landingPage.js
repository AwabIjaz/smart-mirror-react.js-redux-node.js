import React, { Component } from 'react';
import '../App.css';
import {Link} from 'react-router-dom'


class Landing extends Component {
  

	render() {
		return (
				
			<div className="middleAll">
			  

				<h2 className="theHeading">Welcome to the Smart Mirror Portal</h2>
			
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
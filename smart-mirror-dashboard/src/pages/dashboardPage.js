import React, { Component } from 'react';
import '../App.css';
import {Redirect, Link} from 'react-router-dom'


class Dashboard extends Component {
  

	render() {
		
		if (!this.props.location.state){
  			console.log('in if')
			return <Redirect to='/login'/>
		}

		return (
				
			<div className="middleAll">

				<h2 className="theHeading">Welcome to the Smart Mirror Dashboard, {this.props.location.state.name}</h2>
			
				<span>
					<Link to={{
		                pathname: '/widget',
		                state: { name: this.props.location.state.name }
		            }}>
						<button type="button" className="btn btn-success" >Widget Settings</button>
					</Link>
				</span>
    			
				<span>or</span>
				
				<span>
					<Link to={{
		                pathname: '/facial',
		                state: { name: this.props.location.state.name }
		            }}>
						<button type="button" className="btn btn-success">Facial Settings</button>
					</Link>
				</span>	  
	    	  

    	    </div>
						
		);
	}
}

export default Dashboard;
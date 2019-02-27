import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import {Link} from 'react-router-dom'

class WidgetSettings extends Component {
  
  constructor(props) {
  		super(props);
  		this.state = {
  			w1:'Weather',
  			w2:'Date And Time',
  			w3:'Reminders',
  			w4:'Youtube Player',
  			status:''
  		 };
	}

	onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
      }

    onSubmit = (e) => {
		e.preventDefault();
        const { w1,w2,w3,w4 } = this.state;
        axios.post('http://localhost:4000/users/setting', { w1,w2,w3,w4,username:this.props.location.state.name })
          .then((result) => {
          	console.log(result.data);
          	this.setState({status:result.data})
         });
    }
    onSuccess(){
		if(this.state.status === 'User added'){
			return <p>Changes Successfully Applied</p>
		}
    }  
	render() {
		
		return (
				
				<div className='container-fluid'>

					<h2 className="settingHeading">Smart Mirror Settings</h2>

					<form onSubmit={this.onSubmit} >

						<div className="absoluteMiddle">
							
							<span>
								<button type="submit" className="btn btn-success">Apply Changes!</button>
							</span>

							<span> or </span>
							
							<span>
								<Link to={{
					                pathname: '/dashboard',
					                state: { name: this.props.location.state.name }
					        	}}> 
					        		<button type="submit" className="btn btn-info">Go back to the dashboard</button>
					        	</Link>
					        </span>

							<span> <h6> {this.onSuccess()} </h6> </span>

						</div>


						<div className="row">
							<div className="col-4">
								<h2> Widget 1 </h2>
								<div className="form-group">
								  <label htmlFor="w1">Select type:</label>
								  <select className="form-control" onChange={this.onChange} id="w1">
								    <option>Weather</option>
								    <option>Date And Time</option>
								    <option>News</option>
								    <option>Reminders</option>
								    <option>Youtube Player</option>
								  </select>
								</div>
							</div>

							<div className="col-4 offset-4">
								<h2>Widget 2 </h2>
								<div className="form-group">
								  <label htmlFor="w2">Select type:</label>
								  <select className="form-control" value={this.state.w2} onChange={this.onChange} id="w2">
								  	<option>Date And Time</option>
								  	<option>News</option>
								  	<option>Youtube Player</option>
								    <option>Weather</option>
								    <option>Reminders</option>
								  </select>
								</div>
							</div>
						</div>

						<div className="row" id='bottom-widgets'>
							<div className="col-4">
								<h2>Widget 3</h2>
								<div className="form-group">
								  <label htmlFor="w3">Select type:</label>
								  <select className="form-control" value={this.state.w3} onChange={this.onChange} id="w3">
								  	<option>Reminders</option>
								  	<option>Youtube Player</option>
								  	<option>Date And Time</option>
								  	<option>News</option>
								    <option>Weather</option>
								  </select>
								</div>
							</div>

							<div className="col-4 offset-4">
								<h2>Widget 4</h2>
								<div className="form-group">
								  <label htmlFor="w4">Select type:</label>
								  <select className="form-control" value={this.state.w4} onChange={this.onChange} id="w4">
								  	<option>Youtube Player</option>
								  	<option>Reminders</option>
								    <option>Weather</option>
								    <option>News</option>
								    <option>Date And Time</option>
								  </select>
								</div>
							</div>
						</div>

					</form>

				</div>
					

				
						
		);
	}
}

export default WidgetSettings;
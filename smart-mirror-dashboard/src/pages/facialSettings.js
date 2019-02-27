import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'


export default class Facial extends Component {
	constructor(props) {
		super(props);
		this.state = { selectedFile: null, name:'Select a Picture' };
	}
	fileChangedHandler = event => {
	  this.setState({ selectedFile: event.target.files[0], name: event.target.files[0].name })
	}
	uploadHandler = () => {
	  const formData = new FormData()
	  formData.append(
	    'file',
	    this.state.selectedFile,
	    this.state.selectedFile.name
	  )
	  formData.append('username', this.props.location.state.name);
	  console.log(formData);
	  axios.post('http://apes427.herokuapp.com/users/upload', formData)
	  	.then((result) => {
	  		console.log(result.data);
	  	})
	}
	render() {
		return (
			<div className='container-fluid'>

				<Link to={{
		            pathname: '/dashboard',
	                state: { name: this.props.location.state.name }
		        }}> 
		        	<img width='5%' src={require('../h.png')} /> 
		        </Link>

				<div className='middleAll'>
				 	
				 	<h2 className="theHeading">Facial Settings</h2>

				 	<div className='form'>
					  <div className="custom-file">
					    <input type="file" className="custom-file-input" id="customFile" onChange={this.fileChangedHandler}/>
					    <label className="custom-file-label" htmlFor="customFile">{this.state.name}</label>
					  </div>
					</div>

					<br/><br/>

					<button onClick={this.uploadHandler}  className='btn btn-primary'>Upload!</button>				
					
	            </div>

            </div>
		)
	}
}
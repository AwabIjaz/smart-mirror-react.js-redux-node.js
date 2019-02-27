import React, { Component } from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';

export default class Register extends Component {

  constructor(props) {
		super(props);
		this.state = {
          name: '',
          username: '',
          password: '',
          password2: '',
          email: '',
          errorList: [],
          status: '',
          home: false
        }
	}
	onClick = () => {
		console.log('clicked');
        this.setState({home: true});
    }
	onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
	onSubmit = (e) => {
		this.setState({
			errorList: [],
			status: ''
		});	
		e.preventDefault();
		// get our form data out of state
        const { name, username, password, password2, email } = this.state;
        axios.post('http://localhost:4000/users/register', { name, username, password, password2, email })
          .then((result) => {
          	if(result.data === 'User added'){
          		console.log('sab theek hai bro');
          		this.setState({
					status: result.data
				});
          	}
          	else{
          		this.setState({
					errorList: result.data
				});	
          	}
         });
	}
	back(){
    	if(this.state.home){
    		return <Redirect to='/' />;
    	}
    }
	generateSuccessTemp(){
		if(this.state.status === 'User added'){
			console.log('temp success');
			return (<Redirect to={{
                pathname: '/dashboard',
                state: { name: this.state.username }
            }} />)
		}
    }
	generateErrorList(){
		if(this.state.errorList[0]){
			console.log('in generateErrorList')
			return this.state.errorList.map(function(object, i){
            	return <span obj={object} key={i}> {object.msg} </span>;
        	});
		}
    }
	render() {
		return (

		<div className='container'>
			
			<h2 className="portalHeading" onClick={this.onClick}>Smart Mirror Portal</h2>
			<div> {this.back()} </div>	
			<h2 className="headingAccount">Create Your Account</h2>
			
			<form onSubmit={this.onSubmit} >
				<div className="form-group">
					<label>Name</label>
					<input type="text"  className="form-control" name="name" onChange={this.onChange}/>
				</div>
				<div className="form-group">
					<label>Username</label>
					<input type="text"  className="form-control" name="username" onChange={this.onChange}/>
				</div>
				<div className="form-group">
					<label>Email</label>
					<input type="email"  className="form-control" name="email" onChange={this.onChange}/>
				</div>
				<div className="form-group">
					<label>Password</label>
					<input type="password"  className="form-control" name="password" onChange={this.onChange}/>
				</div>
				<div className="form-group">
					<label>Confirm Password</label>
					<input type="password"  className="form-control" name="password2" onChange={this.onChange}/>
				</div>
				<button type="submit" className="btn btn-success">SUBMIT</button>
			</form>

			<div className='errors'> {this.generateErrorList()} </div>

			{this.generateSuccessTemp()}
			
		</div>

			)
		}
	}
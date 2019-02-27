import React, { Component } from 'react';
import axios from 'axios';
import {Redirect, Link} from 'react-router-dom';

export default class Login extends Component {

  constructor(props) {
		super(props);
		this.state = {
          username: '',
          password: '',
          status: '',
          home: false
        };
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
			status: ''
		});	
		e.preventDefault();
        const { username, password } = this.state;
        axios.post('http://localhost:4000/users/login', { username, password })
          .then((result) => {
          	console.log(result.data);
          	if(result.data === 'success'){
          		this.setState({
					status: result.data
				});
          	}
          	else{
          		this.setState({
					status: result.data
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
		if(this.state.status === 'success'){
			console.log('logged in')
			return (<Redirect to={{
                pathname: '/dashboard',
                state: { name: this.state.username }
            }} />)
		}
		else if (this.state.status === 'fail'){
			return <div> <br/><p>Invalid username or password</p> </div>;	
		}
    }
	render() {
		return (
			<div className="container">
					
					<h2 className="portalHeading" onClick={this.onClick}>Smart Mirror Portal</h2>
					<div> {this.back()} </div>
					<h2 className="headingAccount">Login to Your Account</h2>
					
					<form onSubmit={this.onSubmit} >
						<div className="form-group">
							<label>Username</label>
							<input type="text"  className="form-control" name="username" onChange={this.onChange}/>
						</div>
						<div className="form-group">
							<label>Password</label>
							<input type="password"  className="form-control" name="password" onChange={this.onChange}/>
						</div>
						<button type="submit" className="btn btn-success">Login</button>
					</form>

					<div className='errors'> {this.generateSuccessTemp()} </div>
					
			</div>

			)
		}
	}
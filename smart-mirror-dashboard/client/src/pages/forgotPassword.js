import React, { Component } from 'react';
import '../App.css';
import { Redirect, Link } from 'react-router-dom'

import axios from 'axios';
import Loader from '../components/Loader';
import SweetAlert from 'react-bootstrap-sweetalert';

let localName = '';


class ForgotPassword extends Component {

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			status: '',
			alert1: false,
			alert2: false,
			isloading: false
		}
		localName = localStorage.getItem('userName')
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	onSubmit = (e) => {
		e.preventDefault();
		this.setState({ isloading: true });
		const { email } = this.state;
		axios.post('http://apes427.herokuapp.com/users/reset', { email })
			.then((result) => {
				this.setState({ isloading: false });
				console.log(result.data);
				if(result.data.msg === 'check mail'){
					this.setState({ status: 'Check mail', alert1: true })	
				}
				else{
					this.setState({ status: 'An account with this mail doesnt exist', alert2: true })	
				}
			})
			.catch(error => {
				console.log(error);
				this.setState({ status: error.message, alert2: true, isloading: false })
			});
	}

	render() {

		if (localName) {
			console.log('already logged in!')
			return <Redirect to='/dashboard' />
		}

		return (

			<div className="container">

				<Link to={{
					pathname: '/'
				}}>
					<button className='btn' style={{ backgroundColor: 'transparent' }}><h2 className="portalHeading">Smart Mirror Portal</h2></button>
				</Link>
				<h2 className="headingAccount">Forgot Password</h2>

				<form onSubmit={this.onSubmit} >
					<div className="form-group">
						<label>Email</label>
						<input type="email" className="form-control" name="email" onChange={this.onChange} />
					</div>
					<button type="submit" className="btn btn-success">Send</button>
				</form>

				<br />

				<SweetAlert danger title={this.state.status} show={this.state.alert2} onConfirm={() => this.setState({ alert2: false })} />
				<SweetAlert success title={this.state.status} show={this.state.alert1} onConfirm={() => this.setState({ alert1: false })} />
				<Loader isloading={this.state.isloading} />

			</div>


		);
	}
}

export default ForgotPassword;
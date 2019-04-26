import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import history from '../history';
import Loader from '../components/Loader';
import SweetAlert from 'react-bootstrap-sweetalert';

let localStatus = '';

export default class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			status: '',
			alert2: false,
			isloading: false
		}
		localStatus = localStorage.getItem('userStatus');
	}

	componentDidMount() {
		if (localStatus === 'success') {
			this.generateSuccessTemp();
		}
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	onSubmit = (e) => {
		e.preventDefault();
		this.setState({ isloading: true });
		const { username, password } = this.state;
		axios.post('http://apes427.herokuapp.com/users/login', { username, password })
			.then((result) => {
				console.log(result.data);
				let user = result.data;
				this.setState({ isloading: false });
				localStorage.setItem('userStatus', user.status);

				if (user.status === 'success') {
					localStorage.setItem('userName', user.username);
					this.generateSuccessTemp();
				}

				else {
					this.generateError();
				}

			})
			.catch(error => {
				console.log(error);
				this.setState({ status: error.message, isloading: false, alert2: true })
			});
	}


	generateSuccessTemp() {
		console.log('logged in')
		history.push('/dashboard')
	}

	generateError() {
		this.setState({ status: 'Invalid username or password', alert2: true })
	}

	render() {
		return (
			<div className="container">

				<Link to={{
					pathname: '/'
				}}>
					<button className='btn' style={{ backgroundColor: 'transparent' }}><h2 className="portalHeading">Smart Mirror Portal</h2></button>
				</Link>
				<h2 className="headingAccount">Login to Your Account</h2>

				<form onSubmit={this.onSubmit} >
					<div className="form-group">
						<label>Username</label>
						<input type="text" className="form-control" name="username" onChange={this.onChange} />
					</div>
					<div className="form-group">
						<label>Password</label>
						<input type="password" className="form-control" name="password" onChange={this.onChange} />
					</div>
					<Link to={{
						pathname: '/forgotPassword'
					}}>
						<a>Forgot password?</a>
					</Link>
					<br />
					<button type="submit" className="btn btn-success">Login</button>
				</form>

				<br />

				<SweetAlert danger title={this.state.status} show={this.state.alert2} onConfirm={() => this.setState({ alert2: false })} />

				<Loader isloading={this.state.isloading} />

			</div>

		)
	}
}
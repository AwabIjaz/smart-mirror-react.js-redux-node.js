import React, { Component } from 'react';
import '../App.css';
import { Redirect, Link } from 'react-router-dom'
import history from '../history';
import axios from 'axios';
import Loader from '../components/Loader';
import SweetAlert from 'react-bootstrap-sweetalert';

let localName = '';


class ChangePassword extends Component {

	constructor(props) {

		super(props);
		this.state = {
			email:'',
			password: '',
			password2:'',
			status: '',
			alert1: false,
			alert2: false,
			isloading: false,
			errorList: []
		}
		console.log(this.props.match.params.token);
	}

	componentDidMount(){
		axios.post('http://apes427.herokuapp.com/users/verify', { token:this.props.match.params.token })
		.then(response =>{
			console.log(response);
			this.setState({email:response.data.email})
		})
		.catch(err => {
			this.navigateToLogin()
		})
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	onSubmit = (e) => {
		e.preventDefault();
		this.setState({ isloading: true });
		const { password, password2 } = this.state;
		axios.post('http://apes427.herokuapp.com/users/updatePassword', { password, password2,email:this.state.email })
			.then((result) => {
				this.setState({ isloading: false });
				if(result.data.msg === 'success'){
					this.navigateToLogin();
          		}
          		else{
          			console.log('errors');
          			console.log(result.data.msg);
          			if(result.data[0].msg === 'Both passwords must be same'){
          				this.setState({ status:result.data[0].msg, alert2:true });	
	          		}
	          		else{
	          			this.setState({ errorList: result.data, status:"Please fill all the fields", alert2:true });
	          		}
          		} 
			})
			.catch(error => {
				console.log(error);
				this.setState({ status: error.message, isloading: false, alert2: true })
			});
	}

	navigateToLogin() {
		console.log('forgot password token invalid')
		history.push('/login')
	}

	generateErrorList(){
		if(this.state.errorList[0]){
			console.log('in generateErrorList')
			console.log(this.state.errorList);
			return this.state.errorList.map(function(object, i){
            	return <span obj={object} key={i}> {object.msg} </span>;
        	});
		}
    }

	render() {

		

		return (

			<div className="container">

				<Link to={{
					pathname: '/'
				}}>
					<button className='btn' style={{ backgroundColor: 'transparent' }}><h2 className="portalHeading">Smart Mirror Portal</h2></button>
				</Link>
				<h2 className="headingAccount">Reset Password</h2>

				<form onSubmit={this.onSubmit} >
					<div className="form-group">
						<label>New password</label>
						<input type="password" className="form-control" name="password" onChange={this.onChange} />
					</div>
					<div className="form-group">
						<label>password again</label>
						<input type="password" className="form-control" name="password2" onChange={this.onChange} />
					</div>
					<button type="submit" className="btn btn-success">Submit</button>
				</form>

				<br />
				<div className='errors'> {this.generateErrorList()} </div>

				<SweetAlert danger title={this.state.status} show={this.state.alert2} onConfirm={() => this.setState({ alert2: false })} />
				<SweetAlert success title={this.state.status} show={this.state.alert1} onConfirm={() => this.setState({ alert1: false })} />
				<Loader isloading={this.state.isloading} />

			</div>


		);
	}
}

export default ChangePassword;
import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import history from '../history';
import Loader from '../components/Loader';
import SweetAlert from 'react-bootstrap-sweetalert';

let localStatus = '';


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
          status:'',
          alert2:false,
          isloading:false
        }
        localStatus = localStorage.getItem('userStatus');
	}

	componentDidMount(){
		if(localStatus === 'success'){
			this.generateSuccessTemp();
		}
	}

	onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

	onSubmit = (e) => {
		this.setState({ errorList: [] });
		e.preventDefault();
		this.setState({isloading : true});
        const { name, username, password, password2, email } = this.state;
        axios.post('http://apes427.herokuapp.com/users/register', { name, username, password, password2, email })
          .then((result) => {
          	this.setState({isloading : false});
			console.log(result);          	
          	if(result.data.msg === 'success'){
          		localStorage.setItem('userName', username);
          		this.generateSuccessTemp();
          	}
          	else{
          		console.log('errors');
          		console.log(result.data.msg);
          		if(result.data[0].msg === 'Username/Email have to be unique' || result.data[0].msg === 'Both passwords must be same'){
          			this.setState({ status:result.data[0].msg, alert2:true });	
          		}
          		else{
          			this.setState({ errorList: result.data, status:"Please fill all the fields", alert2:true });
          		}
          	} 
         })
         .catch(error => {
         	console.log(error);
         	this.setState({status:error.message, isloading:false, alert2:true})
		 });
	}

	generateSuccessTemp(){
		console.log('temp success');
		history.push('/dashboard');
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

		<div className='container'>
			
			<Link to={{
		                pathname: '/'
            }}>
				<button className='btn' style={{backgroundColor:'transparent'}}><h2 className="portalHeading">Smart Mirror Portal</h2></button>
			</Link>
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

			<SweetAlert danger title={this.state.status} show={this.state.alert2} onConfirm={() => this.setState({ alert2: false })}/>

			<Loader isloading={this.state.isloading}/>
			
		</div>

			)
		}
	}
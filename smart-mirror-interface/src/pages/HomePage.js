import React, { Component } from 'react';
import '../App.css';
import Weather from './weather.js';
import News from './news.js';
import Reminders from './reminders.js';
import Video from './video.js';
import Calendar from './calendarPage.js';
import DateAndTime from './DateAndTime.js';
import axios from 'axios';
import Modal from "react-responsive-modal";
import FadeProps from 'fade-props';
import { connect } from 'react-redux';
import { fetchVoice, fetchWakeWord, changeMessage, fetchUser, setAlarm } from '../actions/voiceActions';
import openSocket from 'socket.io-client';

const socket = openSocket('https://apes427.herokuapp.com');


class Home extends Component {
  
  	constructor(props) {
		super(props);
		this.state = {
			weather: false, news: false, reminders: false, video: false, calendar: false,
			login: false,
			On: true,
		}
	}

	componentDidMount(){
		console.log('componentDidMount');
		socket.on('login', (user) => {
			this.login(user,"Logging in...");
		});
		socket.on('logout',(user) => {
			this.logout(user,"Logging out...");
		});
		socket.on('setting',() => {
			this.getUserSettings();
		})
		socket.on('refresh',()=>{
			this.refresh();
		})
		socket.on('changeState',()=>{
			this.turnOnOff();
		})
		this.getUserSettings();
		this.wakeWord();
	}

	componentWillUnmount(){
		clearInterval(this.intervalId)
	}

	turnOnOff(){
		if(this.state.On){
			this.setState({
				w1:'',
				w2:'',
				w3:'',
				w4:'',
				On:!this.state.On,
			});
			this.props.changeMessage("");
		}
		else{
			this.getUserSettings();
			this.setState({On:!this.state.On});
			if(this.props.username === 'default user'){
				this.props.changeMessage("Welcome!");
			}
			else{
				this.props.changeMessage("Hey, "+this.props.username);
			}
		}
	}

	refresh(){
		window.location.reload();
	}

	login(username,msg){
		if(!this.state.login){
			console.log('logging in');
			clearTimeout(this.timer);
			this.resetSettings();
			this.props.changeMessage(msg);
			if(username){ 
				this.sendResponse('Logged into the Smart Mirror',username);
				setTimeout(() => {this.props.fetchUser(username)}, 2000)
			}
			else{
				this.recognizeFace();
			}
		}
		else{
			let message = 'Already logged in!';
			this.props.changeMessage(message);
			if(username){
				this.sendResponse(message,username);
				this.timer = setTimeout(() => {
					this.props.changeMessage('Hey, '+this.props.username)
				}, 5000);
			}
		}
	}

	logout(username,msg){
		let response = '';
		if(this.state.login){
			response = 'Logged out of the Smart Mirror';
			clearTimeout(this.timer);
			this.resetSettings();
			this.props.changeMessage(msg);
			setTimeout(() => {
				this.props.fetchUser('default user');
				this.props.changeMessage('Welcome!');
			}, 2000);
			if(username){
				this.sendResponse(response,username);
			}
		}
		else{
			response = 'You are already on the default page!';
			this.props.changeMessage(response)
			if(username){
				this.timer = setTimeout(() => {
					this.props.changeMessage('Welcome!');
				}, 5000);
				this.sendResponse(response,username);
			}
		}
	}
	//this
	sendResponse(res,user){
		axios.post('https://apes427.herokuapp.com/mobile/response', {response:res, username:user})
		.then(response =>{
			console.log(response);
		});
	}

	componentDidUpdate(prevProps) {

		if(this.props.goToVoiceApi !== prevProps.goToVoiceApi){
			if(this.props.goToVoiceApi) {
			  	console.log("componentDidUpdate calling voice func")
			  	this.onCloseModal();
				this.voiceFunction();
				setTimeout(() => {
					this.props.changeMessage('Listening...')
				}, 4000);
			}
			else{
			  	console.log("componentDidUpdate calling wakeword func")
			  	this.wakeWord();
			}
		}

		if(this.props.username !== prevProps.username){
			this.props.changeMessage('Hey, '+this.props.username)
			setTimeout(() => {
			  this.getUserSettings();
			}, 1000);
		}

		if(this.props.intent !== prevProps.intent && this.props.message !== prevProps.message && this.props.intent !== ''){
			let message = '';
			if(this.props.username === 'default user'){
				message = 'Welcome!'
			}
			else{
				message = 'Hey, '+this.props.username
			}
			this.timer = setTimeout(() => {
				this.props.changeMessage(message)
			}, 5000);
		}

		if(this.props.value !== prevProps.value){
			if(this.props.intent === 'expand'){
				console.log(this.props.value);
				this.setState({ [this.props.value]: true });	
    		}
    		if(this.props.intent === 'command'){
	    		if(this.props.value === 'login'){
	    			this.login(null,'Logging in, kindly look at the camera');
	    		}
	    		else if(this.props.value === 'logout'){
	    			this.logout(false,"Logging out...");
	    		}
    		}
    		if(this.props.intent === 'create_alarm'){
    			if(this.props.username === 'default user'){
    				this.props.changeMessage("Sorry, You have to login to set alarms.");
    			}
    			else{
    				console.log(this.props.date);
    				if(!this.props.date){
						this.props.changeMessage("Sorry, couldn't set the alarm, try again.")
						return;
					}
    				this.setAlarm();
    			}
    		}
    	}

	}

	setAlarm(){
		let d = new Date(this.props.date);
		console.log(d);
		let time = d.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true}).toLowerCase();
		let date = d.toDateString();
		let dayNumber = d.getDay();
		let hours = d.getHours();
		let minutes = d.getMinutes();
		this.props.setAlarm(date.slice(0,3),time,dayNumber,hours,minutes,this.props.username);
		this.sendAlarm(date.slice(0,3),time,dayNumber,hours,minutes);
	}
	//this
	sendAlarm(day,time,dayNumber,hours,minutes){
		axios.post('https://apes427.herokuapp.com/mobile/sendAlarm', { day:day, time:time, dayNumber:dayNumber, hours:hours,
			minutes:minutes, username:this.props.username })
		.then(response =>{
			console.log(response);
		});
	}

  	onCloseModal = () => {
    	this.setState({ weather: false, news: false, reminders: false, video: false, calendar: false});
  	}

  	recognizeFace(){
  		console.log('in rec');
		axios.get('http://localhost:4000/facial/recognize')
		.then(response =>{
			let data = response.data.trim();
			console.log("user = " + data);

			if(data === 'Unknown' || data === 'no user'){
		    	data = 'default user'
		    	this.props.changeMessage('User not recognized, going back to the default page')
		    	this.setState({ login: false})
		    	setTimeout(() => {
		    		this.props.changeMessage('Welcome!')
			  		this.getUserSettings();
				}, 3000);
		    }

			else if(this.props.username !== data){
				this.props.fetchUser(data);
			}
		})
		.catch(err =>{
			console.log('err');
			console.log(err);
			this.recognizeFace();
		});
    }

    getUserSettings(){
    	console.log("getting settings");
    	axios.post('http://localhost:4000/users/getSettings', {username:this.props.username})
			.then(response => {
				console.log(response.data);
				if(response.data !== 'no settings'){
					this.setState({
						w1:response.data.w1,
						w2:response.data.w2,
						w3:response.data.w3,
						w4:response.data.w4
					});
				}
				else{
					this.setState({
						w1:'Weather',
						w2:'Date And Time',
						w3:'News',
						w4:'Youtube Player'
					});
				}
				//this.recognizeFace()
			})
    }

    resetSettings(){
    	this.setState({
			w1:'',
			w2:'',
			w3:'',
			w4:'',
			login: !this.state.login
		});
    }

	voiceFunction(){
		console.log('going to voice api? = ' + this.props.goToVoiceApi);
		if(this.props.goToVoiceApi){
			this.props.fetchVoice();
			console.log('here');
		}
		else{
			console.log('not going in there bro');
		}
	}

	wakeWord(){
		console.log('calling wake word');
		axios.get('http://localhost:4000/wakeWord')
	      .then(response => {
	        let yoloo = response.data.trim();
	        console.log(yoloo);
	        if(yoloo === "detected"){
	          console.log('wakeWord detected')
	          clearTimeout(this.timer);
	          this.props.fetchWakeWord();
	        }
	      })
	      .catch((error) => {
	        console.log('catch');
	        this.wakeWord();
	      })  
	}

    message_prompt(){
		return <FadeProps><p>{this.props.message}</p></FadeProps>  		
    }

    getDisp(open_modal,modal_component,simple_component){
    	if(open_modal){
				return <Modal open={open_modal} onClose={this.onCloseModal} center>
						<br/>
						{modal_component}
					   </Modal> 
		}

		else{
				return <div> 
			 			{simple_component}
					   </div>
			}
    }

    disp(widget_name){	
    	return <div>
					{(() => {
					switch (widget_name) {
					case "Weather": 	return this.getDisp(this.state.weather, <h3><Weather modal={true}/></h3>, 
															<div className="font"><Weather modal={false}/></div>)


					case "News": 		return this.getDisp(this.state.news, <div> <h2><u>News</u></h2> <News modal={true}/> </div>,
															<div> <p className="font"><u>News</u></p> <News modal={false}/> </div>)


					case "Reminders":   return this.getDisp(this.state.reminders, <div> <h2><u>Reminders</u></h2> <Reminders modal={true}/> </div>,
															<div> <p className="font"><u>Reminders</u></p> <Reminders modal={false}/> 
															 </div>)

											
					case "Youtube Player": return this.getDisp(this.state.video, <div> <br/><Video size='modal-iframe'/> </div>,
															   <Video size='resp-iframe'/>) 


					case "Calendar":    return this.getDisp(this.state.calendar, <div> <br/><Calendar /> </div>,
															<Calendar />)

					case "Date And Time": return this.getDisp(this.state.calendar, <div> <br/><Calendar /> </div>,
															<DateAndTime />)
					default: 			return <div> </div>													
								}
					})()}
				</div>
    }


	render() {
		return (
			<div className="App">

				<div className='container-fluid'>

					<div className="row">

						<div className="col-4" >
							{this.disp(this.state.w1)}
						</div>

						<div className="col-4 offset-4">
							{this.disp(this.state.w2)}
						</div>

					</div>


					<div className="middlew">{this.message_prompt()}</div>


					<div className="row" id='bottom-widgets'>

						<div className="col-4">
							{this.disp(this.state.w3)}
						</div>

						<div className="col-4 offset-4">
							{this.disp(this.state.w4)}
						</div>

					</div>

				</div>

			</div>
		);
	}

}

const mapStateToProps = state => ({
  intent: state.voice.intent,
  value: state.voice.value,
  date: state.voice.date,
  goToVoiceApi: state.voice.goToVoiceApi,
  message: state.voice.msg,
  username: state.voice.username,
});

export default connect(mapStateToProps, { fetchVoice, fetchWakeWord, changeMessage, fetchUser, setAlarm})(Home);
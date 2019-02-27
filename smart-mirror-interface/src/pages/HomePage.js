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
import { fetchVoice, fetchWakeWord, changeMessage, fetchUser } from '../actions/voiceActions';


class Home extends Component {
  
  constructor(props) {
	  super(props);
	  this.state = {
			open1: false, open2: false, open3: false, open4: false, open5: false,
		}
	}

	componentDidMount(){
		console.log('componentDidMount')
		//this.getUserSettings();
		this.recognizeFace();

		console.log('calling wakeword')
		this.wakeWord();
	}

	componentWillUnmount(){
		clearInterval(this.intervalId)
	}


	componentDidUpdate(prevProps) {
		
		if(this.props.goToVoiceApi !== prevProps.goToVoiceApi){

			if(this.props.goToVoiceApi) {
			  	console.log("componentDidUpdate calling voice func")
			  	this.onCloseModal();
				this.voiceFunction();
			}

			else{
			  	console.log("componentDidUpdate calling wakeword func")
			  	this.wakeWord();
			}

		}

		if(this.props.username !== prevProps.username){
			this.props.changeMessage(this.props.username)
			setTimeout(() => {
			  this.getUserSettings();
			}, 1000);
		}

		if(prevProps.message !== this.props.message){
			setTimeout(() => {
				this.props.changeMessage(this.props.username)
			}, 4000);
		}

	}

  	onOpenModal(widget){
  		switch(widget) {
		  case 'weather':
		    this.setState({ open1: true })
		    break;
		  case 'news':
		    this.setState({ open2: true })
		    break;
		  case 'reminders':
		    this.setState({ open3: true })
		    break;
		  case 'video':
		    this.setState({ open4: true })
		    break;
		  case 'calendar':
		    this.setState({ open5: true })
		    break;
		  default:
		  	break;
		}
  	}

  	onCloseModal = () => {
    	this.setState({ open1: false, open2: false, open3: false, open4: false, open5: false});
  	}

  	recognizeFace(){
		axios.get('http://localhost:4000/facial/recognize')
			.then(response =>{

				let data = response.data.trim();
				console.log("user = " + data);

				if(data === 'Unknown'){
			    	data = 'default user'
			    }

				if(this.props.username !== data){
					this.props.fetchUser(data);
				}
				else{
					this.recognizeFace()
				}
			})
    }

    getUserSettings(){
    	axios.post('http://localhost:4000/users/getSettings', {username:'awab'})
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
				this.recognizeFace()
			})
    }

	voiceFunction(){
		console.log('going to voice api? = ' + this.props.goToVoiceApi);
		if(this.props.goToVoiceApi){
			this.props.fetchVoice();
		}
		else{
			console.log('not going in there bro');
		}
	}

	wakeWord(){
		console.log('wake word');
		this.props.fetchWakeWord();
		this.getIntent();
	}

    message_prompt(){
		return <FadeProps><h2>{this.props.message}</h2></FadeProps>  		
    }
    
    getIntent(){
    	console.log("in the intent");
    	console.log(this.props.intent)
    	if(this.props.intent === 'expand'){	
    		this.onOpenModal(this.props.value);
    	}
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
					case "Weather": 	return this.getDisp(this.state.open1, <h3><Weather modal={true}/></h3>, 
															<div className="font"><Weather modal={false}/></div>)


					case "News": 		return this.getDisp(this.state.open2, <div> <h2><u>News</u></h2> <News modal={true}/> </div>,
															<div> <p className="font"><u>News</u></p> <News modal={false}/> </div>)


					case "Reminders":   return this.getDisp(this.state.open3, <div> <h2><u>Reminders</u></h2> <Reminders modal={true}/> </div>,
															<div> <p className="font"><u>Reminders</u></p> <Reminders modal={false}/> 
															 </div>)

											
					case "Youtube Player": return this.getDisp(this.state.open4, <div> <br/><Video /> </div>,
															<Video />) 


					case "Calendar":    return this.getDisp(this.state.open5, <div> <br/><Calendar /> </div>,
															<Calendar />)

					case "Date And Time": return this.getDisp(this.state.open5, <div> <br/><Calendar /> </div>,
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

					<div className="row" id='top-widgets'>

						<div className="col-4" >
							{this.disp(this.state.w1)}
						</div>

						<div className="col-4 offset-4">
							{this.disp(this.state.w2)}
						</div>

					</div>


					<div className="middlew">{this.message_prompt()}</div>


					<div className="row" id='bottom-widgets'>

						<div className="col-4" id='bottom1'>
							{this.disp(this.state.w3)}
						</div>

						<div className="col-4 offset-8">
							{this.disp(this.state.w4)}
						</div>

					</div>

				</div>

				<div id="middle"><p>{this.props.voiceText}</p></div>

			</div>
		);
	}

}

const mapStateToProps = state => ({
  voiceText: state.voice.voiceText,
  intent: state.voice.intent,
  value: state.voice.value,
  date: state.voice.date,
  goToVoiceApi: state.voice.goToVoiceApi,
  message: state.voice.msg,
  username: state.voice.username
});

export default connect(mapStateToProps, { fetchVoice, fetchWakeWord, changeMessage, fetchUser })(Home);
import React, {Component} from 'react'
import FadeProps from 'fade-props';
import { connect } from 'react-redux';
import { fetchReminders } from '../actions/remindersActions';
import { createReminder } from "../actions/voiceActions";


class Reminders extends Component {

	constructor(props) {
	  super(props)
	  this.state = {
	  		i:0, j:2
		}
	}

	componentDidMount(){
			
			this.props.fetchReminders(this.props.rems.username); 

			this.intervalId = setInterval(() => {
				if(this.props.reminders.length > 3 && this.props.modal !== true){
					if(this.props.reminders.length%2 === 0 && this.props.reminders[this.state.j] === undefined){
						this.resetArr()
					}
					else if(this.props.reminders.length%2 === 1 && this.props.reminders[this.state.j+1] === undefined){
						this.resetArr()
					}
					else{
			      		this.setState({i:this.state.i+2, j:this.state.j+2})
			      	}
			    }
		    }, 3000);
                                                                                                                 
	}

	componentWillUnmount(){
		clearInterval(this.intervalId)
	}

	componentDidUpdate(prevProps) {
		
		if(this.props.rems.username !== prevProps.rems.username){

			console.log("getting reminders")
			this.props.fetchReminders(this.props.rems.username);

		}

		if(this.props.rems.intent ==='create_reminder' && this.props.rems.intent !== prevProps.rems.intent){

			console.log("in pushing reminders")
			this.props.createReminder(this.props.rems.description,this.props.rems.date,this.props.rems.username)
			this.props.reminders.push(this.props.rems);

		}


	}

	resetArr(){
		this.setState({i:0,j:2})
	}

	get_reminders(){

    	if(this.props.reminders.length < 1){
    		return <p> no reminders yet </p>
    	}

    	else{
	    		let rems = []
	    		if(this.props.modal){
	    			rems = this.props.reminders
	    		}
	    		else{
	    			
	    				let c=0
	    				for(let i=this.props.reminders.length-1;i>=0;i--){
	    					rems[c]=this.props.reminders[i]
	    					c=c+1
	    				}
	    				rems = rems.slice(this.state.i, this.state.j)
	    			
	    		}
		    	return rems.map(function(object, i){
		        	let dateToday = new Date()
		        	let dateTemp = new Date(object.date)
		        	dateToday.setHours(0,0,0,0)
		    		let timeDiff = dateTemp.getTime() - dateToday.getTime()
		    		let diffDays = ''
		    		if(timeDiff === 0){
		    			diffDays = 'today'
		    		}
		    		else if(timeDiff < 0){
		    			diffDays = 'past the date'
		    		}
		    		else if(timeDiff <= 86400000){
		    			diffDays = 'tomorrow'
		    		}
		    		else{
		    			diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + ' days';
		    		}
		            return <p obj={object} key={i}>{object.description} - {diffDays}</p>;
		        });
		    }
    }

    render() {
    	return(
    		<FadeProps><div>{this.get_reminders()}</div></FadeProps>
    	)
    }

}

const mapStateToProps = state => ({
  reminders: state.reminders.items,
  rems: {description:state.voice.value, date:state.voice.date, username:state.voice.username, intent:state.voice.intent}
});

export default connect(mapStateToProps, { fetchReminders, createReminder })(Reminders);
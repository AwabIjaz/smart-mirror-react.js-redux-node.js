import React, { Component } from 'react';
import '../App.css';


export default class DateAndTime extends Component {
      constructor(props) {
        super(props);
        this.state = {
          time: '',
          date: '',
        };
      }
      componentDidMount() {
        this.intervalId = setInterval(() => {

        	let date = new Date()

      		this.setState({time: date.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true}).toLowerCase()})
      		this.setState({date: date.toDateString()})

        }, 1000);	
      }

      componentWillUnmount() {
        clearInterval(this.intervalId);
      }
    
      render() {
        return (
	        <div>	
	          <p className="font">
	            {this.state.time}
	          </p>
	          <p>
	          	{this.state.date}
	          </p>
          </div>
        );
      }
    }

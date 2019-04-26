import React, { Component } from 'react';
import Calendar from 'react-calendar'

export default class Calender extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			date: new Date(),
		}
	}

    render() {
		return (
			<div className="container">
				<Calendar prevLabel='' nextLabel='' prev2Label='' next2Label='' value={this.state.date}/>
			</div>
			)
		}
}

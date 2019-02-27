import React, {Component} from 'react'
import WeatherIcon from 'react-icons-weather';
import { connect } from 'react-redux';
import { fetchWeather } from '../actions/weatherActions';


class Weather extends Component {

	componentDidMount(){
		this.props.fetchWeather();
	}

	getWeather(){
    	return	<div>
					<WeatherIcon style={{color:"brown"}} name="owm" iconId={this.props.weatherIconId} size="3x"/> {this.props.status}
					<br/>{this.props.temperature}°C		
				</div>
    }

    getDetailedWeather(){

    	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
		let day = new Date();
		let nextDay = new Date(day);
		nextDay.setDate(day.getDate()-1);
    	return this.props.weatherList.map(function(object, i){
    		nextDay.setDate(nextDay.getDate()+1);
    		let temp = "" + object.weather[0].id;
            return <h4 key={i}>{nextDay.getDate()}/{monthNames[nextDay.getMonth()]} <WeatherIcon name="owm" iconId={temp} size="3x"/> {object.weather[0].main}
						<br/>Max = {Math.ceil(-273 + object.temp.max)} °C, Min = {Math.ceil(-273 + object.temp.min)} °C
					</h4>	
        });

    }

    choice(){
    	if(this.props.modal){
    		return this.getDetailedWeather()
    	}
    	else{
    		return this.getWeather()
    	}
    }

    render() {
    	return(
    		<div>{this.choice()}</div>
    	)
    }

}

const mapStateToProps = state => ({
  weatherIconId: state.weather.weatherIconId,
  temperature: state.weather.temperature,
  status: state.weather.status,
  weatherList: state.weather.weatherList
});

export default connect(mapStateToProps, { fetchWeather })(Weather);
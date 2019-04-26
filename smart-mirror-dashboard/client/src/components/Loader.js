import React, { Component } from 'react';
import './loader.css';


export default class Loader extends Component {

	loading(){
	    if(this.props.isloading){
	      return  <div className="loading">
	                <div className="loader"></div>
	              </div>
	    }
	}

    render() {
	    return (
	      <div> {this.loading()} </div>
	    );
    }

}
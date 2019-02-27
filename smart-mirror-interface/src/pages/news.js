import React, {Component} from 'react'
import FadeProps from 'fade-props';
import { connect } from 'react-redux';
import { fetchNews } from '../actions/newsActions';


class News extends Component {

	constructor(props) {
	  super(props);
	  this.state = {
	  		i:0, j:3, c:3, x:6,
		}
	}

	componentDidMount(){

		this.props.fetchNews();

		this.intervalId = setInterval(() => {
			if(this.props.modal !== true){
      			this.setState({i:this.state.i+this.state.c, j:this.state.j+this.state.c, c:-this.state.c+this.state.x, x:-this.state.c})
      		}
    	}, 4000);	

	}

	componentWillUnmount(){
		clearInterval(this.intervalId)
	}

	getNews(){
		let news = []
		if(this.props.modal){
			news = this.props.news
		}
		else{
			news = this.props.news.slice(this.state.i, this.state.j)
		}
    	return news.map(function(object, i){
            return <p obj={object} key={i}> {object.title} </p>
        });
    }

    render() {
    	return(
    		<FadeProps><div>{this.getNews()}</div></FadeProps>
    	)
    }

}

const mapStateToProps = state => ({
  news: state.news.items
});

export default connect(mapStateToProps, { fetchNews })(News);
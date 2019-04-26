import React, {Component} from 'react'
import YouTube from 'simple-youtube-api';
import { connect } from 'react-redux';
import { fetchVideoId, stopVideo } from '../actions/voiceActions';
import '../App.css';

const youtube = new YouTube('AIzaSyBUBeKwRpSd32kMkP4qCHDFYstAZ3iU6VY');

class Video extends Component {


	getVideo(){
		console.log("intent: "+this.props.intent+"; videoId: "+this.props.videoId)
    	if(this.props.intent === 'play video'){
            console.log('going to get video id')
    		this.props.fetchVideoId(this.props.value,youtube)
    	}

    	else if(this.props.intent === 'stop video'){
            this.props.stopVideo()
        }

        if(this.props.videoId !== 0){
    		let videoUrl = 'https://www.youtube.com/embed/' + this.props.videoId + '?autoplay=1&mute=0';
    		console.log(videoUrl);
    		return  <div>                  
				    	<iframe className={this.props.size} title="This is a unique title" src={videoUrl} allow="autoplay"></iframe>
					</div>	          	
    	}
    }

    render() {
    	return(
    		<div> {this.getVideo()} </div>
    	)
    }

}

const mapStateToProps = state => ({
  videoId: state.voice.videoId,
  intent: state.voice.intent,
  value: state.voice.value
});

export default connect(mapStateToProps, { fetchVideoId, stopVideo })(Video);
import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Group, Gallery, View, Button, Div } from '@vkontakte/vkui';
import Counter from '../Components/Countdown';
import '@vkontakte/vkui/dist/vkui.css';
import './Event.css';

class Event extends React.Component {

    constructor (props) {
		super(props);
		this.state = {
			current: {
				color: {
					color: '',
					easing: '',
				}
			},
			offset: 0,
		}
	}

	componentWillMount() {
		if (Object.keys(this.props.event.items)[0]) {
			const event = this.props.event.items[Object.keys(this.props.event.items)[0]];
			this.setState({
				serverTs: this.props.event.server_ts,
				startTs: this.props.event.start_ts,
				current: {
					color: {
						color: event.color.color,
					}
				}
			});
		}
	}

	componentDidMount() {
		const time = this.state.serverTs;
		const offset = this.state.startTs - time;
		if (offset > 0) {
			if (this.props.event) {
				setTimeout(() => this.changeColor(0), offset);
			}
			this.setState({
				willStart: true,
				offset: offset,
				time: time,
			});
		} else {
			this.setState({
				isEnded: true,
			});
		}
	}

	changeColor(i) {
		this.setState({
			willStart: false,
		});
		const key = Object.keys(this.props.event.items)[i];
		const event = this.props.event.items[key];
		if (key) {
			setTimeout(() => {
				this.setState({
					current: event,
				});
				this.changeColor(i + 1)
				if (i + 1 === Object.keys(this.props.event.items).length) {
					setTimeout(() => {
						this.setState({
							isEnded: true,
						});
					}, parseInt(event.color.duration, 10))
				}
			}, parseInt(event.color.duration, 10));
		}
	}

    render () {
		return (
			<Panel id={this.props.id}>
				<Div className='ColorScreen' style={{
					backgroundColor: this.state.current.color.color,
					transition: `background-color ${this.state.current.color.easing}`,
				}}>
					{this.state.isEnded === false && <h3 style={{color: 'white', textAlign: 'center', marginTop: 100}}>{this.props.location ? this.props.location : 'No location data'}</h3>}
					{this.state.isEnded && <div className='EventEndPic' />}
					{this.state.isEnded && <h3 style={{color: 'black', textAlign: 'center'}}>Событие закончилось</h3>}
					{this.state.willStart && <h3 style={{color: 'black', textAlign: 'center'}}>Событие скоро начнется <br/>{this.state.offset} <br/>{this.state.time}</h3>}
					{this.state.willStart && <Counter time={this.state.offset + new Date().getTime()} renderer={renderer}/>}
				</Div>
			</Panel>
		)
    }
}

const renderer = props => {
	if (props.total !== 0) {
	  return (
		<h4>
		  {props.hours}:{props.minutes}:{props.seconds}
		</h4>
	  );
	} else {
		return null;
	}
};
export default Event;

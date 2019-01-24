/* global playTone */
import React from 'react';
import { Panel, Button, Div } from '@vkontakte/vkui';
import Counter from '../Components/Countdown';
import '../Utils/simpleTones';
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
			isEnded: false,
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
		const keys = Object.keys(this.props.event.items);
		const key = keys[i];
		const event = this.props.event.items[key];
		if (key) {
			setTimeout(() => {
				this.setState({
					current: event,
				});
				if (event.sound) {
					if (event.sound.tone) {
						if (event.sound.duration && event.sound.modulation) {
							playTone(event.sound.tone, event.sound.modulation, parseInt(event.sound.duration, 10) / 1000);
						} else if (event.sound.duration) {
							playTone(event.sound.tone, null, parseInt(event.sound.duration, 10) / 1000);
						}
					}
				}
				this.changeColor(i + 1)
			}, parseInt(event.color.duration, 10));
		}

		if (i + 1 === keys.length) {
			setTimeout(() => {
				this.setState({
					isEnded: true,
				});
			}, parseInt(event.color.duration + 4000, 10))
		}
	}

    render () {
		return (
			<Panel id={this.props.id}>
				<Div className={`ColorScreen ${this.state.isEnded ? 'ColorScreen--End' : ''}`} style={{
					backgroundColor: this.state.current.color.color,
					transition: `background-color ${this.state.current.color.easing}`,
				}}>
					{/* {this.state.isEnded === false && <h3 style={{color: 'white', textAlign: 'center', marginTop: 100}}>{this.props.location ? this.props.location : 'No location data'}</h3>} */}
					{/* {this.state.willStart && <h3 style={{color: 'black', textAlign: 'center'}}>Событие скоро начнется <br/>{this.state.offset} <br/>{this.state.time}</h3>} */}

					<Div className={`EventEnded ${this.state.willStart || this.state.isEnded ? '' : 'EventEnded--hide'}`}>
						<div className='EventEndPic' />
						{this.state.willStart && <Counter time={this.state.offset + new Date().getTime()} renderer={renderer}/>}
						{this.state.isEnded && <h3 style={{color: 'black', textAlign: 'center'}}>Событие закончилось</h3>}
						<Div><Button size="l" stretched level="secondary" onClick={this.props.go} data-to='home'>Назад</Button></Div>
					</Div>
				</Div>
			</Panel>
		)
    }
}

const renderer = props => {
	if (props.total !== 0) {
		if (props.minutes > 0) {
			return (
				<h3 style={{color: 'black', textAlign: 'center'}}>До начала осталось {props.minutes} минут</h3>
			);
		} else {
			return (
				<h3 style={{color: 'black', textAlign: 'center'}}>До начала осталось менее минуты</h3>
			  );
		}
	
	} else {
		return null;
	}
};
export default Event;

import React from 'react';
import connect from '@vkontakte/vkui-connect';
import { View } from '@vkontakte/vkui';
import Home from './Panels/Home';
import Slides from './Panels/Slides';
import Event from './Panels/Event';
import EventsList from './Panels/EventsList';
import { ROUTES_VALUES, API_DOMAIN, API_ROUTES, ROUTES } from './config';
import '@vkontakte/vkui/dist/vkui.css';

const location = window.location.hash.substr(1);
const debug = location.split('/');

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activePanel: ~ROUTES_VALUES.indexOf(location) ? location : 'home',
			location: location ? location : false,
			fetchedUser: null,
			geodata: null,
			eventsList: [],
		};
	}

	componentDidMount() {
		connect.subscribe((e) => {
			if (e.detail.hasOwnProperty('type')) {
				switch (e.detail.type) {
					case 'VKWebAppGetUserInfoResult':
						this.setState({ fetchedUser: e.detail.data });
						break;
					case 'VKWebAppOpenQRResult':
						this.setState({ qrData: e.detail.data.qr_data });
						this.sendQRData(e.detail.data.qr_data);
						break;	
					case 'VKWebAppGeodataResult':
						this.setState({ 
							geodata: {
								lat: e.detail.data.lat,
								lng: e.detail.data.long
							}
						});
						break;
					default:
						break;
				}
			}
		});
		connect.send('VKWebAppGetUserInfo', {});
		connect.send('VKWebAppGetGeodata', {});
		connect.send("VKWebAppSetViewSettings", {action_bar_color: "#000"});

		if (debug[0] === 'debug' || debug[0] === 'eventdebug') {
			let debugLoc = debug;
			debugLoc.shift();
			this.sendQRData(debugLoc.join('/'), () => {
				this.go(null, ROUTES.EVENT + debug[1]);
			});
		} else if (this.state.location) {
			this.getEventData(this.state.location, () => {
				this.go(null, ROUTES.EVENT + this.state.location);
			});
		}

		// Mobyman API
		fetch(API_DOMAIN + API_ROUTES.INITIAL)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				if (data.firstLaunch) {
					this.go(null, ROUTES.SLIDES);
				}
			})
			.catch(error => console.error(error))
	}

	parseQRData(data) {
		let qrData = data.split('/');
		return `id=${qrData[0]}&x=${qrData[1]}&y=${qrData[2]}`;
	}

	sendQRData(data, cb) {
		const timer = roundTimeMinute().getTime();
		fetch(API_DOMAIN + API_ROUTES.QR + this.parseQRData(data) + '&desired_ts=' + timer)
			.then(response => response.json())
			.then(data => {
				this.setState({ event: data });
				this.go(null, ROUTES.EVENT + this.state.location);
			})
			.catch(error => console.error(error))
	}

	getEventData(data, cb) {
		const timer = roundTimeMinute().getTime();
		fetch(API_DOMAIN + API_ROUTES.GET_EVENT + data.replace(ROUTES.EVENT, '') + '&desired_ts=' + timer)
			.then(response => response.json())
			.then(data => {
				// data = _data;
				this.setState({ event: data });
				if (cb) {
					cb();
				}
			})
			.catch(error => console.error(error))
	}

	getEventsList = (data,) => {
		fetch(API_DOMAIN + API_ROUTES.GET_EVENTS_LIST)
			.then(response => response.json())
			.then(data => {
				this.setState({ eventsList: data });
				this.go(null, ROUTES.EVENTS_LIST);
			})
			.catch(error => console.error(error))
	}

	getQrCode = () => {
		connect.send("VKWebAppOpenQR");
	}

	setLocation = (route) => {
		if (route !== 'home') {
			connect.send('VKWebAppSetLocation', { location: route });
		} else {
			connect.send('VKWebAppSetLocation', { location: '' });
		}
	}

	goToEvent = (id) => {
		this.setState({
			location: id,
		});
		this.getEventData(id, () => {
			this.go(null, ROUTES.EVENT + id);
		});
	}

	go = (e, route) => {
		let panel = '';
		if (e) {
			panel = e.currentTarget.dataset.to;
		} else if (route) {
			panel = route;
		}
		this.setState({ activePanel: panel })
		this.setLocation(panel)
	};

	render() {
		return (
			<View activePanel={this.state.activePanel}>
				<Slides id={ROUTES.SLIDES} user={this.state.fetchedUser} geodata={this.state.geodata} go={this.go} />
				<Home id='home' goToEvent={this.goToEvent} user={this.state.fetchedUser} qrData={this.state.qrData} go={this.go} getQR={this.getQrCode} getEvents={this.getEventsList} />
				<Event id={`event${this.state.location}`} location={this.state.location} event={this.state.event} go={this.go} getQR={this.getQrCode} />
				<EventsList goToEvent={this.goToEvent} id={ROUTES.EVENTS_LIST} user={this.state.fetchedUser} geodata={this.state.geodata} go={this.go} events={this.state.eventsList} />
			</View>
		);
	}
}

const roundTimeMinute = () => {
	var time = 1000 * 60;
	var date = new Date();
	var rounded;
	if (date.getSeconds() < 30) {
		rounded = new Date(Math.round((date.getTime() + 30000) / time) * time);
	} else {
		rounded = new Date(Math.round(date.getTime() / time) * time);
	}

    return rounded;
}

export default App;

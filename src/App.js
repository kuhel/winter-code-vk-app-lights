import React from 'react';
import connect from '@vkontakte/vkui-connect';
import { View } from '@vkontakte/vkui';
import Home from './Panels/Home';
import Slides from './Panels/Slides';
import Event from './Panels/Event';
import { ROUTES_VALUES, API_DOMAIN, API_ROUTES, ROUTES } from './config';
import '@vkontakte/vkui/dist/vkui.css';
// let _data = {
//     "ts": 1548344617,
//     "items": {
//         "0": {
//             "color": {
//                 "enabled": true,
//                 "color": "#FFFFFF",
//                 "duration": 1000,
//                 "easing": "600ms cubic-bezier(0.445, 0.05, 0.55, 0.95)"
//             },
//             "sound": {
//                 "enabled": true,
//                 "tone": "Dm",
//                 "duration": 1000
//             }
//         },
//         "5000": {
//             "color": {
//                 "enabled": true,
//                 "color": "#0030ff",
//                 "duration": 1000,
//                 "easing": "600ms cubic-bezier(0.445, 0.05, 0.55, 0.95)"
//             },
//             "sound": {
//                 "enabled": true,
//                 "tone": "Dm",
//                 "duration": 1000
//             }
//         },
//         "10000": {
//             "color": {
//                 "enabled": true,
//                 "color": "#ff0f0f",
//                 "duration": 1000,
//                 "easing": "600ms cubic-bezier(0.445, 0.05, 0.55, 0.95)"
//             },
//             "sound": {
//                 "enabled": true,
//                 "tone": "Dm",
//                 "duration": 1000
//             }
//         }
//     }
// };

const location = window.location.hash.substr(1);

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activePanel: ~ROUTES_VALUES.indexOf(location) ? location : 'home',
			location: location ? location : false,
			fetchedUser: null,
			geodata: null,
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

		if (this.state.location) {
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

	goToEvent = (e) => {
		this.setState({
			location: '5c49a2efd675577be34cd40b',
		});
		// this.setState({ event: _data });
		// this.go(null, 'event5c49a2efd675577be34cd40b');
		this.getEventData('event5c49a2efd675577be34cd40b', () => {
			this.go(null,'event5c49a2efd675577be34cd40b');
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
				<Slides id="slides" user={this.state.fetchedUser} geodata={this.state.geodata} go={this.go} />
				<Home id="home" goToEvent={this.goToEvent} user={this.state.fetchedUser} qrData={this.state.qrData}  go={this.go} getQR={this.getQrCode}/>
				<Event id={`event${this.state.location}`} location={this.state.location} event={this.state.event} go={this.go} getQR={this.getQrCode}/>
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

import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Group, Gallery, View, Button, Div } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import './Home.css';
import Icon24Camera from '@vkontakte/icons/dist/24/camera';
import Icon24List from '@vkontakte/icons/dist/24/list';

class Home extends React.Component {

    constructor (props) {

		super(props);

		this.state = {
			slideIndex: 0
		}
    }

    render () {
		return (
			<Panel id={this.props.id}>
				<Div className='MainScreen'>
					<h3 onClick={this.props.goToEvent} style={{color: 'white', textAlign: 'center', marginTop: 100}}>{this.props.qrData ? this.props.qrData : 'Click here'}</h3>
					<Div className="MainScreen__Buttons">
						<Button onClick={this.props.getQR} before={<Icon24Camera fill="rgba(255,255,255,0.75)"/>} size="l" level="tertiary" />

						<Button before={<Icon24List fill="rgba(255,255,255,0.75)"/>} size="l" level="tertiary" />
					</Div>
				</Div>
			</Panel>
		)
    }
}
export default Home;

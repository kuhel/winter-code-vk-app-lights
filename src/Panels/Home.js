import React from 'react';
import { Panel, Button, Div } from '@vkontakte/vkui';
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
			<Panel id={this.props.id} className='NoPadding'>
				<Div className='MainScreen'>
					{/* <h1 onClick={this.props.goToEvent} style={{ fontSize: '96px', color: 'white', textAlign: 'center', marginTop: 100, paddingLeft: 20, paddingRight: 20}}>{this.props.qrData ? this.props.qrData : 'Click here'}</h1> */}
					<Div className="MainScreen__Buttons">
						<Button onClick={this.props.getQR} before={<Icon24Camera fill="rgba(255,255,255,0.75)"/>} size="l" level="tertiary" />

						<Button onClick={this.props.getEvents} before={<Icon24List fill="rgba(255,255,255,0.75)"/>} size="l" level="tertiary" />
					</Div>
				</Div>
			</Panel>
		);
    }
}
export default Home;

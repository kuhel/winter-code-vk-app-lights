import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Group, Gallery, View, Button, Div } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import './Slides.css';

class Slides extends React.Component {

    constructor (props) {

      super(props);

      this.state = {
        slideIndex: 0
      }
    }

    render () {
      return (
        <Panel id={this.props.id}>
          <Gallery
            slideWidth="100%"
            style={{ height: '100vh' }}
            bullets="dark"
            align="center"
          >
            <div className="SlideItem" style={{ backgroundColor: 'goldenrod' }}>
              <figure>
                <img src="https://vk.com/images/pics/notifications/banner/84_750x224.png?1" alt=""/>
              </figure>
              <h1>Пипупи приложение</h1>
            </div>
                    <div className="SlideItem" style={{ backgroundColor: 'coral' }}>
              <figure>
                <img src="https://vk.com/images/pics/notifications/banner/84_750x224.png?1" alt=""/>
              </figure>
              <h1>Выкрути вспышку на максимум</h1>
            </div>
                    <div className="SlideItem" style={{ backgroundColor: 'deepskyblue' }}>
              <figure>
                <img src="https://vk.com/images/pics/notifications/banner/84_750x224.png?1" alt=""/>
              </figure>
              <h1>Используй кнопки по назначению</h1>
            </div>
          </Gallery>
          <Div className='SkipBtn'>
            <Button size="l" stretched level="secondary" onClick={this.props.go} data-to='home'>Пропустить</Button>
          </Div>
      </Panel>
      )
    }
  }
export default Slides;

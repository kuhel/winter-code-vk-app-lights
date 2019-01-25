import React from 'react';
import { Panel, Button, Div, HeaderButton, PanelHeader, Search, List, Cell, osname, IOS, ANDROID } from '@vkontakte/vkui';
import { ROUTES } from '../config';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Search from '@vkontakte/icons/dist/24/search';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import '@vkontakte/vkui/dist/vkui.css';
import './Slides.css';

  class HeaderSearch extends React.Component {

    constructor (props) {
      super(props);
      this.state = {
        search: ''
      }
    }

    getEvents = () => {
      const search = this.state.search.toLowerCase();
      return this.props.events.filter(({title}) => ~title.toLowerCase().indexOf(search));
    }

    onChange = (search) => this.setState({ search });

    render () {
      return (
        <div>
          <PanelHeader
            left={<HeaderButton onClick={() => this.props.go(null, 'home')}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
            right={osname === ANDROID && <HeaderButton onClick={() => this.props.go(null, 'home')}><Icon24Search /></HeaderButton>}
          >
            <Search
              theme="header"
              value={this.state.search}
              onChange={this.onChange}
            />
          </PanelHeader>
          <List>
            {this.getEvents().map((event) => (
              <Cell
                key={event.id}
                onClick={() => this.props.goToEvent(event.id)}
              >{event.title}</Cell>
            ))}
          </List>
        </div>
      );
    }
  }

  const EventsList = ({ events, goToEvent, go }) => {
    return (
      <Panel id={ROUTES.EVENTS_LIST}>
          <HeaderSearch goToEvent={goToEvent} events={events} go={go} />
        </Panel>
    );
  }
export default EventsList;

import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';

import Appointment from '../components/Appointment';

it('renders without crashing', () => {
  shallow(<Appointment />);
});

describe('render', () => {
  it('should display the appointment title', () => {
    const appointment = mount(
      <Router>
        <Appointment
          appointment={{ id: 1, title: 'Team standup', appt_time: new Date() }}
        />
      </Router>
    );
    const title = <h3>Team standup</h3>;
    expect(appointment.contains(title)).toEqual(true);
  });

  it('should display the appointment time', () => {
    const appointment = mount(
      <Router>
        <Appointment
          appointment={{
            id: 1,
            title: 'Team standup',
            appt_time: new Date('04/11/2017, 12:00:00')
          }}
        />
      </Router>
    );
    const appt_time = <p>April 11 2017, 12:00:00 pm</p>;
    expect(appointment.contains(appt_time)).toEqual(true);
  });

  it('renders Appointment correctly', () => {
    const appointment = renderer.create(
      <Router>
        <Appointment
          appointment={{
            id: 1,
            title: 'Team standup',
            appt_time: new Date('04/11/2017, 12:00:00')
          }}
        />
      </Router>
    );
    let tree = appointment.toJSON();
    expect(tree).toMatchSnapshot();
  });
});


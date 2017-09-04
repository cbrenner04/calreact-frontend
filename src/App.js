import React, { Component } from 'react';
import logo from './logo.svg';
import $ from 'jquery';
import PropTypes from 'prop-types';

import './App.css';

class App extends Component {
  static propTypes = {
    appointments: PropTypes.array
  }

  static defaultProps = {
    appointments: []
  }

  constructor(props) {
    super(props);
    this.state = {
      appointments: props.appointments,
    }
  }

  componentDidMount() {
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/appointments',
    }).done((data) => {
      console.log(data);
      this.setState({
        appointments: data,
      })
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="App-intro">
          {
            this.state.appointments.map((appointment) => {
              return (
                <p key={appointment.id}>{appointment.title}</p>
              )
            })
          }
        </div>
      </div>
    );
  }
}

export default App;

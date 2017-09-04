import React, {Component} from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import $ from 'jquery';

import AppointmentForm from './AppointmentForm';
import {AppointmentList} from './AppointmentList';

export default class Appointments extends Component {
  static propTypes = {
    appointments: PropTypes.array.isRequired
  }

  static defaultProps = {
    appointments: []
  }

  constructor(props, _railsContext) {
    super(props)
    this.state = {
      appointments: this.props.appointments
    }
  }

  componentDidMount() {
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/appointments/",
      dataType: "JSON"
    }).done((data) => {
      this.setState({appointments: data})
    })
  }

  addNewAppointment = (appointment) => {
    const appointments =
      update(this.state.appointments, { $push: [appointment] })
    this.setState({
      appointments: appointments.sort(function(a, b) {
        return new Date(a.appt_time) - new Date(b.appt_time)
      })
    })
  }

  render() {
    return (
      <div>
        <AppointmentForm handleNewAppointment={ this.addNewAppointment } />
        <AppointmentList appointments={ this.state.appointments } />
      </div>
    )
  }
}

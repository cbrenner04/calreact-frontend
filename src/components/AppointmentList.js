import React from 'react';
import PropTypes from 'prop-types';

import Appointment from './Appointment';

export const AppointmentList = ({ appointments }) =>
  <div>
    { appointments.map(function(appointment) {
      return (
        <Appointment appointment={ appointment } key={ appointment.id } />
      )
    }) }
  </div>

AppointmentList.propTypes = {
    appointments: PropTypes.array.isRequired
}

AppointmentList.defaultProps = {
    appointments: []
}

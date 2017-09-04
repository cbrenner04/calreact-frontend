import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';

import {formatDate} from '../utils/format';

export default class Appointment extends Component {
  constructor (props) {
    super(props)
    this.state = {
        appointment: props.appointment
    }
  }

  static propTypes = {
    appointment: PropTypes.object.isRequired
  }

  static defaultProps = {
    appointment: {}
  }

  componentDidMount() {
    if (this.props.match && sessionStorage.getItem('user')) {
      $.ajax({
        type: "GET",
        url: `http://localhost:3000/appointments/${this.props.match.params.id}`,
        dataType: "JSON",
        headers: JSON.parse(sessionStorage.getItem('user')),
      }).done((data) => {
        this.setState({appointment: data})
      })
    }
  }

  render() {
    return (
        <div className='appointment'>
          <Link to={ `/appointments/${this.state.appointment.id}` }>
              <h3>{ this.state.appointment.title }</h3>
          </Link>
          <p>{ formatDate(this.state.appointment.appt_time) }</p>
          <Link to={ `/appointments/${this.state.appointment.id}/edit` }>
            Edit
          </Link>
        </div>
    )
  }
}

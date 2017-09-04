import React, {Component} from 'react';
import update from 'immutability-helper';
import Datetime from 'react-datetime';
import moment from 'moment';
import PropTypes from 'prop-types';
import $ from 'jquery';
import './react-datetime.css';

import Label from './Label';
import {validations} from '../utils/validations';
import {FormErrors} from './FormErrors';

export default class AppointmentForm extends Component {
  static propTypes = {
    handleNewAppointment: PropTypes.func,
    editing: PropTypes.bool
  }

  static formValidations = {
    title: [
      (s) => { return validations.checkMinLength(s, 3) }
    ],
    appt_time: [
      (t) => { return validations.timeShouldBeInTheFuture(t) }
    ]
  }

  constructor(props, _railsContext) {
    super(props)
    this.state = {
      title: { value: '', valid: false },
      appt_time: { value: new Date(), valid: false},
      formErrors: {},
      formValid: false,
      editing: false
    }
  }

  componentDidMount() {
    if (this.props.match) {
      $.ajax({
        type: "GET",
        url: `http://localhost:3000/appointments/${this.props.match.params.id}`,
        dataType: "JSON"
      }).done((data) => {
        this.setState({
          title: { value: data.title, valid: true },
          appt_time: { value: data.appt_time, valid: true },
          editing: this.props.match.path === '/appointments/:id/edit'
        })
      })
    }
  }

  handleUserInput = (fieldName, fieldValue, validations) => {
    const newFieldState = update(this.state[fieldName],
                                 { value: { $set: fieldValue} })
    this.setState({ [fieldName]: newFieldState },
                    () => { this.validateField(fieldName, fieldValue, validations) });
  }

  validateField(fieldName, fieldValue, validations) {
    let fieldValid;
    let fieldErrors = validations.reduce((errors, v) => {
      let e = v(fieldValue);
      if (e !== '') {
        errors.push(e);
      }
      return errors;
    }, [])

    fieldValid = fieldErrors.length === 0;
    const newFieldState = update(this.state[fieldName],
                                 { valid: { $set: fieldValid } });
    const newFormErrors = update(this.state.formErrors,
                                 { $merge: { [fieldName]: fieldErrors } });
    this.setState({
      [fieldName]: newFieldState,
      formErrors: newFormErrors
    }, this.validateForm)
  }

  validateForm() {
    this.setState({
      formValid: this.state.title.valid && this.state.appt_time.valid
    })
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.state.editing ? this.updateAppointment() : this.addAppointment();
  }

  addAppointment() {
    const appointment = {
      title: this.state.title.value,
      appt_time: this.state.appt_time.value
    }
    $.post('http://localhost:3000/appointments', { appointment: appointment })
      .done((data) => {
        this.props.handleNewAppointment(data);
        this.resetState();
      })
      .fail((response) => {
        this.setState({
          formErrors: response.responseJSON,
          formValid: false
        });
      });
  }

  updateAppointment() {
    const appointment = {
      title: this.state.title.value,
      appt_time: this.state.appt_time.value
    }
    $.ajax({
      type: "PATCH",
      url: `http://localhost:3000/appointments/${this.props.match.params.id}`,
      data: { appointment: appointment }
    }).done((data) => {
      console.log('appointment updated!');
      this.resetState();
    }).fail((response) => {
      this.setState({
        formErrors: response.responseJSON,
        formValid: false
      });
    });
  }

  resetState() {
    this.setState({
      title: { value: '', valid: false },
      appt_time: { value: new Date(), valid: false},
      formErrors: {},
      formValid: false
    });
  }

  focus = () => {
    this.titleInput.focus();
  }

  handleChange = (e) => {
    const fieldName = this.titleInput.name;
    const fieldValue = this.titleInput.value;
    this.handleUserInput(
      fieldName,
      fieldValue,
      AppointmentForm.formValidations[fieldName]
    );
  }

  setApptTime = (e) => {
    const fieldName = 'appt_time';
    const fieldValue = e.toDate();
    this.handleUserInput(
      fieldName,
      fieldValue,
      AppointmentForm.formValidations[fieldName]
    );
  }

  deleteAppointment = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm("Are you sure you want to delete this?")) {
      $.ajax({
        type: "DELETE",
        url: `http://localhost:3000/appointments/${this.props.match.params.id}`
      }).done((data) => {
        this.props.history.push('/');
      }).fail((response) => {
        console.log('appointment deleting failed');
      });
    }
  }

  render() {
    const inputProps = {
      name: 'appt_time'
    }

    return (
      <div>
        <h2>
          { this.state.editing ? 'Edit Appointment' : 'Make a new Appointment' }
        </h2>
        <FormErrors formErrors={ this.state.formErrors } />
        <Label label='Enter a title, date and time' />
        <form onSubmit={ this.handleFormSubmit }>
          <input name='title'
                 ref={ (input) => { this.titleInput = input } }
                 placeholder='Appointment Title'
                 value={ this.state.title.value }
                 onChange={ this.handleChange } />
          <input type="button"
                 value="Focus the title input"
                 onClick={ this.focus } />
          <Datetime input={ false }
                    open={ true }
                    inputProps={ inputProps }
                    value={ moment(this.state.appt_time.value) }
                    onChange={ this.setApptTime } />
          <input type='submit'
                 value={ this.state.editing ? 'Update Appointment' : 'Make Appointment' }
                 className='submit-button'
                 disabled={ !this.state.formValid } />
        </form>
        {
          this.state.editing && (
            <p>
              <button onClick={ this.deleteAppointment }>
                Delete appointment
              </button>
            </p>
          )
        }
      </div>
    )
  }
}

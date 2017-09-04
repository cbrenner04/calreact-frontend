import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import $ from 'jquery';

export default class AppHeader extends Component {
    componentDidMount() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/auth/validate_token',
            dataType: 'JSON',
            headers: JSON.parse(sessionStorage.getItem('user')),
        }).fail((data) => {
            this.props.history.push('/login');
        })
    }

    handleSignOut = (event) => {
        event.preventDefault();
        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:3000/auth/sign_out',
            data: JSON.parse(sessionStorage.getItem('user')),
        }).done(() => {
            sessionStorage.removeItem('user');
            this.props.history.push('/login');
        });
    }

    render() {
        if (sessionStorage.getItem('user')) {
            return (
                <div>
                    {JSON.parse(sessionStorage.getItem('user')).uid}
                    <a href="#" onClick={this.handleSignOut}>Sign out</a>
                    <Link to="/">
                        <h1>CalReact</h1>
                    </Link>
                </div>
            );
        } else {
           return (
               <Redirect to='/login' />
           );
        }
    }
}

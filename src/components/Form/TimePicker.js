import React, { Component } from 'react';
import TimePicker from 'react-times';

import 'react-times/css/material/default.css';

class Time extends Component {
    constructor(props) {
        super(props);
        let { value } = this.props;

        if (typeof value === 'undefined' || value === '') {
            value = '01:00';
        }

        this.state = {
            time: value
        };
    }

    handleTimeChange = time => {
        const { name, inputChangeEvent } = this.props;
        const { hour, minute } = time;
        this.setState(() => ({ time: `${hour}:${minute}` }));
        const e = { target: { name, value: `${hour}:${minute}` } };
        inputChangeEvent(e);
    };

    render() {
        const { label, name, parentClass } = this.props;
        let { required } = this.props;
        const { time } = this.state;
        console.log('rerender');
        if (required) {
            required = <span className="form__required">* (required)</span>;
        }

        return (
            <div className={parentClass}>
                <label htmlFor={name}>
                    {label}
                    {required}
                </label>

                <TimePicker time={time} onTimeChange={e => this.handleTimeChange(e)} />
            </div>
        );
    }
}

export default Time;

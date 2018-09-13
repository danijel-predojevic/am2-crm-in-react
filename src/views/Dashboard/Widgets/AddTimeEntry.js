import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import moment from 'moment';
import WP_API from '../../../data/Api';
import Time from '../../../components/Form/TimePicker';
import Text from '../../../components/Form/Text';
import Select from '../../../components/Form/Select';
import Textarea from '../../../components/Form/Textarea';
import DatePicker from '../../../components/Form/DatePicker';
import Notification from '../../../components/Form/Notification';

class AddTime extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: moment().format('DD/MM/YYYY'),
            time: '01:00',
            billable_hours: '01:00',
            project_id: '',
            job_type: 'Dev',
            asana_url: '',
            comment: '',
            status: false
            //     status: false
        };
    }

    inputChangeEvent = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
        if (name === 'time') {
            this.setState({ billable_hours: value });
        }
        console.log(this.state);
    };

    closeNotification = () => {
        this.setState(() => ({ status: false }));
    };

    addUserEntry = () => {
        console.log(this.state);

        const api = new WP_API();
        api.setPost('time-entry', '', this.state);
        api.set().then(result => {
            if (result.success === true) {
                this.setState(() => ({ status: 'success' }));
            } else {
                this.setState(() => ({ status: 'error' }));
                console.log('Something went wrong!');
            }
        });
    };

    render() {
        const { projects } = this.props;
        const {
            date,
            time,
            billable_hours, // eslint-disable-line camelcase
            project_id, // eslint-disable-line camelcase
            job_type, // eslint-disable-line camelcase
            asana_url, // eslint-disable-line camelcase
            comment,
            status
        } = this.state;

        const jobType = [
            { id: '2', title: 'Dev' },
            { id: '0', title: 'PM' },
            { id: '1', title: 'Web Design' },
            { id: '13', title: 'Graphic Design' },
            { id: '3', title: 'Personal development' },
            { id: '4', title: 'Administration' },
            { id: '5', title: 'Meeting (client)' },
            { id: '6', title: 'Meeting (internal)' },
            { id: '7', title: 'Team Management' },
            { id: '8', title: 'QA' },
            { id: '9', title: 'Support' },
            { id: '10', title: 'Preparing quote' },
            { id: '11', title: 'Content Transfer' },
            { id: '12', title: 'Junior Training' }
        ];

        const inputs = [
            {
                type: Select,
                name: 'project_id',
                label: 'Project',
                placeholder: 'Select Project',
                list: projects,
                required: true,
                value: project_id,
                parentClass: 'form__column col-1 form__row'
            },
            {
                type: DatePicker,
                name: 'date',
                label: 'Date',
                value: date,
                required: true,
                parentClass: 'form__column col-1 form__row'
            },
            {
                type: Time,
                name: 'time',
                label: 'Hours of Work',
                required: true,
                value: time,
                parentClass: 'form__column col-1 form__row'
            },
            {
                type: Time,
                name: 'billable_hours',
                label: 'Billable Hours',
                required: true,
                value: billable_hours,
                parentClass: 'form__column col-1 form__row'
            },
            {
                type: Select,
                name: 'job_type',
                label: 'Job Type',
                placeholder: 'Select Work Type',
                required: true,
                value: job_type,
                list: jobType,
                parentClass: 'form__column col-1 form__row'
            },
            {
                type: Text,
                name: 'asana_url',
                label: 'Asana URL',
                required: true,
                value: asana_url,
                parentClass: 'form__column col-1 form__row'
            },
            {
                type: Textarea,
                name: 'comment',
                label: 'Comment',
                rows: '4',
                required: true,
                value: comment,
                parentClass: 'form__column col-1 form__row'
            }
        ];
        // Notification Text
        let msgText = 'Entry Added!';
        if (status === 'error') {
            msgText = 'Upss.. something went wrong! Check with Goran.';
        }
        return (
            <ReactCSSTransitionGroup
                component="div"
                className="section col-14 widget widget"
                transitionAppear
                transitionName="loadComponent"
                transitionEnterTimeout={600}
                transitionLeaveTimeout={300}
                transitionAppearTimeout={0}
            >
                <header className="section__header">
                    <h4 className="section__title">Add New Time Entry</h4>
                </header>
                <div className="section__content">
                    <div className="widget">
                        <form className="form">
                            {status ? (
                                <Notification
                                    text={msgText}
                                    type={status}
                                    close={this.closeNotification}
                                />
                            ) : (
                                ''
                            )}
                            <div className="form__row">
                                {inputs.map(field => (
                                    <field.type
                                        key={field.name}
                                        label={field.label}
                                        name={field.name}
                                        parentClass={field.parentClass}
                                        required={field.required}
                                        value={field.value}
                                        list={field.list}
                                        rows={field.rows}
                                        className="form__input"
                                        placeholder={field.placeholder}
                                        inputChangeEvent={this.inputChangeEvent}
                                    />
                                ))}
                            </div>
                            <button
                                type="button"
                                className="button button--primary button--custom"
                                onClick={this.addUserEntry}
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </ReactCSSTransitionGroup>
        );
    }
}

export default AddTime;

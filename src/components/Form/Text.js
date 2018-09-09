import React from 'react';

export default props => {
    const { label, name, parentClass, value, inputChangeEvent, propType } = props;
    let { required, className = 'form__input' } = props;
    let type = 'text';

    if (required) {
        className += ' validate';
        required = <span className="form__required">* (required)</span>;
    }
    if (propType) {
        type = propType;
    }

    return (
        <div className={parentClass}>
            <label htmlFor={name}>
                {label}
                {required}
            </label>
            <input
                required
                name={name}
                id={name}
                type={type}
                className={className}
                value={value}
                onChange={inputChangeEvent}
            />
        </div>
    );
};

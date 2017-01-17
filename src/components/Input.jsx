import React from 'react';

const Input = (props = {}) => {
  return (
    <div>
      <label htmlFor={props.label}>
        <input type={props.type} name={props.label} value={props.value} onChange={props.onChange} />
      </label>
    </div>
  );
};

Input.propTypes = {
  label: React.PropTypes.string,
  pristine: React.PropTypes.bool,
  valid: React.PropTypes.bool,
  message: React.PropTypes.string,
};

export default Input;

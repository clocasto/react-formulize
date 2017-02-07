import React from 'react';

const Input = props => (
  <label htmlFor={props.label}>
    <input
      checked={props.checked}
      type={props.type}
      name={props.label}
      value={props.value}
      onChange={props.onChange}
    />
  </label>
);

Input.propTypes = {
  label: React.PropTypes.string,
  onChange: React.PropTypes.func,
  type: React.PropTypes.string,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.bool,
  ]),
  checked: React.PropTypes.bool,
};

Input.defaultProps = {
  label: '',
  onChange: undefined,
  type: 'text',
  value: '',
  checked: false,
};

export default Input;

import React from 'react';

const Input = props => (
  <input
    type={props.type}
    name={props.label}
    value={props.value}
    onChange={props.onChange}
  />);

Input.propTypes = {
  type: React.PropTypes.string,
  label: React.PropTypes.string,
  value: React.PropTypes.string,
  onChange: React.PropTypes.func,
};

export default Input;

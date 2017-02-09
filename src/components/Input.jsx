import React from 'react';

const Input = props => (
  <label htmlFor={props.name}>
    <input
      checked={props.checked}
      type={props.type}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
    />
  </label>
);

Input.propTypes = {
  name: React.PropTypes.string,
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
  name: null,
  onChange: null,
  type: 'text',
  value: '',
  checked: false,
};

export default Input;

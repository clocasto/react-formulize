import React from 'react';

const Input = (props = {}) => {
  return (
    <div>
      <label htmlFor={props.label}>
        <input checked={props.checked} type={props.type} name={props.label} value={props.value} onChange={props.onChange} />
      </label>
    </div>
  );
};

Input.propTypes = {
  label: React.PropTypes.string,
  onChange: React.PropTypes.func,
  type: React.PropTypes.string,
  value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number, React.PropTypes.bool]),
  checked: React.PropTypes.bool,
};

export default Input;

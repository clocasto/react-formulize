import React from 'react';
import Input from './Input';

const Field = (InputComponent = Input) => {
  const RawFieldComponent = (props) => {
    return (
      <div>
        <label htmlFor={props.label}>
          <InputComponent {...props} />
        </label>
      </div>
    );
  };

  RawFieldComponent.propTypes = {
    label: React.PropTypes.string,
    pristine: React.PropTypes.bool,
    valid: React.PropTypes.bool,
    message: React.PropTypes.string,
  };

  return RawFieldComponent;
};

export default Field;

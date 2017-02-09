import React from 'react';
import { Field } from '../../dist';

// Updates first input in `DOM` wrapper with given `value` and `type`
export function updateInput(DOM, value = '', type = 'text') {
  DOM.find('input').simulate('change', { target: { value }, type });
}

export function buildField(mountingFunction, validator, value, type) {
  const validatorToObj = {
    [validator]: value,
  };
  return mountingFunction(<Field {...validatorToObj} type={type} />);
}

export function simulateChange(wrapper, value) {
  return wrapper.find('input').simulate('change', { target: { value } });
}

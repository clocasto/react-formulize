import React from 'react';
import { Form, Field, Input } from '../../dist';

// Updates first input in `DOM` wrapper with given `value` and `type`
export function updateInput(DOM, value = '', type = 'text') {
  DOM.find('input').simulate('change', { target: { value }, type });
}

export function buildField(mountingFunction, validator, value, type) {
  const _validator = {
    [validator]: value,
  };
  return mountingFunction(<Field {..._validator} type={type}/>)
}

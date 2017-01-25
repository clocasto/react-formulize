import React from 'react';
import { Form, Field, Input } from '../dist';

export function updateInput(DOM, value = '', type = 'text') {
  DOM.find('input').simulate('change', { target: { value }, type });
}

export function buildField(mountingFunction, validator, value) {
  const _validator = {
    [validator]: value,
  };
  return mountingFunction(<Field {..._validator}/>)
}

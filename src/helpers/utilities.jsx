import React from 'react';
import * as validatorFunctions from './validators';

export function assembleValidators({
  email,
  length,
  required,
  match,
  alpha,
  number,
  max,
  min,
  custom,
}) {
  const validators = {};
  if (email) { validators.email = validatorFunctions.email(email === true ? undefined : email); }
  if (Array.isArray(length)) { validators.length = validatorFunctions.length(length); }
  if (required) { validators.required = validatorFunctions.required(); }
  if (match) { validators.match = validatorFunctions.match(match); }
  if (alpha) { validators.alpha = validatorFunctions.alpha(); }
  if (number) { validators.numeric = validatorFunctions.numeric(); }
  if (Number(max) >= 0) { validators.max = validatorFunctions.max(max); }
  if (Number(min) >= 0) { validators.min = validatorFunctions.min(min); }
  if (typeof custom === 'function') validators.custom = custom;
  return validators;
}

export function updateValidators(config, validators) {
  return Object.assign({}, validators, assembleValidators(config));
}

export function isValid(value, validators) {
  return validators.reduce((status, validator) => {
    if (!status) return false;
    return validator(value);
  }, true);
}

export function buildStateForField(fieldProps) {
  const { value, valid, pristine } = fieldProps;
  const newState = { value: '', valid: false, pristine: true };

  if (value !== undefined) Object.assign(newState, { value });
  if (valid !== undefined) Object.assign(newState, { valid });
  if (pristine !== undefined) Object.assign(newState, { pristine });
  return newState;
}

export function addFieldsToState(component, child, mounted = false) {
  if (typeof child.type === 'function' && child.type.name === 'Field') {
    const name = child.props.name;
    const fieldState = buildStateForField(child.props);
    if (mounted) {
      component.setState({
        [name]: fieldState,
      });
    } else {
      component.state[name] = fieldState; // eslint-disable-line
    }
  } else if (child.props && child.props.children) {
    React.Children.forEach(child.props.children,
      nextChild => addFieldsToState(component, nextChild, mounted));
  }
}

export function getValuesOf(obj = {}) {
  return Object.keys(obj).map(key => obj[key]);
}

export function makeFieldProps(child, onChange, state) {
  if (typeof child.type === 'function' && child.type.name === 'Field') {
    const name = child.props.name;
    return { name, onChange, key: name, value: state[name] ? state[name].value : null };
  }
  return null;
}

export function mapPropsToChild(child, childPropsMap) {
  const type = (typeof child.type === 'function') ? child.type.name : child.type;
  const childProps = {};

  if (childPropsMap.valid && child.props.valid) {
    Object.assign(childProps, childPropsMap.valid);
  }
  if (childPropsMap.pristine && child.props.pristine) {
    Object.assign(childProps, childPropsMap.pristine);
  }
  if (childPropsMap.Field && type === 'Field') {
    return React.cloneElement(child, childPropsMap.Field(child));
  }
  if (childPropsMap.input && type === 'input') {
    return React.cloneElement(child, childPropsMap.input(child));
  }
  if (child.props && child.props.children) {
    const newChildren = React.Children.map(child.props.children, nestedChild => (
      mapPropsToChild(nestedChild, childPropsMap)));
    return React.cloneElement(child, childProps, newChildren);
  }
  return child;
}

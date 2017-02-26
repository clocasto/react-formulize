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

export function getValuesOf(obj = {}) {
  return Object.keys(obj).map(key => obj[key]);
}

export function buildStateForField(fieldProps) {
  const { value } = fieldProps;
  const newState = {
    value: '',
    valid: isValid(value, getValuesOf(assembleValidators(fieldProps))),
    pristine: true,
  };

  if (value !== undefined) Object.assign(newState, { value });
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

export function makeFieldProps(child, onChange, state) {
  if (typeof child.type === 'function' && child.type.name === 'Field') {
    const name = child.props.name;
    const props = { name, onChange, key: name, value: state[name] ? state[name].value : null };

    if (child.props.value !== undefined) props.passedValue = child.props.value;

    return props;
  }
  return null;
}

export function makePropsForStatus(status, state) {
  return Object.keys(state).reduce((props, field) => {
    if (Object.prototype.hasOwnProperty.call(state[field], status)) {
      return { ...props, [`${field}_${status}`]: state[field][status] };
    }
    return props;
  }, {});
}

export function mapPropsToChild(child, childPropsMap) {
  const type = (typeof child.type === 'function') ? child.type.name : child.type;
  const childProps = {};
  let newChildren;

  if (child.props) {
    if (childPropsMap.valid && child.props.valid) {
      Object.assign(childProps, childPropsMap.valid());
    }
    if (childPropsMap.pristine && child.props.pristine) {
      Object.assign(childProps, childPropsMap.pristine());
    }
    if (childPropsMap.input && (type === 'input' || child.props.input)) {
      Object.assign(childProps, childPropsMap.input(child));
    }
    if (childPropsMap.field && (type === 'Field' || child.props.field)) {
      Object.assign(childProps, childPropsMap.Field(child));
    }
    if (child.props.children) {
      newChildren = React.Children
        .map(child.props.children, nestedChild => mapPropsToChild(nestedChild, childPropsMap));
    }
  }

  return (Object.keys(childProps).length || newChildren) ?
    React.cloneElement(child, childProps, newChildren) : child;
}

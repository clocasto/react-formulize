import * as validatorFunctions from './validators';

export function assembleValidators({ email, length, required, match, alpha, number, max, min, custom }) {
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

export function onChange(changeInfo) {
  const { label: field, value, status, pristine } = changeInfo;

  this.setState({
    [field]: { value, status, pristine },
  });
};

export function addFieldToState(field) {
  if (!field) return;

  if (Array.isArray(field)) {
    field.forEach(_name => this.addFieldToState(_name));
  } else if (typeof field === 'string') {
    this.state[field] = { value: '', valid: false, pristine: false };
  } else if (typeof field === 'object') {
    const { label: _name, value, valid, pristine } = field;
    const _state = { value: '', valid: false, pristine: false };

    if (value !== undefined) Object.assign(_state, { value });
    if (valid !== undefined) Object.assign(_state, { valid });
    if (pristine !== undefined) Object.assign(_state, { pristine });

    this.state[_name] = _state;
  }
};

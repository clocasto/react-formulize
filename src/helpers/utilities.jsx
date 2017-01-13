import * as validatorFunctions from './validators.jsx';

export function assembleValidators({ email, length, required, match, alpha, number, max, min }) {
  const validators = {};
  if (email) { validators.email = validatorFunctions.email(email === true ? undefined : email); }
  if (length) { validators.length = validatorFunctions.length(length); }
  if (required) { validators.required = validatorFunctions.required(); }
  if (match) { validators.match = validatorFunctions.match(match); }
  if (alpha) { validators.alpha = validatorFunctions.alpha(); }
  if (number) { validators.numeric = validatorFunctions.numeric(); }
  if (max) { validators.max = validatorFunctions.max(max); }
  if (min) { validators.min = validatorFunctions.min(min); }
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

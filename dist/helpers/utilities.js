'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.assembleValidators = assembleValidators;
exports.updateValidators = updateValidators;
exports.isValid = isValid;
exports.onChange = onChange;
exports.addFieldToState = addFieldToState;
exports.getValuesOf = getValuesOf;

var _validators = require('./validators');

var validatorFunctions = _interopRequireWildcard(_validators);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function assembleValidators(_ref) {
  var email = _ref.email,
      length = _ref.length,
      required = _ref.required,
      match = _ref.match,
      alpha = _ref.alpha,
      number = _ref.number,
      max = _ref.max,
      min = _ref.min,
      custom = _ref.custom;

  var validators = {};
  if (email) {
    validators.email = validatorFunctions.email(email === true ? undefined : email);
  }
  if (Array.isArray(length)) {
    validators.length = validatorFunctions.length(length);
  }
  if (required) {
    validators.required = validatorFunctions.required();
  }
  if (match) {
    validators.match = validatorFunctions.match(match);
  }
  if (alpha) {
    validators.alpha = validatorFunctions.alpha();
  }
  if (number) {
    validators.numeric = validatorFunctions.numeric();
  }
  if (Number(max) >= 0) {
    validators.max = validatorFunctions.max(max);
  }
  if (Number(min) >= 0) {
    validators.min = validatorFunctions.min(min);
  }
  if (typeof custom === 'function') validators.custom = custom;
  return validators;
}

function updateValidators(config, validators) {
  return Object.assign({}, validators, assembleValidators(config));
}

function isValid(value, validators) {
  return validators.reduce(function (status, validator) {
    if (!status) return false;
    return validator(value);
  }, true);
}

function onChange(changeInfo) {
  var field = changeInfo.label,
      value = changeInfo.value,
      status = changeInfo.status,
      pristine = changeInfo.pristine;


  this.setState(_defineProperty({}, field, { value: value, status: status, pristine: pristine }));
}

function addFieldToState(field) {
  var _this = this;

  if (!field) return;

  if (Array.isArray(field)) {
    field.forEach(function (name) {
      return _this.addFieldToState(name);
    });
  } else if (typeof field === 'string') {
    this.state[field] = { value: '', valid: false, pristine: false };
  } else if ((typeof field === 'undefined' ? 'undefined' : _typeof(field)) === 'object') {
    var name = field.label,
        value = field.value,
        valid = field.valid,
        pristine = field.pristine;

    var newState = { value: '', valid: false, pristine: false };

    if (value !== undefined) Object.assign(newState, { value: value });
    if (valid !== undefined) Object.assign(newState, { valid: valid });
    if (pristine !== undefined) Object.assign(newState, { pristine: pristine });

    this.state[name] = newState;
  }
}

function getValuesOf() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
}
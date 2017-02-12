'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assembleValidators = assembleValidators;
exports.updateValidators = updateValidators;
exports.isValid = isValid;
exports.buildStateForField = buildStateForField;
exports.addFieldsToState = addFieldsToState;
exports.getValuesOf = getValuesOf;
exports.makeFieldProps = makeFieldProps;
exports.mapPropsToChild = mapPropsToChild;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _validators = require('./validators');

var validatorFunctions = _interopRequireWildcard(_validators);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function buildStateForField(fieldProps) {
  var value = fieldProps.value,
      valid = fieldProps.valid,
      pristine = fieldProps.pristine;

  var newState = { value: '', valid: false, pristine: true };

  if (value !== undefined) Object.assign(newState, { value: value });
  if (valid !== undefined) Object.assign(newState, { valid: valid });
  if (pristine !== undefined) Object.assign(newState, { pristine: pristine });
  return newState;
}

function addFieldsToState(child) {
  var mounted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (typeof child.type === 'function' && child.type.name === 'Field') {
    var name = child.props.name;
    var fieldState = buildStateForField(child.props);
    if (mounted) {
      this.setState(_defineProperty({}, name, fieldState));
    } else {
      this.state[name] = fieldState;
    }
  } else if (child.props && child.props.children) {
    _react2.default.Children.forEach(child.props.children, function (nextChild) {
      return addFieldsToState(nextChild, mounted);
    });
  }
}

function getValuesOf() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
}

function makeFieldProps(child, onChange, state) {
  if (typeof child.type === 'function' && child.type.name === 'Field') {
    var name = child.props.name;
    return { name: name, onChange: onChange, key: name, value: state[name] ? state[name].value : null };
  }
  return null;
}

function mapPropsToChild(child, type, props) {
  if (child.type === type || typeof child.type === 'function' && child.type.name === type) {
    return _react2.default.cloneElement(child, props);
  } else if (child.props && child.props.children) {
    var newChildren = _react2.default.Children.map(child.props.children, function (nestedChild) {
      return mapPropsToChild(nestedChild, type, props);
    });
    return _react2.default.cloneElement(child, null, newChildren);
  }
  return child;
}
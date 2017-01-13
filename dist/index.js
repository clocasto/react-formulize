'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

var _validators = require('./validators');

var validatorFunctions = _interopRequireWildcard(_validators);

var _Field = require('./Field');

var _Field2 = _interopRequireDefault(_Field);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function assembleValidators(_ref) {
  var email = _ref.email,
      length = _ref.length,
      required = _ref.required,
      match = _ref.match,
      alpha = _ref.alpha,
      number = _ref.number,
      max = _ref.max,
      min = _ref.min;

  var validators = {};
  if (email) {
    validators.email = validatorFunctions.email(email === true ? undefined : email);
  }
  if (length) {
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
  if (max) {
    validators.max = validatorFunctions.max(max);
  }
  if (min) {
    validators.min = validatorFunctions.min(min);
  }
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

var ValidatedField = function (_React$Component) {
  _inherits(ValidatedField, _React$Component);

  function ValidatedField(props) {
    _classCallCheck(this, ValidatedField);

    var _this = _possibleConstructorReturn(this, (ValidatedField.__proto__ || Object.getPrototypeOf(ValidatedField)).call(this, props));

    _this.state = {
      value: props.value,
      valid: false,
      pristine: true,
      debounceDuration: Math.floor(Math.pow(Math.pow(+props.debounce, 2), 0.5)) || 0, // eslint-disable-line
      validators: assembleValidators(props)
    };

    _this.message = '';
    _this.finalValue = null;
    _this.RawFieldComponent = props.Input || (0, _Field2.default)();

    _this.onChange = _this.onChange.bind(_this);
    _this.broadcastChange = _this.broadcastChange.bind(_this);
    _this.cancelBroadcast = _this.cancelBroadcast.bind(_this);
    _this.debouncedBroadcastChange = _this.state.debounceDuration ? (0, _lodash2.default)(_this.broadcastChange, _this.state.debounceDuration) : _this.broadcastChange;
    return _this;
  }

  _createClass(ValidatedField, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.props.value && nextProps.value !== this.finalValue) {
        this.cancelBroadcast();
        this.setState({ value: nextProps.value });
      }

      if (this.props.match !== nextProps.match) {
        var validators = updateValidators({ match: nextProps.match }, this.state.validators);
        this.setState({ valid: isValid(this.state.value, Object.values(validators)), validators: validators });
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      if (nextProps.value !== this.finalValue) return true;
      if (this.state.value !== this.finalValue) return true;
      if (this.props.match !== nextProps.match) return true;
      return false;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.broadcastChange();
      this.cancelBroadcast();
    }
  }, {
    key: 'onChange',
    value: function onChange(e) {
      var value = e.target.value;

      var validators = Object.values(this.state.validators);

      this.setState({ value: value, valid: isValid(value, validators), pristine: false });
      this.finalValue = value;
      this.debouncedBroadcastChange();
    }
  }, {
    key: 'broadcastChange',
    value: function broadcastChange() {
      if (this.props.onChange) {
        this.props.onChange({
          name: this.props.label,
          value: this.finalValue,
          status: this.state.valid,
          pristine: this.state.pristine
        });
      }

      this.finalValue = null;
    }
  }, {
    key: 'cancelBroadcast',
    value: function cancelBroadcast() {
      if (this.debouncedBroadcastChange.cancel) {
        this.debouncedBroadcastChange.cancel();
        this.finalValue = null;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(this.RawFieldComponent, _extends({}, this.props, {
        value: this.state.value,
        valid: this.state.valid,
        pristine: this.state.pristine,
        message: this.message,
        onChange: this.onChange,
        Input: undefined
      }));
    }
  }]);

  return ValidatedField;
}(_react2.default.Component);

ValidatedField.propTypes = {
  value: _react2.default.PropTypes.string,
  label: _react2.default.PropTypes.string,
  onChange: _react2.default.PropTypes.func,
  debounce: _react2.default.PropTypes.number,
  match: _react2.default.PropTypes.string,
  Input: _react2.default.PropTypes.element
};

exports.default = ValidatedField;
'use strict';

var _ValidatedField = require('./ValidatedField.jsx');

var _ValidatedField2 = _interopRequireDefault(_ValidatedField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.email = email;
exports.length = length;
exports.required = required;
exports.match = match;
exports.alpha = alpha;
exports.numeric = numeric;
exports.max = max;
exports.min = min;
exports.custom = custom;
function email() {
  var emailRegex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return function (value) {
    if (typeof emailRegex === 'function') {
      return emailRegex(value);
    }

    var emailPassesRegex = emailRegex.test(value);
    if (!value) return false;
    return emailPassesRegex;
  };
}

function length(_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      minValue = _ref2[0],
      maxValue = _ref2[1];

  return function (value) {
    if (minValue && !maxValue) return value.length <= minValue;
    if (minValue && value.length < minValue) return false;
    if (maxValue && value.length > maxValue) return false;
    return true;
  };
}

function required() {
  return function (value) {
    return !!value || value === 0 || value === '0';
  };
}

function match(valueToMatch) {
  return function (value) {
    if (typeof valueToMatch === 'function') valueToMatch = valueToMatch();
    return value === valueToMatch;
  };
}

function alpha() {
  var alphaRegex = /[^a-z\s]/i;
  return function (value) {
    return !alphaRegex.test(value);
  };
}

function numeric() {
  var numericRegex = /[^0-9]/i;
  return function (value) {
    return !numericRegex.test(value);
  };
}

function max(criteria) {
  return function (value) {
    return +value <= +criteria;
  };
}

function min(criteria) {
  return function (value) {
    return +value >= +criteria;
  };
}

function custom(validatingFn) {
  return function (value) {
    return validatingFn(value);
  };
}

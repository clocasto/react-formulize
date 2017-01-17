'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Input = function Input() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'label',
      { htmlFor: props.label },
      _react2.default.createElement('input', { type: props.type, name: props.label, value: props.value, onChange: props.onChange })
    )
  );
};

Input.propTypes = {
  label: _react2.default.PropTypes.string,
  pristine: _react2.default.PropTypes.bool,
  valid: _react2.default.PropTypes.bool,
  message: _react2.default.PropTypes.string
};

exports.default = Input;
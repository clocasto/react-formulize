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
      _react2.default.createElement('input', {
        checked: props.checked,
        type: props.type,
        name: props.label,
        value: props.value,
        onChange: props.onChange
      })
    )
  );
};

Input.propTypes = {
  label: _react2.default.PropTypes.string,
  onChange: _react2.default.PropTypes.func,
  type: _react2.default.PropTypes.string,
  value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number, _react2.default.PropTypes.bool]),
  checked: _react2.default.PropTypes.bool
};

Input.defaultProps = {
  label: '',
  onChange: undefined,
  type: 'text',
  value: '',
  checked: false
};

exports.default = Input;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Input = function Input(props) {
  return _react2.default.createElement(
    'label',
    { htmlFor: props.name },
    _react2.default.createElement('input', {
      checked: props.checked,
      type: props.type,
      name: props.name,
      value: props.value,
      onChange: props.onChange,
      onBlur: props.onBlur,
      onFocus: props.onFocus
    })
  );
};

Input.propTypes = {
  name: _react2.default.PropTypes.string,
  onChange: _react2.default.PropTypes.func,
  onFocus: _react2.default.PropTypes.func,
  onBlur: _react2.default.PropTypes.func,
  type: _react2.default.PropTypes.string,
  value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number, _react2.default.PropTypes.bool]),
  checked: _react2.default.PropTypes.bool
};

Input.defaultProps = {
  name: null,
  onChange: null,
  onFocus: null,
  onBlur: null,
  type: 'text',
  value: '',
  checked: null
};

exports.default = Input;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utilities = require('../helpers/utilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Form = function (_React$Component) {
  _inherits(Form, _React$Component);

  function Form(props) {
    _classCallCheck(this, Form);

    var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

    _this.addFieldsToState = _utilities.addFieldsToState.bind(_this);
    _this.onSubmit = _this.onSubmit.bind(_this);
    _this.onFieldChange = _this.onFieldChange.bind(_this);
    _this.reset = _this.reset.bind(_this);

    _this.state = {};

    _react2.default.Children.map(props.children, function (child) {
      return _this.addFieldsToState(_this, child, false);
    });
    return _this;
  }

  _createClass(Form, [{
    key: 'onFieldChange',
    value: function onFieldChange(_ref) {
      var name = _ref.name,
          value = _ref.value,
          valid = _ref.valid,
          pristine = _ref.pristine;

      this.setState(_defineProperty({}, name, { value: value, valid: valid, pristine: pristine }));
    }
  }, {
    key: 'onSubmit',
    value: function onSubmit(e) {
      e.preventDefault();
      if (this.props.onSubmit) this.props.onSubmit(_extends({}, this.state));
    }
  }, {
    key: 'reset',
    value: function reset() {
      var _this2 = this;

      _react2.default.Children.map(this.props.children, function (child) {
        return _this2.addFieldsToState(_this2, child, true);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        'form',
        { onSubmit: this.onSubmit },
        _react2.default.Children.map(this.props.children, function (child) {
          return (0, _utilities.mapPropsToChild)(child, { Field: function Field(grandChild) {
              return (0, _utilities.makeFieldProps)(grandChild, _this3.onFieldChange, _this3.state);
            } });
        })
      );
    }
  }]);

  return Form;
}(_react2.default.Component);

Form.propTypes = {
  children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.element, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.element), _react2.default.PropTypes.object]),
  onSubmit: _react2.default.PropTypes.func
};

Form.defaultProps = {
  children: [],
  onSubmit: null
};

exports.default = Form;
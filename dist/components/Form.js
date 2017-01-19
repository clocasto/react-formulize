'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Field = require('./Field');

var _Field2 = _interopRequireDefault(_Field);

var _utilities = require('../helpers/utilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Form = function (_React$Component) {
  _inherits(Form, _React$Component);

  function Form(props) {
    _classCallCheck(this, Form);

    var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

    _this.addFieldToState = _utilities.addFieldToState.bind(_this);
    _this.onChange = _utilities.onChange.bind(_this);
    _this.produceFieldComponent = _this.produceFieldComponent.bind(_this);

    _this.state = {};
    _this.form = props.Form;

    _this.addFieldToState(props.fields);
    return _this;
  }

  _createClass(Form, [{
    key: 'produceFieldComponent',
    value: function produceFieldComponent(field, index) {
      var _props = {};
      var name = void 0;

      if ((typeof field === 'undefined' ? 'undefined' : _typeof(field)) === 'object') {
        name = field.label;
        Object.assign(_props, this.props.fields[index]);
        delete _props.pristine;
        delete _props.valid;
      } else {
        name = field;
      }

      return _react2.default.createElement(_Field2.default, _extends({}, _props, {
        key: name,
        value: this.state[name].value,
        onChange: this.onChange,
        label: name
      }));
    }
  }, {
    key: 'render',
    value: function render() {
      return this.form ? _react2.default.createElement(this.form, _extends({}, this.props, {
        onChange: this.onChange,
        data: Object.assign({}, this.state),
        Form: undefined
      })) : _react2.default.createElement(
        'form',
        null,
        (this.props.fields || []).map(this.produceFieldComponent)
      );
    }
  }]);

  return Form;
}(_react2.default.Component);

Form.propTypes = {
  Form: _react2.default.PropTypes.func,
  fields: _react2.default.PropTypes.array
};

exports.default = Form;
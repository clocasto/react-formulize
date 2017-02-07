'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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
    _this.onSubmit = _this.onSubmit.bind(_this);

    _this.state = {};
    var fieldsToAdd = _react2.default.Children.toArray(props.children).filter(function (child) {
      return child.type.name === 'Field';
    });
    _this.addFieldToState(fieldsToAdd);
    return _this;
  }

  _createClass(Form, [{
    key: 'onSubmit',
    value: function onSubmit(e) {
      e.preventDefault();
      if (this.props.onSubmit) this.props.onSubmit(this.state);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'form',
        { onSubmit: this.onSubmit },
        _react2.default.Children.count(this.props.children) && _react2.default.Children.map(this.props.children, function (child) {
          if (child.type.name === 'Field') {
            var name = child.props.name;

            var value = _this2.state[name].value;
            console.log('child', child.props);
            return _react2.default.cloneElement(child, { key: child.props.name, value: value, name: name });
          }
          return _react2.default.cloneElement(child);
        })
      );
    }
  }]);

  return Form;
}(_react2.default.Component);

Form.propTypes = {
  children: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.element),
  onSubmit: _react2.default.PropTypes.func
};

Form.defaultProps = {
  children: [],
  onSubmit: null
};

exports.default = Form;
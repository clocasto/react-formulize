'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

var _utilities = require('../helpers/utilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Field = function (_React$Component) {
  _inherits(Field, _React$Component);

  function Field(props) {
    _classCallCheck(this, Field);

    var _this = _possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).call(this, props));

    _this.state = {
      value: props.value || '',
      valid: false,
      pristine: true,
      debounce: Math.floor(Math.pow(Math.pow(+props.debounce, 2), 0.5)) || 0, //eslint-disable-line
      validators: (0, _utilities.assembleValidators)(props)
    };
    _this.finalValue = null;

    _this.onChange = _this.onChange.bind(_this);
    _this.broadcastChange = _this.broadcastChange.bind(_this);
    _this.cancelBroadcast = _this.cancelBroadcast.bind(_this);
    _this.debouncedBroadcastChange = _this.state.debounce ? (0, _lodash2.default)(_this.broadcastChange, _this.state.debounce) : _this.broadcastChange;
    return _this;
  }

  _createClass(Field, [{
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      if (nextProps.value !== this.props.value && nextProps.value !== this.finalValue) {
        this.cancelBroadcast();
        this.setState({ value: nextProps.value });
        this.finalValue = nextProps.value;
      }

      if (this.props.match !== nextProps.match) {
        var validators = (0, _utilities.updateValidators)({ match: nextProps.match }, this.state.validators);
        this.setState({ valid: (0, _utilities.isValid)(this.state.value, (0, _utilities.getValuesOf)(validators)), validators: validators });
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
      this.finalValue = value;

      var validators = (0, _utilities.getValuesOf)(this.state.validators);

      this.setState({
        value: value,
        valid: (0, _utilities.isValid)(value, validators),
        pristine: false
      }, this.debouncedBroadcastChange);
    }
  }, {
    key: 'broadcastChange',
    value: function broadcastChange() {
      if (this.props.onChange) {
        this.props.onChange({
          name: this.props.name,
          value: this.state.value,
          valid: this.state.valid,
          pristine: this.state.pristine
        });
      }
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
      var childCount = _react2.default.Children.count(this.props.children);
      var inputProps = {
        name: this.props.name,
        value: this.state.value,
        type: this.props.type,
        onChange: this.onChange,
        onFocus: this.props.onFocus,
        onBlur: this.props.onBlur
      };

      if (!childCount) {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'label',
            { htmlFor: this.props.name },
            _react2.default.createElement('input', inputProps)
          )
        );
      }
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.Children.map(this.props.children, function (child) {
          return (0, _utilities.mapPropsToChild)(child, 'input', inputProps);
        })
      );
    }
  }]);

  return Field;
}(_react2.default.Component);

Field.propTypes = {
  value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
  name: _react2.default.PropTypes.string,
  onChange: _react2.default.PropTypes.func,
  onFocus: _react2.default.PropTypes.func,
  onBlur: _react2.default.PropTypes.func,
  debounce: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
  match: _react2.default.PropTypes.any, // eslint-disable-line
  children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.element, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.element), _react2.default.PropTypes.object]),
  type: _react2.default.PropTypes.string
};

Field.defaultProps = {
  value: '',
  name: '',
  onChange: undefined,
  onFocus: undefined,
  onBlur: undefined,
  debounce: 0,
  match: undefined,
  children: [],
  type: 'text'
};

exports.default = Field;
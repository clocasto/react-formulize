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

  /**
   * `Length` Validator
   * @param  {[String]} value [Input value for 'text' and 'number' inputs]
   * @return {[boolean]}       [Returns whether the input value is acceptable (true) or not (false)]
   */
  return function (value) {
    if (typeof value !== 'string') return false;
    if (minValue && !maxValue) return value.length <= minValue;
    if (minValue && value.length < minValue) return false;
    if (maxValue && value.length > maxValue) return false;
    return true;
  };
}

function required() {
  /**
   * `Required` Validator
   * @param  {[String, Number]} value [Input value for 'text' and 'number' inputs]
   * @return {[boolean]}       [Returns whether the input value is acceptable (true) or not (false)]
   */
  return function (value) {
    return typeof value === 'string' && !!value || typeof value === 'number';
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
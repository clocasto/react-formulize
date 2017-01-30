export function email(emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) {
  return (value) => {
    if (typeof emailRegex === 'function') {
      return emailRegex(value);
    }

    const emailPassesRegex = emailRegex.test(value);
    if (!value) return false;
    return emailPassesRegex;
  };
}

export function length([minValue, maxValue]) {
  /**
   * `Length` Validator
   * @param  {[String]} value [Input value for 'text' and 'number' inputs]
   * @return {[boolean]}       [Returns whether the input value is acceptable (true) or not (false)]
   */
  return (value) => {
    if (typeof value !== 'string') return false;
    if (minValue && !maxValue) return value.length <= minValue;
    if (minValue && value.length < minValue) return false;
    if (maxValue && value.length > maxValue) return false;
    return true;
  };
}

export function required() {
  /**
   * `Required` Validator
   * @param  {[String, Number]} value [Input value for 'text' and 'number' inputs]
   * @return {[boolean]}       [Returns whether the input value is acceptable (true) or not (false)]
   */
  return value => ((typeof value === 'string' && !!value) || typeof value === 'number');
}

export function match(valueToMatch) {
  return (value) => {
    if (typeof valueToMatch === 'function') valueToMatch = valueToMatch();
    return (value === valueToMatch);
  };
}

export function alpha() {
  const alphaRegex = /[^a-z\s]/i;
  return value => (typeof value === 'string') && !alphaRegex.test(value);
}

export function numeric() {
  const numericRegex = /[^0-9\s]/i;
  return value => typeof value === 'number' || (typeof value === 'string' && !numericRegex.test(value));
}

export function max(criteria) {
  return value => ((typeof value === 'string' && value) || typeof value === 'number') && (Number(value) <= Number(criteria));
}

export function min(criteria) {
  return value => (+value >= +criteria);
}

export function custom(validatingFn) {
  return value => validatingFn(value);
}

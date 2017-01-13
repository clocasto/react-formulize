import React from 'react';
import debounce from 'lodash.debounce';
import * as validatorFunctions from './validators';
import Field from './Field';

function assembleValidators({ email, length, required, match, alpha, number, max, min }) {
  const validators = {};
  if (email) { validators.email = validatorFunctions.email(email === true ? undefined : email); }
  if (length) { validators.length = validatorFunctions.length(length); }
  if (required) { validators.required = validatorFunctions.required(); }
  if (match) { validators.match = validatorFunctions.match(match); }
  if (alpha) { validators.alpha = validatorFunctions.alpha(); }
  if (number) { validators.numeric = validatorFunctions.numeric(); }
  if (max) { validators.max = validatorFunctions.max(max); }
  if (min) { validators.min = validatorFunctions.min(min); }
  return validators;
}

function updateValidators(config, validators) {
  return Object.assign({}, validators, assembleValidators(config));
}

function isValid(value, validators) {
  return validators.reduce((status, validator) => {
    if (!status) return false;
    return validator(value);
  }, true);
}

const ValidatedField = class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      valid: false,
      pristine: true,
      debounceDuration: Math.floor(Math.pow(Math.pow(+props.debounce, 2), 0.5)) || 0, // eslint-disable-line
      validators: assembleValidators(props),
    };

    this.message = '';
    this.finalValue = null;
    this.RawFieldComponent = props.Input || Field();

    this.onChange = this.onChange.bind(this);
    this.broadcastChange = this.broadcastChange.bind(this);
    this.cancelBroadcast = this.cancelBroadcast.bind(this);
    this.debouncedBroadcastChange = this.state.debounceDuration ?
      debounce(this.broadcastChange, this.state.debounceDuration) : this.broadcastChange;
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.value !== this.props.value) && (nextProps.value !== this.finalValue)) {
      this.cancelBroadcast();
      this.setState({ value: nextProps.value });
    }

    if (this.props.match !== nextProps.match) {
      const validators = updateValidators({ match: nextProps.match }, this.state.validators);
      this.setState({ valid: isValid(this.state.value, Object.values(validators)), validators });
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.value !== this.finalValue) return true;
    if (this.state.value !== this.finalValue) return true;
    if (this.props.match !== nextProps.match) return true;
    return false;
  }

  componentWillUnmount() {
    this.broadcastChange();
    this.cancelBroadcast();
  }

  onChange(e) {
    const { value } = e.target;
    const validators = Object.values(this.state.validators);

    this.setState({ value, valid: isValid(value, validators), pristine: false });
    this.finalValue = value;
    this.debouncedBroadcastChange();
  }

  broadcastChange() {
    if (this.props.onChange) {
      this.props.onChange({
        name: this.props.label,
        value: this.finalValue,
        status: this.state.valid,
        pristine: this.state.pristine,
      });
    }

    this.finalValue = null;
  }

  cancelBroadcast() {
    if (this.debouncedBroadcastChange.cancel) {
      this.debouncedBroadcastChange.cancel();
      this.finalValue = null;
    }
  }

  render() {
    return (<this.RawFieldComponent
      {...this.props}
      value={this.state.value}
      valid={this.state.valid}
      pristine={this.state.pristine}
      message={this.message}
      onChange={this.onChange}
      Input={undefined}
    />);
  }
};

ValidatedField.propTypes = {
  value: React.PropTypes.string,
  label: React.PropTypes.string,
  onChange: React.PropTypes.func,
  debounce: React.PropTypes.number,
  match: React.PropTypes.string,
  Input: React.PropTypes.element,
};

export default ValidatedField;

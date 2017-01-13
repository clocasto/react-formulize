import React from 'react';
import debounce from 'lodash.debounce';
import Input from './Input.jsx';
import { assembleValidators, isValid, updateValidators } from '../helpers/utilities.jsx';

const Field = class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      valid: false,
      pristine: true,
      debounceDuration: Math.floor(Math.pow(Math.pow(+props.debounce, 2), 0.5)) || 0,
      validators: assembleValidators(props),
    };

    this.message = '';
    this.finalValue = null;
    this.Input = props.Input || Input;

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
    return (<this.Input
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

Field.propTypes = {
  value: React.PropTypes.string,
  label: React.PropTypes.string,
  onChange: React.PropTypes.func,
  debounce: React.PropTypes.number,
  match: React.PropTypes.string,
  Input: React.PropTypes.element,
};

export default Field;

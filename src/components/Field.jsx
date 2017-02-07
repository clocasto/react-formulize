import React from 'react';
import debounce from 'lodash.debounce';
import Input from './Input';
import { assembleValidators, isValid, updateValidators, getValuesOf } from '../helpers/utilities';

const Field = class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value || '',
      valid: false,
      pristine: true,
      debounce: Math.floor(Math.pow(Math.pow(+props.debounce, 2), 0.5)) || 0, //eslint-disable-line
      validators: assembleValidators(props),
    };

    this.finalValue = null;
    this.Input = props.Input || Input;

    this.onChange = this.onChange.bind(this);
    this.broadcastChange = this.broadcastChange.bind(this);
    this.cancelBroadcast = this.cancelBroadcast.bind(this);
    this.debouncedBroadcastChange = this.state.debounce ?
      debounce(this.broadcastChange, this.state.debounce) : this.broadcastChange;
  }

  componentWillUpdate(nextProps) {
    if ((nextProps.value !== this.props.value) && (nextProps.value !== this.finalValue)) {
      this.cancelBroadcast();
      this.setState({ value: nextProps.value });
    }

    if (this.props.match !== nextProps.match) {
      const validators = updateValidators({ match: nextProps.match }, this.state.validators);
      this.setState({ valid: isValid(this.state.value, getValuesOf(validators)), validators });
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
    const validators = getValuesOf(this.state.validators);

    this.setState({ value, valid: isValid(value, validators), pristine: false });
    this.finalValue = value;
    this.debouncedBroadcastChange();
  }

  broadcastChange() {
    if (this.props.onChange) {
      this.props.onChange({
        name: this.props.name,
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
      onChange={this.onChange}
      Input={null}
    />);
  }
};

Field.propTypes = {
  value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  name: React.PropTypes.string,
  onChange: React.PropTypes.func,
  debounce: React.PropTypes.number,
  match: React.PropTypes.string,
  Input: React.PropTypes.func,
};

Field.defaultProps = {
  value: '',
  name: '',
  onChange: undefined,
  debounce: 0,
  match: undefined,
  Input: undefined,
};

export default Field;

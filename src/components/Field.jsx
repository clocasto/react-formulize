/* globals window */
import React from 'react';
import debounce from 'lodash.debounce';
import {
  assembleValidators,
  isValid,
  updateValidators,
  getValuesOf,
  mapPropsToChild,
} from '../helpers/utilities';

const Field = class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value || '',
      debounce: Math.floor(Math.pow(Math.pow(+props.debounce, 2), 0.5)) || 0, //eslint-disable-line
      validators: assembleValidators(props),
    };
    this.finalValue = null;
    this.valid = false;
    this.pristine = true;

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
      this.finalValue = nextProps.value;
    }

    if (this.props.match !== nextProps.match) {
      const validators = updateValidators({ match: nextProps.match }, this.state.validators);
      this.valid = isValid(this.state.value, getValuesOf(validators));
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
    this.setState({ value });

    const validators = getValuesOf(this.state.validators);
    this.valid = isValid(value, validators);
    this.finalValue = value;
    this.pristine = false;
    this.debouncedBroadcastChange();
  }

  broadcastChange() {
    if (this.props.onChange) {
      this.props.onChange({
        name: this.props.name,
        value: this.finalValue,
        valid: this.valid,
        pristine: this.pristine,
      });
    }
  }

  cancelBroadcast() {
    if (this.debouncedBroadcastChange.cancel) {
      this.debouncedBroadcastChange.cancel();
      this.finalValue = null;
    }
  }

  render() {
    const childCount = React.Children.count(this.props.children);
    const inputProps = {
      name: this.props.name,
      value: this.state.value,
      type: this.props.type,
      onChange: this.onChange,
      onFocus: this.props.onFocus,
      onBlur: this.props.onBlur,
    };

    if (!childCount) {
      return (
        <div>
          <label htmlFor={this.props.name}>
            <input {...inputProps} />
          </label>
        </div>
      );
    }
    return (
      <div>
        {React.Children
          .map(this.props.children, child => mapPropsToChild(child, 'input', inputProps))}
      </div>
    );
  }
};

Field.propTypes = {
  value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  name: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  onBlur: React.PropTypes.func,
  debounce: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  match: React.PropTypes.string,
  children: React.PropTypes.oneOfType([
    React.PropTypes.element,
    React.PropTypes.arrayOf(React.PropTypes.element),
    React.PropTypes.object,
  ]),
  type: React.PropTypes.string,
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
  type: 'text',
};

export default Field;

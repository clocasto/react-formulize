import React from 'react';
import debounce from 'lodash.debounce';
import DefaultInput from './Input';
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

    this.onChange = this.onChange.bind(this);
    this.broadcastChange = this.broadcastChange.bind(this);
    this.cancelBroadcast = this.cancelBroadcast.bind(this);
    this.debouncedBroadcastChange = this.state.debounce ?
      debounce(this.broadcastChange, this.state.debounce) : this.broadcastChange;
  }

  componentDidMount() {
    console.log('MOUNTED >>>');
  }

  componentWillUpdate(nextProps) {
    console.log('UPDATING >>>');
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
    console.log('START >>> ?', nextProps.value, this.finalValue);
    if (nextProps.value !== this.finalValue) return true;
    console.log('1/3 >>> TRUE');
    if (this.state.value !== this.finalValue) return true;
    console.log('2/3 >>> TRUE');
    if (this.props.match !== nextProps.match) return true;
    console.log('3/3 >>> FALSE');
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

    // this.finalValue = null;
  }

  cancelBroadcast() {
    if (this.debouncedBroadcastChange.cancel) {
      this.debouncedBroadcastChange.cancel();
      this.finalValue = null;
    }
  }

  render() {
    console.log('RENDER >>>');
    const childCount = React.Children.count(this.props.children);
    const inputProps = {
      value: this.state.value,
      valid: this.state.valid,
      pristine: this.state.pristine,
      onChange: this.onChange,
    };

    if (!childCount) {
      return <DefaultInput {...this.props} {...inputProps} />;
    } else if (childCount === 1) {
      return React.cloneElement(this.props.children, inputProps);
    }

    if (!React.Children.toArray(this.props.children).find(child => child.type.name === 'Input')) {
      throw new Error('No `Input` component provided to `Field`.');
    }

    return (
      <div>
        {React.Children.map(this.props.children, (child) => {
          console.log('child', child);
          if (child.type.name === 'Input') {
            return React.cloneElement(child, inputProps);
          }
          return child;
        })}
      </div>
    );
  }
};

Field.propTypes = {
  value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  name: React.PropTypes.string,
  onChange: React.PropTypes.func,
  debounce: React.PropTypes.number,
  match: React.PropTypes.string,
  children: React.PropTypes.oneOfType([
    React.PropTypes.element,
    React.PropTypes.arrayOf(React.PropTypes.element),
  ]),
};

Field.defaultProps = {
  value: '',
  name: '',
  onChange: undefined,
  debounce: 0,
  match: undefined,
  children: [],
};

export default Field;

import React from 'react';
import { addFieldToState, mapPropsToChild, makeFieldProps } from '../helpers/utilities';

const Form = class extends React.Component {
  constructor(props) {
    super(props);

    this.addFieldToState = addFieldToState.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.reset = this.reset.bind(this);

    this.state = {};
    const fieldsToAdd = React.Children.toArray(props.children)
      .filter(child => (child.type.name === 'Field'));
    this.addFieldsToState(fieldsToAdd);
  }

  onFieldChange({ name, value, valid, pristine }) {
    this.setState({
      [name]: { value, valid, pristine },
    });
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.props.onSubmit) this.props.onSubmit({ ...this.state });
  }

  reset() {
    const fieldsToAdd = React.Children.toArray(this.props.children)
      .filter(child => (child.type.name === 'Field'));
    this.addFieldsToState(fieldsToAdd);
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        {React.Children
          .map(this.props.children, child =>
            mapPropsToChild(child, 'Field', makeFieldProps(child, this.onFieldChange, this.state)))}
      </form>
    );
  }
};

Form.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.element,
    React.PropTypes.arrayOf(React.PropTypes.element),
    React.PropTypes.object,
  ]),
  onSubmit: React.PropTypes.func,
};

Form.defaultProps = {
  children: [],
  onSubmit: null,
};

export default Form;

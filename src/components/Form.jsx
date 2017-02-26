import React from 'react';
import { addFieldsToState, mapPropsToChild, makeFieldProps } from '../helpers/utilities';

const Form = class extends React.Component {
  constructor(props) {
    super(props);

    this.addFieldsToState = addFieldsToState.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.reset = this.reset.bind(this);

    this.state = {};

    React.Children.map(props.children, child => this.addFieldsToState(this, child, false));
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
    React.Children.map(this.props.children, child => this.addFieldsToState(this, child, true));
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        {React.Children
          .map(this.props.children, child =>
            mapPropsToChild(
              child,
              { Field: grandChild => makeFieldProps(grandChild, this.onFieldChange, this.state) },
            ),
        )}
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

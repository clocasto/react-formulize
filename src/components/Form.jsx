import React from 'react';
import { addFieldToState, mapPropsToChild } from '../helpers/utilities';

const Form = class extends React.Component {
  constructor(props) {
    super(props);

    this.addFieldToState = addFieldToState.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {};
    const fieldsToAdd = React.Children.toArray(props.children)
      .filter(child => (child.type.name === 'Field'));
    this.addFieldToState(fieldsToAdd);
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.props.onSubmit) this.props.onSubmit(this.state);
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        {React.Children
          .map(this.props.children, (child) => {
            const { name } = child.props;
            const value = this.state[name].value;
            const fieldProps = { key: child.props.name, value, name };
            return mapPropsToChild(child, 'Field', fieldProps);
          })}
      </form>
    );
  }
};

Form.propTypes = {
  children: React.PropTypes.arrayOf(React.PropTypes.element),
  onSubmit: React.PropTypes.func,
};

Form.defaultProps = {
  children: [],
  onSubmit: null,
};

export default Form;

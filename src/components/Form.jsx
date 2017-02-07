import React from 'react';
import { onChange, addFieldToState } from '../helpers/utilities';

const Form = class extends React.Component {
  constructor(props) {
    super(props);

    this.addFieldToState = addFieldToState.bind(this);
    this.onChange = onChange.bind(this);
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
        {React.Children.count(this.props.children) &&
          React.Children.map(this.props.children, (child) => {
            if (child.type.name === 'Field') {
              const { name } = child.props;
              const value = this.state[name].value;
              return React.cloneElement(child, { key: child.props.name, value, name });
            }
            return React.cloneElement(child);
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

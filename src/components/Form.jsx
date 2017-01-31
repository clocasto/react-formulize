import React from 'react';
import Field from './Field';
import { onChange, addFieldToState } from '../helpers/utilities';

const Form = class extends React.Component {
  constructor(props) {
    super(props);

    this.addFieldToState = addFieldToState.bind(this);
    this.onChange = onChange.bind(this);
    this.produceFieldComponent = this.produceFieldComponent.bind(this);

    this.state = {};
    this.form = props.Form;

    this.addFieldToState(props.fields);
  }

  produceFieldComponent(field, index) {
    const newProps = {};
    let name;

    if (typeof field === 'object') {
      name = field.label;
      Object.assign(newProps, this.props.fields[index]);
      delete newProps.pristine;
      delete newProps.valid;
    } else {
      name = field;
    }

    return (<Field
      {...newProps}
      key={name}
      value={this.state[name].value}
      onChange={this.onChange}
      label={name}
    />);
  }

  render() {
    return (
      this.form ?
        <this.form
          {...this.props}
          onChange={this.onChange}
          data={Object.assign({}, this.state)}
          Form={undefined}
        /> :
        <form>
          {(this.props.fields || []).map(this.produceFieldComponent)}
        </form>
    );
  }
};

Form.propTypes = {
  Form: React.PropTypes.func,
  fields: React.PropTypes.arrayOf(React.PropTypes.string),
};

Form.defaultProps = {
  Form: undefined,
  fields: [],
};

export default Form;

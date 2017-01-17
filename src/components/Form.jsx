import React from 'react';
import Field from './Field';
import { onChange, addFieldToState, produceFieldComponent } from '../helpers/utilities';

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
    const _props = {};
    let name;

    if (typeof field === 'object') {
      name = field.label;
      Object.assign(_props, this.props.fields[index]);
      delete _props.pristine;
      delete _props.valid;
    } else {
      name = field;
    }

    return (<Field 
        {..._props}
        key={name}
        value={this.state[name].value}
        onChange={this.onChange}
        label={name}
      />)
  }

  render() {
    return (
      this.form ?
      <this.form 
        {...props} 
        onChange={this.onChange} 
        data={Object.assign({},this.state)}
        Form={undefined} 
      /> :
      <form>
        {(this.props.fields || []).map(this.produceFieldComponent)}
      </form>
    )
  }
}

Form.propTypes = {
  Form: React.PropTypes.element,
  fields: React.PropTypes.array,
}

export default Form;

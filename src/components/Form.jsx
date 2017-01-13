import React from 'react';
import Field from './Field.jsx';
import { onChange, addField } from '../helpers/utilities.jsx';

const Form = class extends React.component {
  constructor(props) {
    super(...props);

    this.addField = addField.bind(this);
    this.onChange = onChange.bind(this);

    this.state = {};
    this.form = props.Form;

    this.addField(props.fields);
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
  			{this.props.fields.map(name => {
  				<Field 
  					{this.props[name] && ...this.props[name]}
  					value={this.state[name].value}
  					onChange={this.onChange}
  					label={name}
  				/>
  			})}
  		</form>
		)
  }
}

Form.propTypes = {
	Form: React.PropTypes.element,
}

export default Form;

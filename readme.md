formwizard-react [![Build Status](https://travis-ci.org/clocasto/formwizard-react.svg?branch=master)](https://travis-ci.org/clocasto/formwizard-react) [![Coverage Status](https://coveralls.io/repos/github/clocasto/formwizard-react/badge.svg?branch=master&version=0_0_1)](https://coveralls.io/github/clocasto/formwizard-react?branch=master&version=0_0_1)
=========

A simple form validation library for React.js which wires up custom, controlled inputs through a declarative API.  

#### Table of Contents  
  1. [Installation](#installation)
  2. [Usage](#usage)
  3. [Component API](#component-api)
  4. [Tests](#tests)
  5. [Contributing](#contributing)
  6. [License](#license)
  7. [Release History](#release-history)
  
## <a href="installation"></a>Installation

  ```
  npm install formwizard-react --save  
  ```  

## <a href="usage"></a>Usage

Formwizard-react can be used to both quickly compose forms or add validation to existing input components.  

### Wrapping A Custom Form (Managing Form State)
```javascript  
  import React from 'react';
  import { Form } from 'formwizard-react';
  import { customForm } from './components/form';
  // customForm = <div><input name="field_1"/><input name="field_2"/><div>;

  export default function (props) {
    // CustomForm receives `data` prop: {'field_1': {value: '', valid: false, pristine: true... }... } 
    return (<Form Form={CustomForm} fields={['field_name_1', 'field_2']} />);
  } 
```  

### Composing A New Form (With Custom Input Component)
```javascript  
  import React from 'react';
  import { Form, Field } from 'formwizard-react';
  import { agePickerComponent } from './components/agePicker';
  
  export default function (props) { 
    return (
      <Form fields={['name_field', 'email_field', 'age_field']}>
        <Field name="name_field" length={[3, 24]} />
        <Field name="email_field" required email debounce="300" />
        <Field name="age_field" type="number" Input={agePickerComponent} required min="18" max="150" />
        <button type="submit" />
      </Form>
     );
  } 
```  

### Adding Validation To A Custom Component
```javascript  
  import React from 'react';
  import { Field } from 'formwizard-react';
  import { agePickerComponent } from './components/agePicker';
  
  export class RegistrationForm extends React.Component { 
    constructor(props) {
      super(props);
      this.state = {
        'name_field': { value: '' },
        'email_field': { value: '' },
        'age_field': { value: '' },
      };
    }
    
    render() {
      return (
        <form>
          <div>
            <input name="name_field" length={[3, 24]} />
          </div>
          <div>
            <input name="email_field"  />
          </div>
          <div>
            <Field name="age_field" type="number" Input={agePickerComponent} required min="18" max="150" />
          </div>
          <button type="submit" />
        </form>
       );
     }
  } 
```  
## <a href="component-api"></a>Component API  

### Form  
The `Form` component is a stateful higher-order-component which wraps a presentational form component consisting of arbitrary input fields. Simply import in the `Form` component, pass it (via `props.fields`) the name of the input fields in an array. Additionally, pass the custom presentational form component in via `props.Form`. Now, `Form` will manage state for all of the specified fields and pass down `props.data` to the custom, presentational form component. If not custom form is provided, `Form` will create a generic form via `Field` and `Input` components. 

#### props.Form = formComponent
> @param {Function} [formComponent=undefined] - Optional. A presentational form component to wrap   

An optional form component to wrap. `Form` will pass down `props.data` to this component.

#### props.fields = fieldNames  
> @param {String[]} fieldNames - A list of input field names belonging to the form (to be used for indexing state)  

An array of field names belonging to the wrapped form. See the above example for usage.  

### Field  
The `Field` component is a stateful, higher-order component which wraps a given presentational input component (or creates a default one). Custom input elements can be passed to `Field` via `props.Input`. 

Each `Field` component will maintain its input element's value (`state.value` {String, Number}), validity(`state.valid`{Boolean}), and pristine state (`state.pristine` {Boolean}), as well as provide an onChange handler passed down through `props.onChange`.

There are also a handful of different validators and properties (debounce, length, etc.) that can be attached to the field component. This is done through declaring the properties in the props passed to the field component. See below for the `Field` component's API.  

#### props.debounce = duration
> @param {Number} duration - An amount to debounce `props.onChange` invocation   

  This property adds a debounce to the input element broadcasting its state change to the `Field` component.  

#### props.required = required 
> @param {Boolean} required - Toggles validation for a non-empty input  

  This validates that the input is not empty.  

#### props.length = [minLength, maxLength]  
> @param {Number} minLength - Validates component for mininum string input length  
> @param {Number} maxLength - Validates component for maximum string input length  

  This validates that the string input is of a certain length.  

#### props.email = emailExpression  
> @param {RegularExpression} [emailExpression] - Optional. RegEx to validate email inputs against  

  This validates that the string input matches either the default or provided regular expression.  

#### props.match = valueToMatch  
> @param {\*} valueToMatch - A value to validate the input's value against. If passed a function, function will be invoked  

  This validates that the input matches the value provided. If a function is passed, it will be invoked and its result used to compare with the value.  

#### props.alpha = alphaValidation  
> @param {Boolean} [alphaValidation=true] Optional. Will toggle validation for only alphabet and space characters.  

  This validates that the string input is comprised only of english alphabet characters and space characters.  

#### props.number = numericValidation  
> @param {Boolean} [numericValidation=true] Optional. Will toggle validation for only numeric and space characters.  

  This validates that the string or number input is comprised only of numeric and space characters.  

#### props.max = maxValue  
> @param {Number} maxValue - Validates an input field to be less than or equal to the maxValue  

  This validates that the provided number (or string-coerced-to-number) is less than or equal to the provided `maxValue`.  

#### props.min = minValue   
> @param {Number} minValue - Validates an input field to be greater than or equal to the minValue  

  This validates that the provided number (or string-coerced-to-number) is greater than or equal to the provided `minValue`.  

#### props.custom = validatingFn 
> @param {Function}
  This runs the provided validating function, which should return `true` for valid and `false` for invalid input.  

### Input  
A generic `Input` component which is simply a `label` and `input` element wrapped in a `div` element. The `input` element will invoked `props.onChange` upon change, apply `props.label` appropriately, and set its input type per `props.type`.  

## <a href="tests"></a>Tests

  Run `npm test` for just tests.  
  Run `npm run pack` for full linting, transpiling, and testing. 

## <a href="contributing"></a>Contributing

Implement any changes in the src/ files and use `npm run build` to build the dist/ directory.  
  
Please use the AirBNB style guide for consistency. Add unit tests for any new or changed functionality. Lint and test your code. Thanks!  

## <a href="license"></a>License  

MIT (See license.txt)  

## <a href="release-history"></a>Release History

* 0.0.1

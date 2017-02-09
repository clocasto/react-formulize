formwizard-react [![Build Status](https://travis-ci.org/clocasto/formwizard-react.svg?branch=master)](https://travis-ci.org/clocasto/formwizard-react) [![Coverage Status](https://coveralls.io/repos/github/clocasto/formwizard-react/badge.svg?branch=master&version=0_0_1)](https://coveralls.io/github/clocasto/formwizard-react?branch=master&version=0_0_1)
=========

A simple form validation library for React.js which wires up custom, controlled inputs through a declarative API.  

## Table of Contents  
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

#### Composing A New Form With Custom Input Component(s)
```javascript  
  import React from 'react';
  import { Form, Field } from 'formwizard-react';
  import { AgePickerComponent } from './components/agePicker';
  import { CustomSubmitButton } from './components/SubmitButton';
  import { SummarizeFormComponent } from './components/SummarizeFormComponent';
  
  export default function (props) { 
    return (
      <Form fields={['name_field', 'email_field', 'age_field']}>
        <Field name="name_field" length={[3, 24]} />
        <Field name="email_field" required email debounce="300" />
        <Field name="age_field" required min="18" max="150">
          <Input>
            <AgePickerComponent />
          </Input>
        </Field>

        <CustomSubmitButton />

        <Data>
          <SummarizeFormComponent />
        </Data>
      </Form>
     );
  } 
```  

#### Adding Validation To An Existing Form Input
```javascript  
  import React from 'react';
  import { Field } from 'formwizard-react';
  import { AgePickerComponent } from './components/agePicker';
  
  export class RegistrationForm extends React.Component { 
    constructor(props) {
      super(props);
      this.state = {
        'name': { value: '' },
        'email': { value: '' },
        'age': { value: '' },
      };
    }
    
    onChange(e) {
      this.setState({ [e.target.name]: e.target.value });
    }
    
    render() {
      return (
        <form>
          <div>
            <input type="text" name="name" onChange={this.onChange}/>  
            // Fields are controlled! You must pass `value` and `onChange` if you aren't using `Form`
            <Field name="age" value={this.state.age} onChange={this.onChange} min="18" max="150">
              <Input>
                <input type="text" name="name" onChange={this.onChange}/>
              </Input>
            </Field>
          </div>
          <button type="submit" />
        </form>
       );
     }
  } 
```  
## <a href="component-api"></a>Component API  

### Form  
The `Form` component is a stateful higher-order-component which wraps presentational form components consisting of arbitrary input fields. Simply import the `Form` component and nest your custom components inside the `Form` tag.  

The `Form` component will behave as follows with respect to its *direct* children:  

  1. Any `Field` tag will be passed the state associated with the `Field`'s name (`Form.state[child.props.name]`).  
  2. Any `Data` tag will be passed the entire `Form`'s state through `props.data`.  

The `Form` component should be passed an `onSubmit` handler if you want to interact with the submission event! 

### Field  
The `Field` component is a stateful, higher-order component which wraps a given presentational input component (or creates a default one). Input elements should be nested inside of `Field` tag. Each `Field` component will maintain its child's input element's value (`state.value` {String, Number}), validity(`state.valid`{Boolean}), and pristine state (`state.pristine` {Boolean}), as well as provide an onChange handler passed down through `props.onChange`.  

The `Field` component will behave as follows with respect to its *direct* children:  
  
  1. Any `Input` tag will be passed the current field state (`value`, `valid`, `pristine`).  
  2. If multiple `Input` tags are passed to `Field`, they would all share a single state (not recommended).
  3. If no components are nested in a `Field` component, the default `Input` component will be used.  
  
*Note:* Only one input element should be nested inside of a `Field` tag (see #2 above).

There are also a handful of different validators and properties (debounce, length, etc.) that can be attached to the field component. This is done through declaring props passed to the field component. See below for the list of validators.  

#### props.value = value
> @param {String} [value=''] - The value of the wrapped input component.   

  This property is used to control the value of the wrapped input component.  

#### props.label = label
> @param {String} [label=''] - The name of the wrapped input component. 

  The name of the wrapped input component. If no custom input component is passed in (via `props.Input`), then a label element will be created around the input and the input will be named, both with this value.

#### props.onChange = onChangeHandler
> @param {Function} onChangeHandler - A function used to update (control) the state of the input element.  

  This property will be invoked on a change event in a wrapped `input` element (unless a custom `input` element is provided, then this function will be passed down to the custom component through `props.onChange`).  

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

#### props.value = value
> @param {String} [value=''] - The value of the wrapped input element.   

  This property is used to control the value of the wrapped input element.  

#### props.label = label
> @param {String} [label=''] - The name of the wrapped input element. 

  The name of the wrapped input element. A label element will be created around the input and the input will be named, both with this value.

#### props.type = type
> @param {String} [type='text'] - The input type of the wrapped input element. 

  The input type for the wrapped input element. Defaults to `text`.

#### props.onChange = onChangeHandler
> @param {Function} onChangeHandler - A function used to update (control) the state of the input element.  

  This property will be invoked on a change event in a wrapped `input` element.  

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

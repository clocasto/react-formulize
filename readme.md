react-formulize [![Build Status](https://travis-ci.org/clocasto/react-formulize.svg?branch=master)](https://travis-ci.org/clocasto/react-formulize) [![Coverage Status](https://coveralls.io/repos/github/clocasto/react-formulize/badge.svg?branch=master&version=1_1_1)](https://coveralls.io/github/clocasto/react-formulize?branch=master&version=1_1_1)
=========

React-formulize is a simple form validation library for React.js which wires up custom, controlled inputs through a declarative API. The library strives to be minimal, and as such, does most component communication implicity. The end result is a legible form which clearly states the rules of its behavior.

## Table of Contents  
  1. [Installation](#installation)
  2. [Usage](#usage)
  3. [`Form` Component](#form-component)
  4. [`Field` Component](#field-component)
  6. [Tests](#tests)
  7. [Contributing](#contributing)
  8. [License](#license)
  9. [Release History](#release-history)
  
## <a href="installation"></a>Installation

  ```javascript  
  npm install react-formulize --save
  ```

## <a href="usage"></a>Usage

React-formulize can be used to both quickly compose forms or add validation to existing input components.

#### Rules to follow:
  1. A `Form` component can wrap (nested JSX) a set of `Field` components or `input` elements (or fragments containing them) and automatically manage the state of them. All `Field`s and `input`s *must* have `name` props assigned to them.
  2. A `Field` component can wrap (nested JSX) an `input` element, a fragment containing an `input`, or a custom component flagged with a `props.input=true`, and control its underlying state automatically.
  3. Pass validator props to the `Field` components. A `Field` component will keep track of its own validity.
  4. Pass an `onSubmit` handler to `Form` in order to interact with the submission event. The callback will be passed a clone of the `Form`'s state.
  5. Pass `valid` and `pristine` props to any nested child components in either a `Form` or `Field` component. These components will receive information about the `Form`'s status in the format of `${fieldName}_${statusType}` (e.g. name_valid & email_pristine).

#### Example: Composing A New Form With Custom Input Component(s)
```javascript  
  import React from 'react';
  import { Form, Field } from 'react-formulize';
  import { AgePickerComponent } from './components/agePicker';
  
  const onSubmit = formState => console.log(formState);
  
  export default function (props) { 
    return (
      <Form onSubmit={onSubmit}>
        <Field name="name_field" length={[3, 24]} />
        <Field name="age_field" required min="18" max="150">
          <AgePickerComponent input />
        </Field>
        <Field name="email_field" required email debounce="300">
          <label>
            Email: <input />
          </label>
          <span>Email Address must use a '.edu' domain!</span>
        </Field>
        <button type="submit" />
      </Form>
     );
  } 
```

#### Example: Adding Validation To An Existing Form Input
```javascript  
  import React from 'react';
  import { Field } from 'react-formulize';
  
  export class RegistrationForm extends React.Component { 
    constructor(props) {
      super(props);
      this.state = {
        'name': { value: '' },
        'email': { value: '' },
        'age': { value: '' },
      };

      this.onChange = this.onChange.bind(this);
    }
    
    onSubmit(e, formState) {
      e.preventDefault();
      console.log(formState);
    }

    onChange(e) {
      this.setState({ [e.target.name]: e.target.value });
    }
    
    render() {
      return (
        <form onSubmit={(e) => this.onSubmit(e, { ...this.state })}>
          <div>
            <input type="text" name="name" onChange={this.onChange}/>  
            
            <Field name="email" type="email" value={this.state.age} onChange={this.onChange} length={[6, 16]} email>
              <label>
                // The input is controlled! `Field` passes `name`, `value`, `type`, and `onChange` props for you!
                Enter Email: <input />
              </label>
              <span>Email Address must use a '.edu' domain!</span>
            </Field>
            
          </div>
          <button type="submit" />
        </form>
       );
     }
  } 
```  
## <a href="form-component"></a>Form Component

### Description
The `Form` component is a stateful higher-order-component which wraps presentational form components consisting of arbitrary input fields. Simply import the `Form` component and nest your custom components inside the `Form` tag.

The `Form` component will behave as follows with respect to its children:

  1. Any `Field` tag will be passed the state associated with the `Field`'s name (`Form.state[child.props.name]`).
  2. Any component with a `valid` prop will be passed props stating the validity for all `Field`s in the `Form` (e.g. name_valid).  
  3. Any component with a `pristine` prop will be passed a props stating the pristine state for all `Field`s in the `Form` (e.g. email_pristine).  
  4. Any other component or element will be rendered with the props it would otherwise be passed.
  5. Upon submission, `Form` will pass its `onSubmit` callback a clone of its current state.

*Note:* The `Form` component should be passed an `onSubmit` handler if you want to interact with the submission event!

### Props
#### `props.onSubmit = onSubmitHandler(event, formState)`
> @param {Function} onSubmitHandler - A function used to interact with form submission.

  This property will be invoked on a form submission event and passed the event and the event and current state.  

### Methods
#### `instance.reset()`
> @description - Resets the `Form` instance by reinstating the default state. Does not unmount the instance.  

  The `Form` instance must be captured in a reference in order to be able to later invoke its `reset` method. This means that:
  1. A `ref` function must be passed to `Form` in order to receive the class component reference.
  2. `Form` must be used within a class component to enable the `ref` callback being invoked.

```javascript  
import React from 'react';
import { Form, Field } from 'react-formulize';

export default class extends React.Component {
  constructor() {
    this.updateValue = this.updateValue.bind(this);
    this.registerForm = this.registerForm.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  addFormRef(form) {
    this.form = form;
  }

  updateValue(field, data) {
    this.setState({ [field]: data });
  }

  onSubmit(state) {
    console.log('SUBMITTING >>>', state);
  }

  resetForm(e) {
    e.preventDefault();
    this.form.reset(); // Instance method on `Form` component!
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit} ref={this.addFormRef}>
        <Field name="name" length={[6, 20]} alpha />
        <Field name="email" email required />
        <Field name="age" type="number" min="18" max="100" />
        <button type="submit">Submit</button>
        <button onClick={this.reset}>Reset</button>
      </Form>
    );
  }
}
```  

## <a href="field-component"></a>Field Component

### Description
The `Field` component is a stateful, higher-order component which wraps a given presentational input component (or creates a default one). Input elements should be nested inside of `Field` tag. Each `Field` component will maintain its child's input element's value (`state.value` {String, Number}), validity(`state.valid`{Boolean}), and pristine state (`state.pristine` {Boolean}), as well as provide an onChange handler passed down through `props.onChange`.

The `Field` component will behave as follows with respect to its children:
  
  1. If no components are nested in a `Field` component, a default label and input element will be used.  
  2. Any `input` tag will be passed `name`, `type`, `value`, and `onChange` props.  
  3. Any component with an `input` flag (`props.input = true`) that is nested in a `Field` will be passed all of the relevant input props.  
  4. If multiple `input` tags are nested in a single `Field`, they would all share a single state (not recommended).  
  5. Any component with a `valid` prop will be passed a prop stating the `Field`'s validity (e.g. name_valid).  
  6. Any component with a `pristine` prop will be passed a prop stating the `Field`'s pristine state (e.g. email_pristine).  

*Note:* Only one input element should be nested inside of a `Field` tag (see #4 above).

### Props
#### `props.name = name`
> @param {String} [name=''] - The name of the wrapped input component. 

  The name of the wrapped input component. If no custom input component is passed in (via `props.Input`), then a label element will be created around the input and the input will be named, both with this value.

#### `props.value = value`
> @param {String} [value=''] - The value of the wrapped input component.

  This property is used to control the value of the wrapped input component. If set on the field, this value will be used everytime it is detected as a new (changed) value. This is useful in cases where you need to programmatically populate the field's value (but still allow the input to be edited).  

#### `props.type = type`
> @param {String} [type='text'] - The input type of the wrapped input element.

  The input type for the wrapped input element. Defaults to `text`.  

  *Note:* When number input is desired, it is preferred to use 'text' inputs with a `number` validator if it is expected that the user will enter `+`, `-`, or `e` characters. See `https://github.com/facebook/react/issues/1549`.
  
#### `props[validator] = [validator]`
> @param {\?} [validator=\?] - Optional. One or more validators to apply to the `Field`'s state.

  The `Field` component accepts different validators as props. See the <a href="field-validators">Validators</a> section for full list of validators to pass as props.    
  
#### `props.onChange = onChangeHandler`
> @param {Function} onChangeHandler - A function used to update (control) the state of the input element.

  This property will be invoked on a change event in a wrapped `input` element (unless a custom `input` element is provided, then this function will be passed down to the custom component through `props.onChange`).
  
  *Note:* You do **not** have to write this function if the `Field` component is nested inside of a `Form` component.

#### `props.onFocus = onFocusHandler`
> @param {Function} onFocusHandler - A function to invoke upon input focus.

  This property will be invoked on a focus event in the wrapped `input` element.  

#### `props.onBlur = onBlurHandler`
> @param {Function} onBlurHandler - A function to invoke upon input blur.

  This property will be invoked on a blur event in the wrapped `input` element.  
  
### Validators  

There are also a handful of different validators and properties (debounce, length, etc.) that can be attached to the field component. This is done by declaring the validators as props on the `Field` component. See below for the list of validators.

#### `props.debounce = duration`
> @param {Number} duration - An amount to debounce `props.onChange` invocation.

  This property adds a debounce to the input element broadcasting its state change to the `Field` component.  

#### `props.required = required`
> @param {Boolean} required - Toggles validation for a non-empty input.

  This validates that the input is not empty.  

#### `props.length = [minLength, maxLength]`
> @param {Number} minLength - Validates component for mininum string input length.
> @param {Number} [maxLength] - Optional. Validates component for maximum string input length.

  This validates that the string input is of a certain length. If `maxLength` is omitted, minLength will be interpreted as `maxLength`. As such, omitting `maxLength` allows the passed in value to be a single number (of type `Number` or `String`).  

#### `props.email = emailExpression`
> @param {RegularExpression} [emailExpression] - Optional. RegEx to validate email inputs against.

  This validates that the string input matches either the default or provided regular expression.  

#### `props.match = valueToMatch`
> @param {\*} valueToMatch - A value to validate the input's value against. If passed a function, function will be invoked.

  This validates that the input matches the value provided. If a function is passed, it will be invoked and its result used to compare with the value.  

#### `props.alpha = alphaValidation`
> @param {Boolean} [alphaValidation=true] Optional. Will toggle validation for only alphabet and space characters.

  This validates that the string input is comprised only of english alphabet characters and space characters.  

#### `props.number = numericValidation`
> @param {Boolean} [numericValidation=true] Optional. Will toggle validation for only numeric characters.

  This validates that the string or number input is comprised only of numeric characters. This will allow appropriately placed `+`, `-`, `e`, and `.` characters.

#### `props.max = maxValue`
> @param {Number} maxValue - Validates an input field to be less than or equal to the maxValue.

  This validates that the provided number (or string-coerced-to-number) is less than or equal to the provided `maxValue`.  

#### `props.min = minValue`
> @param {Number} minValue - Validates an input field to be greater than or equal to the minValue.

  This validates that the provided number (or string-coerced-to-number) is greater than or equal to the provided `minValue`.  

#### `props.custom = validatingFn`
> @param {Function} validatingFn - A custom validating function which returns a validity boolean.

  The passed-in validating function, invoked once per `Field` update with the current component value, should return `true` for valid values and `false` for invalid values.  

## <a href="tests"></a>Tests

  Run `npm run pack` for full linting, transpiling, and testing.  
  Run `npm test` for just tests.

## <a href="contributing"></a>Contributing

Implement any changes in the src/ files and use `npm run build` to build the dist/ directory.
  
Please use the AirBNB style guide for consistency. Add unit tests for any new or changed functionality. Lint and test your code. Thanks!!

## <a href="license"></a>License

MIT (See license.txt)

## <a href="release-history"></a>Release History

* [1.1.1](https://github.com/clocasto/react-formulize/pull/35) (Current)
* [1.1.0](https://github.com/clocasto/react-formulize/pull/32)
* [1.0.0](https://github.com/clocasto/react-formulize/pull/25)

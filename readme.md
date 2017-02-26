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

* [1.0.0](https://github.com/clocasto/react-formulize/pull/25)

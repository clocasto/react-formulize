/* globals describe it before beforeEach after afterEach */
import React from 'react';
import sinon from 'sinon'; // eslint-disable-line
import { expect } from 'chai'; // eslint-disable-line
import { shallow, mount } from 'enzyme'; // eslint-disable-line

import { Field, Input } from '../../dist/index';
import { updateInput } from '../spec_helpers';

describe('<Field /> Higher-Order-Component', () => {
  const nameField = { label: 'name', value: 'Test Name' };

  describe('Default Field', () => {
    it('by default renders an `Input` component', () => {
      const wrapper = shallow(<Field />);
      expect(wrapper.find(Input)).to.have.length(1);
    });

    it('passes all props down', () => {
      const propsToPass = Object.assign({}, nameField, { debounce: 300, required: true });

      const wrapper = mount(<Field {...propsToPass} testProp />);

      const fields = wrapper.find(Field);
      expect(fields).to.have.length(1);

      const nameFieldProps = fields.first().props();

      expect(nameFieldProps).to.have.property('debounce', 300);
      expect(nameFieldProps).to.have.property('required', true);
      expect(nameFieldProps).to.have.property('value', nameField.value);
      expect(nameFieldProps).to.have.property('testProp', true);
    });
  });

  describe('Custom Input', () => {
    let customInputConstructor;
    let customInputClass;

    before('Assemble a custom input element', () => {
      /* eslint-disable */
      customInputConstructor = props => (
        <div>
          <h4>My Test Input!</h4>
          <input value={props.value} onChange={props.onChange} />
        </div>);
      /* eslint-enable */

      customInputClass = class extends React.Component { // eslint-disable-line
        render() {
          return (<div> {customInputConstructor(this.props)} <h5>Class test!</h5></div>);
        }
      };
    });

    it('will wrap a custom form (constructor function) passed through `Input` prop', () => {
      const wrapper = mount(<Field Input={customInputConstructor} value={'value!'} />);

      expect(wrapper.find(Field)).to.have.length(1);
      expect(wrapper.find('h4')).to.have.length(1);
      expect(wrapper.find('h4').text()).to.equal('My Test Input!');
    });

    it('will wrap a custom form (React Component Subclass) passed through `Form` prop', () => {
      const wrapper = mount(<Field Input={customInputClass} value={'value!'} />);

      expect(wrapper.find(Field)).to.have.length(1);
      expect(wrapper.find('h4')).to.have.length(1);
      expect(wrapper.find('h4').text()).to.equal('My Test Input!');
      expect(wrapper.find('h5').text()).to.equal('Class test!');
    });


    it('passes `props` down to the custom `Input` component', () => {
      const _onChange = function(e) { console.log(e.target); }
      const _Field = <Field Input={customInputConstructor} value={'value!'} label="pass" value="123goodPass" onChange={_onChange} />;
      const wrapper = mount(_Field);

      expect(wrapper.find(Field)).to.have.length(1);
      expect(wrapper.find('h4')).to.have.length(1);
      expect(wrapper.find('h4').text()).to.equal('My Test Input!');

      const renderedCustomInput = wrapper.find(customInputConstructor);
      expect(renderedCustomInput).to.have.length(1);

      const renderedCustomInputProps = renderedCustomInput.props();

      expect(renderedCustomInputProps).to.have.property('Input', null);
      expect(renderedCustomInputProps).to.have.property('value', renderedCustomInputProps.value);
      expect(renderedCustomInputProps).to.have.property('label', renderedCustomInputProps.label);
      expect(renderedCustomInputProps).to.have.property('valid', renderedCustomInputProps.valid);
      expect(renderedCustomInputProps).to.have.property('pristine', renderedCustomInputProps.pristine);

      expect(renderedCustomInputProps).to.have.property('onChange');
      expect(typeof renderedCustomInputProps.onChange).to.eql('function');
    });
  });

  describe('has validators', () => {
    it('which are composable through `props`', () => {
      const vanillaWrapper = mount(<Field />)
      const validatedWrapper = mount(<Field email required length={[0, 0]} fakeValidator />);

      expect(vanillaWrapper.state()).to.have.property('validators');
      expect(vanillaWrapper.state().validators).to.eql({});

      expect(validatedWrapper.state()).to.have.property('validators');
      expect(validatedWrapper.state().validators).to.have.property('email');
      expect(validatedWrapper.state().validators).to.have.property('required');
      expect(validatedWrapper.state().validators).to.have.property('length');
      expect(validatedWrapper.state().validators).to.not.have.property('fakeValidator');
    });

    it('which are invoked every `componentWillUpdate`', () => {
      sinon.spy(Field.prototype, 'componentWillUpdate');
      sinon.spy(Field.prototype, 'onChange');

      expect(Field.prototype.componentWillUpdate).to.have.property('callCount', 0);
      expect(Field.prototype.onChange).to.have.property('callCount', 0);

      const wrapper = mount(<Field label={'email'} type="text" />);

      expect(wrapper.state()).to.have.property('value', '');

      updateInput(wrapper, 'test@test.test');

      expect(Field.prototype.componentWillUpdate).to.have.property('callCount', 1);
      expect(Field.prototype.onChange).to.have.property('callCount', 1);
      expect(wrapper.state()).to.have.property('value', 'test@test.test');

      updateInput(wrapper, '');

      expect(Field.prototype.componentWillUpdate).to.have.property('callCount', 2);
      expect(Field.prototype.onChange).to.have.property('callCount', 2);
      expect(wrapper.state()).to.have.property('value', '');

      Field.prototype.componentWillUpdate.restore();
      Field.prototype.onChange.restore();
    });

    it('which adjust the component\'s validity', () => {
      const wrapper = mount(<Field label={'email'} type="text" required />);

      expect(wrapper.state()).to.have.property('valid', false);

      updateInput(wrapper, 'test@test.test');

      expect(wrapper.state()).to.have.property('value', 'test@test.test');
      expect(wrapper.state()).to.have.property('valid', true);

      updateInput(wrapper, '');

      expect(wrapper.state()).to.have.property('value', '');
      expect(wrapper.state()).to.have.property('valid', false);
    });
  });
});

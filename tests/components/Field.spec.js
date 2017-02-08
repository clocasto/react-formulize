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
      const wrapper = shallow(<Field />); // eslint-disable-line
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
    let wrapper;

    before('Assemble a custom input element', () => {
      wrapper = mount(
        <Field value={'value!'}>
          <div>
            <h4>My Test Input!</h4>
            {props => <input value={props.value} onChange={props.onChange} />}
          </div>
        </Field>);
    });

    it('will wrap a custom input component nested in the `Field` tag', () => {
      expect(wrapper.find(Field)).to.have.length(1);
      expect(wrapper.find('h4')).to.have.length(1);
      expect(wrapper.find('h4').text()).to.equal('My Test Input!');
    });

    it('passes `props` down to the custom `Input` component', () => {
      const onChange = (e) => { console.log(e.target); }; // eslint-disable-line
      wrapper = mount(
        <Field label="pass" value="123goodPass" onChange={onChange}>
          <h4>My Test Input!</h4>
          <Input>
            {props => <input value={props.value} onChange={props.onChange} />}
          </Input>
        </Field>,
      );

      expect(wrapper.find(Field)).to.have.length(1);
      expect(wrapper.find('h4')).to.have.length(1);
      expect(wrapper.find('h4').text()).to.equal('My Test Input!');

      const renderedCustomInput = wrapper.find('Input');
      expect(renderedCustomInput).to.have.length(1);

      const renderedCustomInputProps = renderedCustomInput.props();

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
      const vanillaWrapper = mount(<Field />);
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

  describe('`Field` method tests', () => {
    let wrapper;
    let shouldUpdateSpy;
    let willUpdateSpy;
    let willUnmountSpy;

    before('Set up lifecycle spies', () => {
      shouldUpdateSpy = sinon.spy(Field.prototype, 'shouldComponentUpdate');
      willUpdateSpy = sinon.spy(Field.prototype, 'componentWillUpdate');
      willUnmountSpy = sinon.spy(Field.prototype, 'componentWillUnmount');
    });

    beforeEach('Assemble a custom input element', () => {
      wrapper = mount(<Field value="firstValue" />);
    });

    afterEach('', () => {
      shouldUpdateSpy.reset();
      willUpdateSpy.reset();
      willUnmountSpy.reset();
    });

    it('Component should call shouldComponentUpdate on update', () => {
      expect(willUpdateSpy.calledOnce).to.equal(false);
      expect(shouldUpdateSpy.calledOnce).to.equal(false);
      expect(willUnmountSpy.calledOnce).to.equal(false);
      expect(wrapper.state()).to.have.property('value', 'firstValue');

      wrapper.setProps({ value: 'secondValue' });

      expect(willUpdateSpy.called).to.equal(true);
      expect(shouldUpdateSpy.calledTwice).to.equal(true);
      expect(willUnmountSpy.called).to.equal(false);
      expect(wrapper.state()).to.have.property('value', 'secondValue');
    });

    xit('Component should not re-render if `props.value` equals its internal state', () => {
      expect(willUpdateSpy.calledOnce).to.equal(false);
      expect(shouldUpdateSpy.callCount).to.equal(0);
      expect(willUnmountSpy.calledOnce).to.equal(false);
      expect(wrapper.state()).to.have.property('value', 'firstValue');
      expect(wrapper.instance()).to.have.property('finalValue', null);
      console.log(`BEFORE firstValue >>> ${wrapper.state().value}>>>`, shouldUpdateSpy.returnValues);
      wrapper.find('input').simulate('change', { target: { value: 'firstValue' } });
      console.log(`AFTER firstValue >>> ${wrapper.state().value}>>>`, shouldUpdateSpy.returnValues);

      expect(shouldUpdateSpy.callCount).to.equal(1);
      expect(shouldUpdateSpy.calledBefore(willUpdateSpy)).to.equal(true);
      expect(willUpdateSpy.callCount).to.equal(1);
      expect(wrapper.state()).to.have.property('value', 'firstValue');

      // willUpdateSpy.reset();
      console.log(`BEFORE secondValue >>> ${wrapper.state().value}>>>`, shouldUpdateSpy.returnValues);
      wrapper.find('input').simulate('change', { target: { value: 'secondValue' } });
      console.log(`AFTER secondValue >>> ${wrapper.state().value}>>>`, shouldUpdateSpy.returnValues);

      // expect(shouldUpdateSpy.callCount).to.equal(2);
      // expect(shouldUpdateSpy.calledBefore(willUpdateSpy)).to.equal(true);
      console.log(shouldUpdateSpy.returnValues);
      // expect(willUpdateSpy.callCount).to.equal(1);
      // expect(wrapper.state()).to.have.property('value', 'secondValue');
    });
  });
});

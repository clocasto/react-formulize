/* globals describe it before beforeEach after afterEach */
import React from 'react';
import sinon from 'sinon'; // eslint-disable-line
import { expect } from 'chai'; // eslint-disable-line
import { shallow, mount } from 'enzyme'; // eslint-disable-line

import { Field, Input } from '../../dist/index';
import { updateInput, simulateChange } from '../spec_helpers';

describe('<Field /> Higher-Order-Component', () => {
  const nameField = { name: 'name', value: 'Test Name' };

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
    let onChange = evt => { console.log(evt.target); }; // eslint-disable-line

    before('Assemble a custom input element', () => {
      wrapper = mount(
        <Field value={'value!'} onChange={onChange}>
          <h4>My Test Input!</h4>
          <Input>
            {props => <input value={props.value} onChange={props.onChange} />}
          </Input>
        </Field>);
    });

    it('will wrap a custom input component nested in the `Field` tag', () => {
      expect(wrapper.find(Field)).to.have.length(1);
      expect(wrapper.find('h4')).to.have.length(1);
      expect(wrapper.find('h4').text()).to.equal('My Test Input!');
    });

    it('passes `props` down to the custom `Input` component', () => {
      expect(wrapper.find(Field)).to.have.length(1);
      expect(wrapper.find('h4')).to.have.length(1);
      expect(wrapper.find('h4').text()).to.equal('My Test Input!');

      const renderedCustomInput = wrapper.find('Input');
      expect(renderedCustomInput).to.have.length(1);

      const renderedCustomInputProps = renderedCustomInput.props();

      expect(renderedCustomInputProps).to.have.property('value', renderedCustomInputProps.value);
      expect(renderedCustomInputProps).to.have.property('name', renderedCustomInputProps.name);
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

      const wrapper = mount(<Field name={'email'} type="text" />);

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
      const wrapper = mount(<Field name={'email'} type="text" required />);

      expect(wrapper.state()).to.have.property('valid', false);

      updateInput(wrapper, 'test@test.test');

      expect(wrapper.state()).to.have.property('value', 'test@test.test');
      expect(wrapper.state()).to.have.property('valid', true);

      updateInput(wrapper, '');

      expect(wrapper.state()).to.have.property('value', '');
      expect(wrapper.state()).to.have.property('valid', false);
    });
  });

  describe('`Field` lifecycle method tests', () => {
    let wrapper;
    let shouldUpdateSpy;
    let willUpdateSpy;
    let willUnmountSpy;
    let renderSpy;

    before('Set up lifecycle spies', () => {
      shouldUpdateSpy = sinon.spy(Field.prototype, 'shouldComponentUpdate');
      willUpdateSpy = sinon.spy(Field.prototype, 'componentWillUpdate');
      willUnmountSpy = sinon.spy(Field.prototype, 'componentWillUnmount');
      renderSpy = sinon.spy(Field.prototype, 'render');
    });

    beforeEach('Assemble a custom input element', () => {
      wrapper = mount(<Field value="firstValue" />);
    });

    afterEach('', () => {
      shouldUpdateSpy.reset();
      willUpdateSpy.reset();
      willUnmountSpy.reset();
      renderSpy.reset();
    });

    after('unwrap methods', () => {
      Field.prototype.shouldComponentUpdate.restore();
      Field.prototype.componentWillUpdate.restore();
      Field.prototype.componentWillUnmount.restore();
      Field.prototype.render.restore();
    });

    it('Component should call shouldComponentUpdate on update', () => {
      expect(shouldUpdateSpy.callCount).to.equal(0);
      expect(willUpdateSpy.callCount).to.equal(0);
      expect(renderSpy.callCount).to.equal(1);
      expect(wrapper.state()).to.have.property('value', 'firstValue');

      simulateChange(wrapper, 'secondValue');

      expect(shouldUpdateSpy.callCount).to.equal(1);
      expect(shouldUpdateSpy.calledBefore(willUpdateSpy)).to.equal(true);
      expect(willUpdateSpy.callCount).to.equal(1);
      expect(renderSpy.callCount).to.equal(2);
      expect(wrapper.state()).to.have.property('value', 'secondValue');
    });

    it('Component should not re-render if `props.value` equals its internal state', () => {
      expect(shouldUpdateSpy.callCount).to.equal(0);
      expect(willUpdateSpy.callCount).to.equal(0);
      expect(renderSpy.callCount).to.equal(1);
      expect(wrapper.state()).to.have.property('value', 'firstValue');
      expect(wrapper.instance()).to.have.property('finalValue', null);

      simulateChange(wrapper, 'firstValue');

      expect(shouldUpdateSpy.callCount).to.equal(1);
      expect(shouldUpdateSpy.calledBefore(willUpdateSpy)).to.equal(true);
      expect(willUpdateSpy.callCount).to.equal(0);
      expect(renderSpy.callCount).to.equal(1);
      expect(wrapper.state()).to.have.property('value', 'firstValue');
    });

    it('Component should re-render if `props.value` doesn\'t equal its internal state', () => {
      expect(shouldUpdateSpy.callCount).to.equal(0);
      expect(willUpdateSpy.callCount).to.equal(0);
      expect(renderSpy.callCount).to.equal(1);
      expect(wrapper.state()).to.have.property('value', 'firstValue');
      expect(wrapper.instance()).to.have.property('finalValue', null);

      simulateChange(wrapper, 'secondValue');

      expect(shouldUpdateSpy.callCount).to.equal(1);
      expect(shouldUpdateSpy.calledBefore(willUpdateSpy)).to.equal(true);

      expect(willUpdateSpy.callCount).to.equal(1);
      expect(renderSpy.callCount).to.equal(2);
      expect(wrapper.state()).to.have.property('value', 'secondValue');
      expect(wrapper.instance()).to.have.property('finalValue', 'secondValue');
    });

    it('Upon unmounting, component will broadcast its value and cancel further broadcasts', () => {
      const cancelBroadcastSpy = sinon.spy(wrapper.instance(), 'cancelBroadcast');
      const broadcastChangeSpy = sinon.spy(wrapper.instance(), 'broadcastChange');

      expect(willUnmountSpy.callCount).to.equal(0);
      expect(cancelBroadcastSpy.callCount).to.equal(0);
      expect(broadcastChangeSpy.callCount).to.equal(0);
      expect(wrapper.state()).to.have.property('value', 'firstValue');
      expect(wrapper.instance()).to.have.property('finalValue', null);

      simulateChange(wrapper, 'secondValue');

      expect(willUnmountSpy.callCount).to.equal(0);
      expect(cancelBroadcastSpy.callCount).to.equal(0);
      expect(broadcastChangeSpy.callCount).to.equal(0);
      expect(wrapper.instance()).to.have.property('finalValue', 'secondValue');

      wrapper.unmount();

      expect(willUnmountSpy.callCount).to.equal(1);
      expect(cancelBroadcastSpy.callCount).to.equal(1);
      expect(broadcastChangeSpy.callCount).to.equal(1);
    });
  });

  describe('Debounce', () => {
    let wrapper;
    let willUpdateSpy;

    before('Set up lifecycle spies', () => {
      willUpdateSpy = sinon.spy(Field.prototype, 'componentWillUpdate');
    });

    beforeEach('Assemble a custom input element', () => {
      // eslint-disable-next-line
      wrapper = mount(<Field debounce="300" value="firstValue" />);
    });

    afterEach('', () => {
      willUpdateSpy.reset();
    });

    after('unwrap methods', () => {
      Field.prototype.componentWillUpdate.restore();
    });

    it('Should update its state instantaneously on change', () => {
      expect(willUpdateSpy.callCount).to.equal(0);
      expect(wrapper.state()).to.have.property('value', 'firstValue');
      expect(wrapper.state()).to.have.property('debounce', 300);

      simulateChange(wrapper, 'secondValue');

      expect(wrapper.state()).to.have.property('value', 'secondValue');
      expect(willUpdateSpy.callCount).to.equal(1);
    });

    it('Should invoke its `props.onChange` after the debounce amount', (done) => {
      const debounce = 250;
      const onChangeSpy = sinon.spy();
      wrapper = mount(<Field debounce={debounce} value="firstValue" onChange={onChangeSpy} />);

      expect(willUpdateSpy.callCount).to.equal(0);
      expect(onChangeSpy.callCount).to.equal(0);
      expect(wrapper.state()).to.have.property('value', 'firstValue');
      expect(wrapper.state()).to.have.property('debounce', debounce);

      simulateChange(wrapper, 'secondValue');

      expect(wrapper.state()).to.have.property('value', 'secondValue');
      expect(onChangeSpy.callCount).to.equal(0);
      expect(willUpdateSpy.callCount).to.equal(1);

      setTimeout(() => {
        expect(onChangeSpy.callCount).to.equal(1);
        done();
      }, 600);
    });
  });
});

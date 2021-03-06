/* globals describe it before beforeEach after afterEach */
import React from 'react';
import sinon from 'sinon'; // eslint-disable-line
import { expect } from 'chai'; // eslint-disable-line
import { shallow, mount } from 'enzyme'; // eslint-disable-line

import { Field } from '../../dist/index';
import { updateInput } from '../spec_helpers';

describe('<Field /> Higher-Order-Component', () => {
  const nameField = { name: 'name', value: 'Test Name' };

  describe('Default Field', () => {
    it('by default renders an `Input` component', () => {
      const wrapper = shallow(<Field />); // eslint-disable-line
      expect(wrapper.find('input')).to.have.length(1);
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
          <input />
        </Field>);
    });

    it('will wrap a custom input component nested in the `Field` tag', () => {
      expect(wrapper.find(Field)).to.have.length(1);
      expect(wrapper.find('h4')).to.have.length(1);
      expect(wrapper.find('h4').text()).to.equal('My Test Input!');
      expect(wrapper.find('input').exists()).to.be.true; // eslint-disable-line
    });

    it('passes `props` down to the nested field component', () => {
      expect(wrapper.find(Field)).to.have.length(1);
      expect(wrapper.find('h4')).to.have.length(1);
      expect(wrapper.find('h4').text()).to.equal('My Test Input!');

      const renderedCustomInput = wrapper.find('input');
      expect(renderedCustomInput).to.have.length(1);

      const renderedCustomInputProps = renderedCustomInput.props();

      expect(renderedCustomInputProps).to.have.property('value', renderedCustomInputProps.value);
      expect(renderedCustomInputProps).to.have.property('name', renderedCustomInputProps.name);

      expect(renderedCustomInputProps).to.have.property('onChange');
      expect(typeof renderedCustomInputProps.onChange).to.eql('function');
    });

    it('passes `props` down to the custom `Input` component flagged as input', () => {
      const Input = () => <input />;
      wrapper = mount(
        <Field value={'value!'} name="test_input" onChange={onChange}>
          <Input input />
        </Field>);

      const customInput = wrapper.find(Input);
      expect(customInput).to.have.length(1);

      const customInputProps = customInput.props();
      expect(customInputProps).to.have.property('onChange');
      expect(customInputProps).to.have.property('value', 'value!');
      expect(customInputProps).to.have.property('type', 'text');
      expect(typeof customInputProps.onChange).to.eql('function');
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

  describe('Passing down status', () => {
    const TestComponent = () => <span>Test!</span>;
    let wrapper;
    let first;
    let second;
    let third;

    beforeEach('Set up a basic form with testComponents in different configurations', () => {
      wrapper = mount(
        <Field name="name" value="" required>
          <input />
          <span>Hi There!</span>
          <div>
            <TestComponent valid />
          </div>
          <TestComponent pristine />
          <TestComponent valid pristine>
            <span>Hi There!</span>
          </TestComponent>
        </Field>,
      );
      first = wrapper.find(TestComponent).first();
      second = wrapper.find(TestComponent).at(1);
      third = wrapper.find(TestComponent).last();
    });

    it('passes validity information down to components with a `valid` prop', () => {
      expect(first.props()).to.have.property('name_valid', false);

      expect(second.props()).to.not.have.property('name_valid');
    });

    it('passes pristine information down to components with a `pristine` prop', () => {
      expect(second.props()).to.have.property('name_pristine', true);

      updateInput(wrapper, 'secondValue');
      expect(second.props()).to.have.property('name_pristine', false);

      expect(first.props()).to.not.have.property('name_pristine');
    });

    it('passes valid and pristine info down to components with flags', () => {
      expect(third.props()).to.have.property('name_valid', false);
      expect(third.props()).to.have.property('name_pristine', true);

      updateInput(wrapper, 'Test Name');
      expect(third.props()).to.have.property('name_pristine', false);
      expect(third.props()).to.have.property('name_valid', true);
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

      updateInput(wrapper, 'secondValue');

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

      updateInput(wrapper, 'firstValue');

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

      updateInput(wrapper, 'secondValue');

      expect(shouldUpdateSpy.callCount).to.equal(1);
      expect(shouldUpdateSpy.calledBefore(willUpdateSpy)).to.equal(true);

      expect(willUpdateSpy.callCount).to.equal(1);
      expect(renderSpy.callCount).to.equal(2);
      expect(wrapper.state()).to.have.property('value', 'secondValue');
      expect(wrapper.instance()).to.have.property('finalValue', 'secondValue');
    });

    it('Component should reset its state if passed a `value` prop during update', () => {
      const cancelBroadcastSpy = sinon.spy(wrapper.instance(), 'cancelBroadcast');

      expect(willUpdateSpy.callCount).to.equal(0);
      expect(renderSpy.callCount).to.equal(1);
      expect(wrapper.state()).to.have.property('value', 'firstValue');
      expect(wrapper.instance()).to.have.property('finalValue', null);

      updateInput(wrapper, 'secondValue');

      expect(renderSpy.callCount).to.equal(2);
      expect(willUpdateSpy.callCount).to.equal(1);
      expect(wrapper.instance()).to.have.property('finalValue', 'secondValue');

      wrapper.setProps({ value: 'thirdValue' });

      expect(willUpdateSpy.callCount).to.equal(3);
      expect(renderSpy.callCount).to.equal(4);
      expect(cancelBroadcastSpy.callCount).to.equal(1);
      expect(wrapper.instance()).to.have.property('finalValue', 'thirdValue');
    });

    it('Upon unmounting, component will broadcast its value and cancel further broadcasts', () => {
      const cancelBroadcastSpy = sinon.spy(wrapper.instance(), 'cancelBroadcast');
      const broadcastChangeSpy = sinon.spy(wrapper.instance(), 'broadcastChange');

      expect(willUnmountSpy.callCount).to.equal(0);
      expect(cancelBroadcastSpy.callCount).to.equal(0);
      expect(broadcastChangeSpy.callCount).to.equal(0);
      expect(wrapper.state()).to.have.property('value', 'firstValue');
      expect(wrapper.instance()).to.have.property('finalValue', null);

      updateInput(wrapper, 'secondValue');

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

      updateInput(wrapper, 'secondValue');

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

      updateInput(wrapper, 'secondValue');

      expect(wrapper.state()).to.have.property('value', 'secondValue');
      expect(onChangeSpy.callCount).to.equal(0);
      expect(willUpdateSpy.callCount).to.equal(1);

      setTimeout(() => {
        expect(onChangeSpy.callCount).to.equal(1);
        done();
      }, 600);
    });
  });

  describe('Match', () => {
    let wrapper;
    let willUpdateSpy;

    before('Set up lifecycle spies', () => {
      willUpdateSpy = sinon.spy(Field.prototype, 'componentWillUpdate');
    });

    beforeEach('Assemble a custom input element', () => {
      // eslint-disable-next-line
      wrapper = mount(<Field match="300" value="firstValue" />);
    });

    afterEach('', () => {
      willUpdateSpy.reset();
    });

    after('unwrap methods', () => {
      Field.prototype.componentWillUpdate.restore();
    });

    it('Should update its match value upon change', () => {
      expect(willUpdateSpy.callCount).to.equal(0);
      expect(wrapper.state()).to.have.property('value', 'firstValue');

      updateInput(wrapper, '300');

      expect(wrapper.state()).to.have.property('value', '300');
      expect(wrapper.state()).to.have.property('valid', true);
      expect(willUpdateSpy.callCount).to.equal(1);

      wrapper.setProps({ match: 400 });

      expect(wrapper.state()).to.have.property('value', '300');
      expect(wrapper.state()).to.have.property('valid', false);
      expect(willUpdateSpy.callCount).to.equal(3);

      updateInput(wrapper, 400);

      expect(wrapper.state()).to.have.property('value', 400);
      expect(wrapper.state()).to.have.property('valid', true);
      expect(willUpdateSpy.callCount).to.equal(4);
    });
  });
});

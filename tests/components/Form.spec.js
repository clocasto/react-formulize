import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import { Form, Field, Input } from '../../dist/index';

describe('<Form /> Higher-Order-Component', () => {
  const nameField = { label: 'name', value: 'Test Name' };
  const emailField = { label: 'email', value: 'user@company.com' };

  describe('Default Form', () => {
    it('contains a <form /> element', () => {
      const wrapper = shallow(<Form />);
      expect(wrapper.contains(<form />)).to.equal(true);
    });

    it('can generate fields from `fields` prop', () => {
      const wrapper = mount(<Form fields={['name', 'email']} />);

      const inputs = wrapper.find('input');

      expect(inputs).to.have.length(2);
      expect(inputs.first().getDOMNode().name).to.equal('name');
      expect(inputs.last().getDOMNode().name).to.equal('email');
    });

    it('can populate fields mapped from `fields` prop', () => {
      const wrapper = mount(<Form fields={[nameField, emailField]} />);

      const inputs = wrapper.find('input');

      expect(inputs).to.have.length(2);
      expect(inputs.first().getDOMNode().value).to.equal('Test Name');
      expect(inputs.last().getDOMNode().value).to.equal('user@company.com');
    });


    it('passes appropriate props down from the `fields` prop', () => {
      const _nameField = Object.assign({}, nameField, { debounce: 300, required: true });

      const wrapper = mount(<Form fields={[_nameField, emailField]} />);

      const fields = wrapper.find(Field);
      expect(fields).to.have.length(2);

      const nameProps = fields.first().props();
      const emailProps = fields.last().props();

      expect(nameProps).to.have.property('debounce', 300);
      expect(nameProps).to.have.property('required', true);
      expect(nameProps).to.have.property('value', _nameField.value);
      expect(emailProps).to.have.property('value', emailField.value);
    });
  });

  describe('Custom Form', () => {
    let customFormConstructor;
    let customFormClass;

    before('Assemble a custom form element', () => {
      const customForm = (
        <form id="test-form">
        <h4>This is my highly-customized test form!</h4>
        <Field value={'10'} onChange={null} label={'name'}></Field>
        <Field value={'15'} onChange={null} label={'email'}></Field>
        <Field value={'20'} onChange={null} type={'password'} label={'password'}></Field>
      </form>);

      customFormConstructor = (props) => customForm;

      customFormClass = class extends React.Component {
        render() {
          return customForm;
        }
      }
    });

    it('will wrap a custom form (constructor function) passed through `Form` prop', () => {
      const wrapper = mount(<Form Form={customFormConstructor} />);

      expect(wrapper.find('#test-form')).to.have.length(1);
      expect(wrapper.find(Field)).to.have.length(3);

      expect(wrapper.find('h4')).to.have.length(1);
      expect(wrapper.find('h4').text()).to.equal('This is my highly-customized test form!');
    });

    it('will wrap a custom form (React Component Subclass) passed through `Form` prop', () => {
      const wrapper = mount(<Form Form={customFormClass} />);

      expect(wrapper.find('#test-form')).to.have.length(1);
      expect(wrapper.find(Field)).to.have.length(3);

      expect(wrapper.find('h4')).to.have.length(1);
      expect(wrapper.find('h4').text()).to.equal('This is my highly-customized test form!');
    });


    it('passes `props.data` down to the custom form component', () => {
      const wrapper = mount(<Form Form={customFormConstructor} fields={['name', 'email', {label: 'pw', value: '123goodPass'}]} />);

      const renderedCustomForm = wrapper.find(customFormConstructor);
      expect(renderedCustomForm).to.have.length(1);

      const renderedCustomFormProps = {
        name: { value: '', valid: false, pristine: false },
        email: { value: '', valid: false, pristine: false },
        pw: { value: '123goodPass', valid: false, pristine: false }
      };

      expect(renderedCustomForm.props()).to.have.property('data');
      expect(renderedCustomForm.props().data).to.eql(renderedCustomFormProps);
    });
  });
});

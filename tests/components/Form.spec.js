import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import { Form, Field } from '../../dist/index';

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

  });
});

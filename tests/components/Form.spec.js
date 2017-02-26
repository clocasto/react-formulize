/* globals describe it before beforeEach after afterEach */
import React from 'react';
import { expect } from 'chai'; // eslint-disable-line
import { shallow, mount } from 'enzyme'; // eslint-disable-line
import sinon from 'sinon'; // eslint-disable-line

import { Form, Field } from '../../dist/index';
import { updateInput } from '../spec_helpers';

describe('<Form /> Higher-Order-Component', () => {
  describe('Default Form', () => {
    let wrapper;
    let inputs;
    let fields;

    beforeEach('mount a testing form', () => {
      wrapper = mount(
        <Form>
          <Field name="name" value="Test Name" />
          <Field name="email" value="user@company.com" />
        </Form>,
      );
      inputs = wrapper.find('input');
      fields = wrapper.find(Field);
    });

    it('contains a <form /> element', () => {
      expect(wrapper.find('form')).to.have.length(1);
    });

    it('can generate fields from `fields` prop', () => {
      expect(fields).to.have.length(2);
      expect(fields.first().props()).to.have.property('name', 'name');
      expect(fields.last().props()).to.have.property('name', 'email');
    });

    it('can populate fields mapped from `fields` prop', () => {
      expect(inputs).to.have.length(2);
      expect(inputs.first().getDOMNode().value).to.equal('Test Name');
      expect(inputs.last().getDOMNode().value).to.equal('user@company.com');
    });


    it('passes appropriate props down through `props.children`', () => {
      wrapper = mount((
        <Form>
          <Field name="name" value="Enter your name" debounce={300} required />
          <Field name="email" value="test@example.com" />
        </Form>
      ));
      fields = wrapper.find(Field);

      expect(fields).to.have.length(2);

      const nameProps = fields.first().props();
      const emailProps = fields.last().props();

      expect(nameProps).to.have.property('debounce', 300);
      expect(nameProps).to.have.property('required', true);
      expect(nameProps).to.have.property('value', 'Enter your name');
      expect(emailProps).to.have.property('value', 'test@example.com');
    });

    it('updates its state upon a Field\'s input changing', () => {
      wrapper = mount((
        <Form>
          <Field name="name" value="Enter your name" length={[6, 12]} alpha />
        </Form>
      ));

      expect(wrapper.state().name).to.eql({
        value: 'Enter your name',
        valid: false,
        pristine: true,
      });

      updateInput(wrapper, 'Way too long of a name');

      expect(wrapper.state().name).to.eql({
        value: 'Way too long of a name',
        valid: false,
        pristine: false,
      });

      updateInput(wrapper, 'Good Name');

      expect(wrapper.state().name).to.eql({
        value: 'Good Name',
        valid: true,
        pristine: false,
      });
    });

    it('invoked an onSubmit callback upon form submission', () => {
      const onSubmitSpy = sinon.spy();
      wrapper = mount(
        <Form onSubmit={onSubmitSpy}>
          <Field name="name" value="firstValue" />
          <button type="submit" />
        </Form>,
      );

      expect(onSubmitSpy.callCount).to.eql(0);

      wrapper.find('form').simulate('submit');

      expect(onSubmitSpy.callCount).to.eql(1);
      expect(onSubmitSpy.calledWith(wrapper.state())).to.eql(true);
    });

    it('can be reset through invoking the `reset` method on the instance', () => {
      const formResetSpy = sinon.spy(Form.prototype, 'reset');

      wrapper = mount(
        <Form>
          <Field name="name" value="firstValue" />
          <button type="submit" />
        </Form>,
      );

      expect(formResetSpy.callCount).to.eql(0);
      expect(wrapper.state().name).to.eql({
        value: 'firstValue',
        valid: false,
        pristine: true,
      });

      updateInput(wrapper, 'secondValue');

      expect(wrapper.state().name).to.eql({
        value: 'secondValue',
        valid: true,
        pristine: false,
      });

      wrapper.instance().reset();

      expect(formResetSpy.callCount).to.eql(1);
      expect(wrapper.state().name).to.eql({
        value: 'firstValue',
        valid: false,
        pristine: true,
      });

      Form.prototype.reset.restore();
    });

    it('passes validity information down to components with a `valid` prop', () => {
      wrapper = mount(
        <Form>
          <Field name="name" value="Test Name" valid />
          <Field name="email" value="user@company.com!!" email />
        </Form>,
      );

      expect(wrapper.find(Field).first().props()).to.have.property('name_valid', true);
      expect(wrapper.find(Field).first().props()).to.have.property('email_valid', false);
      expect(wrapper.find(Field).last().props()).to.not.have.property('name_valid');
      expect(wrapper.find(Field).last().props()).to.not.have.property('email_valid');
    });

    it('passes pristine information down to components with a `pristine` prop', () => {
      wrapper = mount(
        <Form>
          <Field name="name" value="Test Name" pristine />
        </Form>,
      );

      expect(wrapper.find(Field).first().props()).to.have.property('name_pristine', true);

      updateInput(wrapper, 'secondValue');
      expect(wrapper.find(Field).first().props()).to.have.property('name_pristine', false);
    });

    it(
      'passes both valid and pristine information down to components with both `valid` and `pristine` props',
      () => {
        wrapper = mount(
          <Form>
            <Field name="name" value="Test Name" required valid pristine />
          </Form>,
        );

        expect(wrapper.find(Field).first().props()).to.have.property('name_pristine', true);
        expect(wrapper.find(Field).first().props()).to.have.property('name_valid', false);

        updateInput(wrapper, 'firstValue');
        expect(wrapper.find(Field).first().props()).to.have.property('name_pristine', false);
        expect(wrapper.find(Field).first().props()).to.have.property('name_valid', true);
      },
    );
  });
});

import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import { Form, Field, Input } from '../../dist/index';
import { buildField, updateInput } from '../helpers';

import * as validators from '../../src/helpers/validators';

describe.only('Validator Functionality', () => {
  describe('Required', () => {
    const wrapper = buildField(mount, 'required', true);
    let valFunc = validators.required();

    it('returns true for non-empty input', () => {
      expect(valFunc('Test Input')).to.equal(true);
      expect(valFunc('123')).to.equal(true);
      expect(valFunc(123)).to.equal(true);
      expect(valFunc(0)).to.equal(true);
    });

    it('returns false for empty input', () => {
      expect(valFunc('')).to.equal(false);
    });

    it('returns false for non-valid input', () => {
      expect(valFunc({ param: 'value' })).to.equal(false);
      expect(valFunc(() => {})).to.equal(false);
      expect(valFunc(null)).to.equal(false);
      expect(valFunc(undefined)).to.equal(false);
      expect(valFunc(new Promise((resolve, reject) => {}))).to.equal(false);
    });

    it('is properly used by a `Field` component to validate', () => {
      expect(wrapper.state()).to.have.property('valid', false);
      expect(wrapper.state()).to.have.property('value', '');

      updateInput(wrapper, 'test input!');

      expect(wrapper.state()).to.have.property('valid', true);
      expect(wrapper.state()).to.have.property('value', 'test input!');

      updateInput(wrapper, '');

      expect(wrapper.state()).to.have.property('valid', false);
      expect(wrapper.state()).to.have.property('value', '');
    });
  });

  describe('Email', () => {
    const wrapper = buildField(mount, 'email', true);
    let valFunc = validators.email();

    it('returns `true` for valid email addresses', () => {
      expect(valFunc('test@test.com')).to.equal(true);
      expect(valFunc('test.test.test@test.com')).to.equal(true);
      expect(valFunc('test@test.test.test')).to.equal(true);
      expect(valFunc('test.test@test.test')).to.equal(true);
    });

    it('returns `false` for invalid email addresses', () => {
      expect(valFunc('test@test.')).to.equal(false);
      expect(valFunc('test@@test.test.test')).to.equal(false);
      expect(valFunc('test.test@test..test')).to.equal(false);
      expect(valFunc('test..test@test.test')).to.equal(false);
    });

    it('is properly used by a `Field` component to validate', () => {
      expect(wrapper.state()).to.have.property('valid', false);
      expect(wrapper.state()).to.have.property('value', '');

      updateInput(wrapper, 'test@test.test');

      expect(wrapper.state()).to.have.property('valid', true);
      expect(wrapper.state()).to.have.property('value', 'test@test.test');

      updateInput(wrapper, '');

      expect(wrapper.state()).to.have.property('valid', false);
      expect(wrapper.state()).to.have.property('value', '');
    });

    it('can take a custom regular expression for validating', () => {
      const _wrapper = buildField(mount, 'email', /test\@test\.test/);

      expect(_wrapper.state()).to.have.property('valid', false);
      expect(_wrapper.state()).to.have.property('value', '');

      //Updating input to valid email which doesn't match RegEx
      updateInput(_wrapper, 'valid@email.com');
      expect(_wrapper.state()).to.have.property('valid', false);
      expect(_wrapper.state()).to.have.property('value', 'valid@email.com');

      //Updating input to matching email
      updateInput(_wrapper, 'test@test.test');
      expect(_wrapper.state()).to.have.property('valid', true);
      expect(_wrapper.state()).to.have.property('value', 'test@test.test');

      //Updating input to valid email which doesn't match RegEx
      updateInput(_wrapper, 'test@test.tes');
      expect(_wrapper.state()).to.have.property('valid', false);
      expect(_wrapper.state()).to.have.property('value', 'test@test.tes');
    });
  });

  describe('Length', () => {
    const wrapper = buildField(mount, 'length', [6, 10]);

    const minLen = 6;
    const maxLen = 10;

    /**
     * Length Validator Function
     * @lengthArray {Array} - [minLen, maxLen] OR [maxLen]
     */
    let valFunc = validators.length([minLen, maxLen]);

    it('returns `true` for inputs `>=minLen` and `<=maxLen`', () => {
      expect(valFunc('123456')).to.equal(true);
      expect(valFunc('0123456789')).to.equal(true);
      expect(valFunc('Test input')).to.equal(true);
      expect(valFunc('\'Quote123\'')).to.equal(true);
    });

    it('returns `false` for inputs `<minLen` and `>maxLen`', () => {
      expect(valFunc('')).to.equal(false);
      expect(valFunc('12345')).to.equal(false);
      expect(valFunc('012345678910')).to.equal(false);
      expect(valFunc('Test Input!')).to.equal(false);
    });

    it('returns `false` for non-string inputs', () => {
      expect(valFunc(12345678)).to.equal(false);
      expect(valFunc(() => '12345678')).to.equal(false);
      expect(valFunc({ value: 'Test Input' })).to.equal(false);
      expect(valFunc(true)).to.equal(false);
    });

    it('is properly used by a `Field` component to validate', () => {
      expect(wrapper.state()).to.have.property('valid', false);
      expect(wrapper.state()).to.have.property('value', '');

      updateInput(wrapper, 'Test Input');

      expect(wrapper.state()).to.have.property('valid', true);
      expect(wrapper.state()).to.have.property('value', 'Test Input');

      updateInput(wrapper, 'Test Input!');

      expect(wrapper.state()).to.have.property('valid', false);
      expect(wrapper.state()).to.have.property('value', 'Test Input!');

      updateInput(wrapper, '0123456789');

      expect(wrapper.state()).to.have.property('valid', true);
      expect(wrapper.state()).to.have.property('value', '0123456789');
    });
  });

  describe('Match', () => {
    const returnValue = () => 'My input value!';
    const wrapper = buildField(mount, 'match', returnValue());
    let valFunc;

    it('', () => {});
  });

  describe('Alpha', () => {
    const wrapper = buildField(mount, 'alpha', true);
    let valFunc;

    it('', () => {});
  });

  describe('Number', () => {
    const wrapper = buildField(mount, 'number', true);
    let valFunc;

    it('', () => {});
  });

  describe('Max', () => {
    const wrapper = buildField(mount, 'Max', 25);
    let valFunc;

    it('', () => {});
  });

  describe('Min', () => {
    const wrapper = buildField(mount, 'Min', 16);
    let valFunc;

    it('', () => {});
  });
});

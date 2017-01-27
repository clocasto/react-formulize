import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import { Form, Field, Input } from '../../dist/index';
import { buildField, updateInput } from '../helpers';

import * as validators from '../../src/helpers/validators';

describe('Validator Functionality', () => {
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
      expect(valFunc('')).to.equal(false);
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
    const minLen = 6;
    const maxLen = 10;

    const wrapper = buildField(mount, 'length', [minLen, maxLen]);
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
    let valFunc = validators.match(returnValue);

    it('returns `true` for a matching input', () => {
      expect(valFunc('My input value!')).to.equal(true);
    });

    it('returns `false` for non-matching inputs', () => {
      expect(valFunc('')).to.equal(false);
      expect(valFunc({ value: 'My input value!' })).to.equal(false);
      expect(valFunc('My input value')).to.equal(false);
      expect(valFunc(() => 'My input value!')).to.equal(false);
    });

    it('is properly used by a `Field` component to validate', () => {
      expect(wrapper.state()).to.have.property('valid', false);
      expect(wrapper.state()).to.have.property('value', '');

      updateInput(wrapper, 'Wrong Input!');

      expect(wrapper.state()).to.have.property('valid', false);
      expect(wrapper.state()).to.have.property('value', 'Wrong Input!');

      updateInput(wrapper, 'My input value!');

      expect(wrapper.state()).to.have.property('valid', true);
      expect(wrapper.state()).to.have.property('value', 'My input value!');

      updateInput(wrapper, 'Will this work?');

      expect(wrapper.state()).to.have.property('valid', false);
      expect(wrapper.state()).to.have.property('value', 'Will this work?'); // No!
    });
  });

  describe.only('Alpha', () => {
    const wrapper = buildField(mount, 'alpha', true);
    let valFunc = validators.alpha();

    // Implemented to only supports english
    it('returns `true` for strings consisting of only alphabet and space characters', () => {
      expect(valFunc('')).to.equal(true);
      expect(valFunc('abc')).to.equal(true);
      expect(valFunc('ABC')).to.equal(true);
      expect(valFunc('AaBbCc')).to.equal(true);
      expect(valFunc('AaBbCc Second Word')).to.equal(true);
      expect(valFunc('\t\n ')).to.equal(true);
    });

    it('returns `false` for text inputs with non-alphabet characters', () => {
      expect(valFunc('_')).to.equal(false);
      expect(valFunc('abc!')).to.equal(false);
      expect(valFunc('ABC*')).to.equal(false);
      expect(valFunc('$AaBbCc')).to.equal(false);
      expect(valFunc('$!\.')).to.equal(false);
      expect(valFunc('0123')).to.equal(false);
      expect(valFunc('Is this valid?')).to.equal(false);
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

      updateInput(wrapper, 'Testing \ttabs and \nnewlines');

      expect(wrapper.state()).to.have.property('valid', true);
      expect(wrapper.state()).to.have.property('value', 'Testing \ttabs and \nnewlines');
    });
  });

  describe('Number', () => {
    const wrapper = buildField(mount, 'number', true);
    let valFunc = validators.numeric();

    it('returns `true` for', () => {
      expect(wrapper.state()).to.have.property('valid', false);
      expect(wrapper.state()).to.have.property('value', '');
    });

    it('returns `false` for', () => {
      expect(wrapper.state()).to.have.property('valid', false);
      expect(wrapper.state()).to.have.property('value', '');
    });

    it('is properly used by a `Field` component to validate', () => {
      expect(wrapper.state()).to.have.property('valid', false);
      expect(wrapper.state()).to.have.property('value', '');
    });
  });

  describe('Max', () => {
    const criterion = 6;

    const wrapper = buildField(mount, 'Max', criterion);
    let valFunc = validators.max(criterion);

    it('returns `true` for', () => {
      expect(wrapper.state()).to.have.property('valid', false);
      expect(wrapper.state()).to.have.property('value', '');
    });

    it('returns `false` for', () => {
      expect(wrapper.state()).to.have.property('valid', false);
      expect(wrapper.state()).to.have.property('value', '');
    });

    it('is properly used by a `Field` component to validate', () => {
      expect(wrapper.state()).to.have.property('valid', false);
      expect(wrapper.state()).to.have.property('value', '');
    });
  });

  describe('Min', () => {
    const criterion = 6;

    const wrapper = buildField(mount, 'Min', criterion);
    let valFunc = validators.min(criterion);

    it('returns `true` for', () => {
      expect(wrapper.state()).to.have.property('valid', false);
      expect(wrapper.state()).to.have.property('value', '');
    });

    it('returns `false` for', () => {
      expect(wrapper.state()).to.have.property('valid', false);
      expect(wrapper.state()).to.have.property('value', '');
    });

    it('is properly used by a `Field` component to validate', () => {
      expect(wrapper.state()).to.have.property('valid', false);
      expect(wrapper.state()).to.have.property('value', '');
    });
  });
});

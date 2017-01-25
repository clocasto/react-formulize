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
  });

  describe('Email', () => {
    const wrapper = buildField(mount, 'email', true);
    let valFunc;

    it('', () => {});
  });

  describe('Length', () => {
    const wrapper = buildField(mount, 'length', [6, 10]);
    let valFunc;

    it('', () => {});
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

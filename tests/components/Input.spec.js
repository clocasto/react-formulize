import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import { Form, Field, Input } from '../../dist/index';

describe('<Input /> Presentational Component', () => {
  describe('input element behavior', () => {
    it('contains an input element', () => {
      const wrapper = mount(<Input />);
      expect(wrapper.find('input')).to.have.length(1);
      expect(wrapper.find('label')).to.have.length(1);
    });

    it('will update its value based on the `value` prop passed to it', () => {
      const wrapper = mount(<Input type="text" value={'I am a value!'} onChange={() => {}}/>);

      expect(wrapper.find('input').getDOMNode().value).to.equal('I am a value!');
    });

    it('will update the input\'s type based on the `type` prop passed to it', () => {
      const emailWrapper = mount(<Input type="email" value={'email@email.com'} onChange={() => {}}/>);
      const passwordWrapper = mount(<Input type="password" value={'Password123!'} onChange={() => {}}/>);
      const checkboxWrapper = mount(<Input type="checkbox" checked={true} value={'on'} onChange={() => {}}/>);

      const emailInput = emailWrapper.find('input').getDOMNode();
      expect(emailInput.type).to.equal('email');
      expect(emailInput.value).to.equal('email@email.com');

      const passwordInput = passwordWrapper.find('input').getDOMNode();
      expect(passwordInput.type).to.equal('password');
      expect(passwordInput.value).to.equal('Password123!');

      const checkboxInput = checkboxWrapper.find('input').getDOMNode();
      expect(checkboxInput.type).to.equal('checkbox');
      expect(checkboxInput.value).to.equal('on');
      expect(checkboxInput.checked).to.equal(true);
    });
  });
});

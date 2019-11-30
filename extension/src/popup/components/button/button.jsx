import React from 'react';
import PropTypes from 'prop-types';
import './button.scss';

const Button = props => <button className="icbs-button" onClick={props.action}>{ props.label }wowo</button>;

Button.propTypes = {
  action: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default Button;

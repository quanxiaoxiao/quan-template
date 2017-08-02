import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import style from './Button.scss';

const Button = ({ className, ...other }) => (
  <button
    className={cn(style.main, className)}
    {...other}
  />
);

Button.propTypes = {
  className: PropTypes.string,
};

export default Button;

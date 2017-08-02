import React from 'react';
import PropTypes from 'prop-types';

import Button from '../../components/Button';

import './core.scss';
import style from './App.scss';

const App = props => (
  <div className={style.main}>
    {props.children}
    <Button className="quan">quan</Button>
  </div>
);

App.propTypes = {
  children: PropTypes.node,
};

export default App;

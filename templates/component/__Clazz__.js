import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './{{name}}.scss';

class {{name}} extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    return (
      <div className={style.main}>
      </div>
    );
  }
}

{{name}}.propTypes = {
};

export default {{name}};

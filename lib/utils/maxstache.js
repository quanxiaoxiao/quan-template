const parse = ctx => (s, i) => {
  if (i % 2 === 0) {
    return s;
  }
  return ctx[s];
};

const maxstache = (str = '', ctx = {}) => {
  const tokens = str.split(/{{|}}/);
  return tokens.map(parse(ctx)).join('');
};


module.exports = maxstache;

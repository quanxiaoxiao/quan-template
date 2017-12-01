import test from 'ava';
import {
  getRealPathFromPlaceholderPath,
  getRouteAndPlaceholder,
  mergeConfig,
} from '../lib/utils';

test('getRealPathFromPlaceholderPath', (t) => {
  t.is(getRealPathFromPlaceholderPath('/aa/bb/_', 'quan'), '/aa/bb/quan');
  t.is(getRealPathFromPlaceholderPath('/aa/bb/_/', 'quan'), '/aa/bb/quan/');
  t.is(getRealPathFromPlaceholderPath('/aa/bb/_/aa', 'quan'), '/aa/bb/quan/aa');
  t.is(getRealPathFromPlaceholderPath('_', 'quan'), 'quan');
  t.is(getRealPathFromPlaceholderPath('/aa/bb/_s/aa', 'quan'), '/aa/bb/_s/aa');
  t.is(getRealPathFromPlaceholderPath('_/aa/bb', 'quan'), 'quan/aa/bb');
  t.is(getRealPathFromPlaceholderPath('/_/aa/bb', 'quan'), '/quan/aa/bb');
  t.is(getRealPathFromPlaceholderPath('/_ /aa/bb', 'quan'), '/_ /aa/bb');
  t.is(getRealPathFromPlaceholderPath('/_/aa/bb/_', 'quan'), '/quan/aa/bb/quan');
});

test('getRouteAndPlaceholder', (t) => {
  let result = getRouteAndPlaceholder({ name: 'Quan', flag: '' });
  t.deepEqual(result, { route: 'to', placelolder: 'Quan', flag: '' });

  result = getRouteAndPlaceholder({ name: 'Quan', flag: '/' });
  t.deepEqual(result, { route: '/', placelolder: 'Quan', flag: '' });

  result = getRouteAndPlaceholder({ name: 'Quan', flag: 'aaa' });
  t.deepEqual(result, { route: 'to', placelolder: 'Quan', flag: 'aaa' });

  result = getRouteAndPlaceholder({ name: 'Quan', flag: '/aaa' });
  t.deepEqual(result, { route: '/aaa', placelolder: 'Quan', flag: '' });

  result = getRouteAndPlaceholder({ name: 'Quan', flag: 'aaa/' });
  t.deepEqual(result, { route: 'to', placelolder: 'aaa', flag: '' });

  result = getRouteAndPlaceholder({ name: 'Quan', flag: 'aaa/bbb' });
  t.deepEqual(result, { route: 'to', placelolder: 'aaa', flag: 'bbb' });

  result = getRouteAndPlaceholder({ name: 'Quan', flag: 'aaa/bbb/' });
  t.deepEqual(result, { route: 'to', placelolder: 'aaa/bbb', flag: '' });

  result = getRouteAndPlaceholder({ name: 'Quan', flag: '/aaa/bbb' });
  t.deepEqual(result, { route: '/aaa', placelolder: 'Quan', flag: 'bbb' });

  result = getRouteAndPlaceholder({ name: 'Quan', flag: 'aaa/bbb/ccc' });
  t.deepEqual(result, { route: 'to', placelolder: 'aaa/bbb', flag: 'ccc' });

  result = getRouteAndPlaceholder({ name: 'Quan', flag: '/aaa/bbb/ccc' });
  t.deepEqual(result, { route: '/aaa', placelolder: 'bbb', flag: 'ccc' });
});

test('mergeConfig', (t) => {
  const origin = {
    aaa: {
      name: 'quan',
      age: '22',
    },
  };
  t.deepEqual(
    mergeConfig(origin, { bbb: { name: 'rice' } }),
    {
      aaa: {
        name: 'quan',
        age: '22',
      },
      bbb: { name: 'rice' },
    },
  );

  t.deepEqual(
    mergeConfig(origin, { aaa: { name: 'rice' } }),
    {
      aaa: { name: 'rice' },
    },
  );

  t.deepEqual(
    mergeConfig(origin, { aaa: { extend: 'aaa', name: 'rice' } }),
    {
      aaa: { name: 'rice', age: '22' },
    },
  );

  t.deepEqual(
    mergeConfig(origin, { bbb: { extend: 'aaa', name: 'rice' } }),
    {
      aaa: {
        name: 'quan',
        age: '22',
      },
      bbb: { name: 'rice', age: '22' },
    },
  );
});

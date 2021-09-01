import _toString from 'lodash/toString';

const makeDelaySearch = (delay = 200) => {
  let timeout = null;

  return (callback) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(function () {
      callback();
    }, delay);
  };
};

const search = (value, searchKey) => {
  const source = _toString(value).toLowerCase();
  const dif = _toString(searchKey).toLowerCase();
  return source.indexOf(dif) !== -1;
};

export { makeDelaySearch, search };
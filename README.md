# react-virtua-select

> react-virtua-select

[![NPM](https://img.shields.io/npm/v/react-virtua-select.svg)](https://www.npmjs.com/package/react-virtua-select) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-virtua-select
```

## Demo
Demo and playground are available [here](https://bonnv79.github.io/react-virtua-select/)

## Versions
[CHANGELOG](CHANGELOG.md)

## Usage Example
```JavaScript
import React from 'react';
import VirtualizedSelect from 'react-virtua-select';

const options = [
  {
    value: 'item-1',
    label: 'item 1',
  },
   {
    value: 'item-2',
    label: 'item 2',
  },
   {
    value: 'item-3',
    label: 'item 3',
  }
];

const Demo = () => {
  const [value, setValue] = React.useState('');
  return (
    <VirtualizedSelect options={options} value={value} onChange={setValue} />
  );
};
```

## Develop

In the project directory, you can run:

### `npm install`
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:6006](http://localhost:6006) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## License

MIT © [bonnv79](https://github.com/bonnv79)

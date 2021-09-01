import React from 'react';

import VirtualizedSelect from '../components';

export default {
  title: 'Example/Virtualizedselect',
  component: VirtualizedSelect,
  argTypes: {
    rowCount: {
      control: { type: 'number' }
    },
  },
};

const getRows = (rowCount = 0) => {
  const rows = [];

  for (let i = 0; i < rowCount; i += 1) {
    rows.push({
      value: `item-${i}`,
      label: `Item ${i}`,
    });
  }

  return rows;
}

const Template = (args) => {
  const [value, setValue] = React.useState('');
  return (
    <VirtualizedSelect {...args} options={getRows(args.rowCount)} value={value} onChange={setValue} />
  );
};

export const Virtualizedselect = Template.bind({});
Virtualizedselect.args = {
  isClearable: true,
  isSearchable: true,
  isMulti: false,
  isDisabled: false,
  valueKey: "value",
  labelKey: "label",
  maxHeight: 280,
  optionHeight: 35,
  // Only for demo
  rowCount: 100
};
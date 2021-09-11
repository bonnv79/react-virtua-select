/* eslint-disable no-unused-vars */
/** @flow */
import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { AutoSizer, List } from 'react-virtualized';
import _toString from 'lodash/toString';
import _findIndex from 'lodash/findIndex';
import _keyBy from 'lodash/keyBy';
import _filter from 'lodash/filter';
import clsx from 'clsx';
import classes from './styles.module.css';
import { makeDelaySearch, search } from './utils';

let delaySearch = makeDelaySearch();

class VirtualizedSelect extends React.Component {
  constructor(props) {
    super(props);

    const { value, valueKey, isMulti } = props;

    this.state = {
      inputValue: '',
      searchKey: '',
      endSearch: false,
      originalValue: value,
      objectValue: isMulti ? _keyBy(value, valueKey) : null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.isMulti && props.value !== state.originalValue) {
      return {
        originalValue: props.value,
        objectValue: _keyBy(props.value, props.valueKey),
      };
    }
    return null;
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  onInputChange = value => {
    const { searchKey } = this.state;
    this.setState({
      inputValue: value,
      endSearch: false
    });
    delaySearch(() => {
      this.setState({
        searchKey: value,
        endSearch: true
      });
    });
  };

  getClassName = className => {
    const { classes } = this.props;
    return clsx(className, classes[className]);
  };

  _renderMenu = (props) => {
    const { selectOption, isMulti } = props;
    const {
      listProps,
      labelKey,
      valueKey,
      options: opts,
      value,
      optionRenderer,
      noOptionsMessage,
      maxHeight,
      optionHeight
    } = this.props;
    const { searchKey, endSearch, objectValue } = this.state;
    let options = opts;
    let focusedOptionIndex = 0;

    if (searchKey && endSearch) {
      options = _filter(options, item => search(item[labelKey], searchKey));
    }
    if (!isMulti && value) {
      focusedOptionIndex = _findIndex(options, [valueKey, value[valueKey]]);
    }
    let _optionRenderer = this._optionRenderer;
    if (typeof optionRenderer === 'function') {
      _optionRenderer = optionRenderer;
    }

    function rowRenderer({ key, index, style }) {
      const option = options[index];
      let selected = false;
      if (value) {
        const id = option[valueKey];
        selected = isMulti ? objectValue[id] : value[valueKey] === id;
      }
      return _optionRenderer({
        key,
        style,
        index,
        option,
        selectOption,
        valueKey,
        labelKey,
        value,
        selected,
      });
    }

    const rowCount = options.length;

    return rowCount > 0 ? (
      <AutoSizer disableHeight>
        {({ width }) => (
          <List
            className={this.getClassName('VirtualizedSelect__Grid')}
            height={Math.min(optionHeight * rowCount, maxHeight)}
            ref={this._setListRef}
            rowCount={rowCount}
            rowHeight={({ index }) => {
              return this._getOptionHeight({
                option: options[index],
                index,
              });
            }}
            rowRenderer={rowRenderer}
            scrollToIndex={focusedOptionIndex}
            width={width}
            {...listProps}
          />
        )}
      </AutoSizer>
    ) : (
      <div className={this.getClassName('VirtualizedSelect__NoDataFound')}>
        {noOptionsMessage()}
      </div>
    );
  }

  _getOptionHeight = ({ option, index }) => {
    let { optionHeight } = this.props;
    if (optionHeight instanceof Function) {
      optionHeight = optionHeight({ option, index });
    }
    return optionHeight;
  }

  /**
   *
   * @param {key, style, index, option, selectOption, valueKey, labelKey, value, selected} param
   * @returns
   */
  _optionRenderer = ({ key, style, option, selectOption, labelKey, selected }) => {
    const className = [this.getClassName('VirtualizedSelect__Option')];
    let events = {};
    const label = option[labelKey];

    if (selected) {
      className.push(this.getClassName('VirtualizedSelect__SelectedOption'));
    }

    if (option.disabled) {
      className.push(this.getClassName('VirtualizedSelect__DisabledOption'));
    }

    if (option.className) {
      className.push(option.className);
    }

    if (!option.disabled) {
      events = {
        onClick: () => selectOption(option),
      };
    }

    return (
      <div
        className={className.join(' ')}
        key={key}
        style={style}
        title={label}
        {...events}>
        {label}
      </div>
    );
  }

  _setListRef = (ref) => {
    this._listRef = ref;
  }

  _setSelectRef = (ref) => {
    this._selectRef = ref;
  }

  _getStyles = () => {
    const { styles, isSearchable } = this.props;
    return {
      singleValue: (provided, state) => {
        const opacity = state.isDisabled || isSearchable ? 0.5 : 1;
        const transition = 'opacity 300ms';
        return {
          ...provided,
          opacity,
          transition,
        };
      },
      ...styles,
    };
  }

  render() {
    const {
      options, // remove from props
      classes, // remove from props
      styles, // remove from props
      noOptionsMessage, // remove from props
      valueKey, // remove from props
      labelKey,
      isMulti,
      value,
      onChange,
      ...props
    } = this.props;
    const { inputValue } = this.state;

    return (
      <Select
        {...props}
        ref={this._setSelectRef}
        styles={this._getStyles()}
        components={{
          MenuList: this._renderMenu,
        }}
        value={value}
        onChange={onChange}
        isMulti={isMulti}
        closeMenuOnSelect={!isMulti}
        formatOptionLabel={option => option[labelKey]}
        onInputChange={this.onInputChange}
        inputValue={inputValue}
      />
    );
  }
}

VirtualizedSelect.defaultProps = {
  styles: {},
  classes,
  listProps: {},
  maxHeight: 280,
  optionHeight: 35,
  optionRenderer: null,
  options: [],
  valueKey: 'value',
  labelKey: 'label',
  value: '',
  onChange: () => { },
  isMulti: false,
  isClearable: false,
  isDisabled: false,
  isSearchable: false,
  menuIsOpen: undefined,
  noOptionsMessage: () => 'No Data Found',
};

VirtualizedSelect.propTypes = {
  styles: PropTypes.instanceOf(Object),
  classes: PropTypes.instanceOf(Object),
  listProps: PropTypes.object,
  maxHeight: PropTypes.number,
  optionHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  optionRenderer: PropTypes.func,
  options: PropTypes.arrayOf(Object),
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(Object),
    PropTypes.instanceOf(Object),
  ]),
  onChange: PropTypes.func,
  isMulti: PropTypes.bool,
  isClearable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isSearchable: PropTypes.bool,
  menuIsOpen: PropTypes.bool,
  noOptionsMessage: PropTypes.func,
};

export default VirtualizedSelect;

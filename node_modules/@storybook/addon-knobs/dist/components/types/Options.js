"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactSelect = _interopRequireDefault(require("react-select"));
var _theming = require("@storybook/theming");
var _Radio = _interopRequireDefault(require("./Radio"));
var _Checkboxes = _interopRequireDefault(require("./Checkboxes"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
// TODO: Apply the Storybook theme to react-select

var OptionsSelect = (0, _theming.styled)(_reactSelect["default"])({
  width: '100%',
  maxWidth: '300px',
  color: 'black'
});
var serialize = function serialize(value) {
  return value;
};
var deserialize = function deserialize(value) {
  return value;
};
var OptionsType = function OptionsType(props) {
  var _props$knob = props.knob,
    knob = _props$knob === void 0 ? {} : _props$knob,
    _props$onChange = props.onChange,
    onChange = _props$onChange === void 0 ? function (value) {
      return value;
    } : _props$onChange;
  var display = knob.optionsObj.display;
  if (display === 'check' || display === 'inline-check') {
    var isInline = display === 'inline-check';
    return /*#__PURE__*/_react["default"].createElement(_Checkboxes["default"], _extends({}, props, {
      isInline: isInline
    }));
  }
  if (display === 'radio' || display === 'inline-radio') {
    var _isInline = display === 'inline-radio';
    return /*#__PURE__*/_react["default"].createElement(_Radio["default"], _extends({}, props, {
      isInline: _isInline
    }));
  }
  if (display === 'select' || display === 'multi-select') {
    var options = Object.keys(knob.options).map(function (key) {
      return {
        value: knob.options[key],
        label: key
      };
    });
    var isMulti = display === 'multi-select';
    var optionsIndex = options.findIndex(function (i) {
      return i.value === knob.value;
    });
    var defaultValue = options[optionsIndex];
    var handleChange = function handleChange(e) {
      return onChange(e.value);
    };
    if (isMulti) {
      defaultValue = options.filter(function (i) {
        return knob.value.includes(i.value);
      });
      handleChange = function handleChange(values) {
        return onChange(values.map(function (item) {
          return item.value;
        }));
      };
    }
    return /*#__PURE__*/_react["default"].createElement(OptionsSelect, {
      value: defaultValue,
      options: options,
      isMulti: isMulti,
      onChange: handleChange
    });
  }
  return null;
};
OptionsType.propTypes = {
  knob: _propTypes["default"].shape({
    name: _propTypes["default"].string,
    value: _propTypes["default"].oneOfType([_propTypes["default"].array, _propTypes["default"].string]),
    options: _propTypes["default"].object
  }),
  display: _propTypes["default"].oneOf(['radio', 'inline-radio', 'check', 'inline-check', 'select', 'multi-select']),
  onChange: _propTypes["default"].func
};
OptionsType.serialize = serialize;
OptionsType.deserialize = deserialize;
var _default = exports["default"] = OptionsType;
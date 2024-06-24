"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _propTypes = _interopRequireDefault(require("prop-types"));
var _react = _interopRequireDefault(require("react"));
var _theming = require("@storybook/theming");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var Input = _theming.styled.input({
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'top',
  height: 21,
  outline: 'none',
  border: '1px solid #ececec',
  fontSize: '12px',
  color: '#555'
});
var serialize = function serialize(value) {
  return value ? String(value) : null;
};
var deserialize = function deserialize(value) {
  return value === 'true';
};
var BooleanType = function BooleanType(_ref) {
  var _ref$knob = _ref.knob,
    knob = _ref$knob === void 0 ? {} : _ref$knob,
    _ref$onChange = _ref.onChange,
    _onChange = _ref$onChange === void 0 ? function (value) {
      return value;
    } : _ref$onChange;
  return /*#__PURE__*/_react["default"].createElement(Input, {
    id: knob.name,
    name: knob.name,
    type: "checkbox",
    onChange: function onChange(e) {
      return _onChange(e.target.checked);
    },
    checked: knob.value || false
  });
};
BooleanType.propTypes = {
  knob: _propTypes["default"].shape({
    name: _propTypes["default"].string,
    value: _propTypes["default"].bool
  }),
  onChange: _propTypes["default"].func
};
BooleanType.serialize = serialize;
BooleanType.deserialize = deserialize;
var _default = exports["default"] = BooleanType;
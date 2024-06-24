"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _components = require("@storybook/components");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var serialize = function serialize(value) {
  return value;
};
var deserialize = function deserialize(value) {
  return value;
};
var SelectType = function SelectType(_ref) {
  var _ref$knob = _ref.knob,
    knob = _ref$knob === void 0 ? {} : _ref$knob,
    _ref$onChange = _ref.onChange,
    _onChange = _ref$onChange === void 0 ? function (value) {
      return value;
    } : _ref$onChange;
  var options = knob.options;
  var callbackReduceArrayOptions = function callbackReduceArrayOptions(acc, option, i) {
    if (_typeof(option) !== 'object' || option === null) return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, option, option));
    var label = option.label || option.key || i;
    return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, label, option));
  };
  var entries = Array.isArray(options) ? options.reduce(callbackReduceArrayOptions, {}) : options;
  var selectedKey = Object.keys(entries).find(function (key) {
    var knobVal = knob.value;
    var entryVal = entries[key];
    if (Array.isArray(knobVal)) {
      return JSON.stringify(entryVal) === JSON.stringify(knobVal);
    }
    return entryVal === knobVal;
  });
  return /*#__PURE__*/_react["default"].createElement(_components.Form.Select, {
    value: selectedKey,
    name: knob.name,
    onChange: function onChange(e) {
      _onChange(entries[e.target.value]);
    },
    size: "flex"
  }, Object.entries(entries).map(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 1),
      key = _ref3[0];
    return /*#__PURE__*/_react["default"].createElement("option", {
      key: key,
      value: key
    }, key);
  }));
};
SelectType.propTypes = {
  knob: _propTypes["default"].shape({
    name: _propTypes["default"].string,
    value: _propTypes["default"].any,
    options: _propTypes["default"].oneOfType([_propTypes["default"].array, _propTypes["default"].object])
  }),
  onChange: _propTypes["default"].func
};
SelectType.serialize = serialize;
SelectType.deserialize = deserialize;
var _default = exports["default"] = SelectType;
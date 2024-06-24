"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _theming = require("@storybook/theming");
var _components = require("@storybook/components");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var FlexSpaced = _theming.styled.div({
  flex: 1,
  display: 'flex',
  '&& > *': {
    marginLeft: 10
  },
  '&& > *:first-of-type': {
    marginLeft: 0
  }
});
var FlexInput = (0, _theming.styled)(_components.Form.Input)({
  flex: 1
});
var formatDate = function formatDate(date) {
  var year = "000".concat(date.getFullYear()).slice(-4);
  var month = "0".concat(date.getMonth() + 1).slice(-2);
  var day = "0".concat(date.getDate()).slice(-2);
  return "".concat(year, "-").concat(month, "-").concat(day);
};
var formatTime = function formatTime(date) {
  var hours = "0".concat(date.getHours()).slice(-2);
  var minutes = "0".concat(date.getMinutes()).slice(-2);
  return "".concat(hours, ":").concat(minutes);
};
var DateType = exports["default"] = /*#__PURE__*/function (_Component) {
  function DateType() {
    var _this;
    _classCallCheck(this, DateType);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, DateType, [].concat(args));
    _defineProperty(_this, "state", {
      valid: undefined
    });
    _defineProperty(_this, "onDateChange", function (e) {
      var _this$props = _this.props,
        knob = _this$props.knob,
        onChange = _this$props.onChange;
      var _this2 = _this,
        state = _this2.state;
      var valid = false;
      var _e$target$value$split = e.target.value.split('-'),
        _e$target$value$split2 = _slicedToArray(_e$target$value$split, 3),
        year = _e$target$value$split2[0],
        month = _e$target$value$split2[1],
        day = _e$target$value$split2[2];
      var result = new Date(knob.value);
      if (result.getTime()) {
        result.setFullYear(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
        if (result.getTime()) {
          valid = true;
          onChange(result.getTime());
        }
      }
      if (valid !== state.valid) {
        _this.setState({
          valid: valid
        });
      }
    });
    _defineProperty(_this, "onTimeChange", function (e) {
      var _this$props2 = _this.props,
        knob = _this$props2.knob,
        onChange = _this$props2.onChange;
      var _this3 = _this,
        state = _this3.state;
      var valid = false;
      var _e$target$value$split3 = e.target.value.split(':'),
        _e$target$value$split4 = _slicedToArray(_e$target$value$split3, 2),
        hours = _e$target$value$split4[0],
        minutes = _e$target$value$split4[1];
      var result = new Date(knob.value);
      if (result.getTime()) {
        result.setHours(parseInt(hours, 10));
        result.setMinutes(parseInt(minutes, 10));
        if (result.getTime()) {
          onChange(result.getTime());
          valid = true;
        }
      }
      if (valid !== state.valid) {
        _this.setState({
          valid: valid
        });
      }
    });
    return _this;
  }
  _inherits(DateType, _Component);
  return _createClass(DateType, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var knob = this.props.knob;
      var valid = this.state.valid;
      var value = new Date(knob.value);
      if (valid !== false) {
        this.dateInput.value = formatDate(value);
        this.timeInput.value = formatTime(value);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;
      var knob = this.props.knob;
      var name = knob.name;
      var valid = this.state.valid;
      return name ? /*#__PURE__*/_react["default"].createElement(FlexSpaced, {
        style: {
          display: 'flex'
        }
      }, /*#__PURE__*/_react["default"].createElement(FlexInput, {
        type: "date",
        max: "9999-12-31" // I do this because of a rendering bug in chrome
        ,
        ref: function ref(el) {
          _this4.dateInput = el;
        },
        id: "".concat(name, "date"),
        name: "".concat(name, "date"),
        onChange: this.onDateChange
      }), /*#__PURE__*/_react["default"].createElement(FlexInput, {
        type: "time",
        id: "".concat(name, "time"),
        name: "".concat(name, "time"),
        ref: function ref(el) {
          _this4.timeInput = el;
        },
        onChange: this.onTimeChange
      }), !valid ? /*#__PURE__*/_react["default"].createElement("div", null, "invalid") : null) : null;
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps() {
      return {
        valid: true
      };
    }
  }]);
}(_react.Component);
_defineProperty(DateType, "defaultProps", {
  knob: {},
  onChange: function onChange(value) {
    return value;
  }
});
_defineProperty(DateType, "propTypes", {
  knob: _propTypes["default"].shape({
    name: _propTypes["default"].string,
    value: _propTypes["default"].number
  }),
  onChange: _propTypes["default"].func
});
_defineProperty(DateType, "serialize", function (value) {
  return new Date(value).getTime() || new Date().getTime();
});
_defineProperty(DateType, "deserialize", function (value) {
  return new Date(value).getTime() || new Date().getTime();
});
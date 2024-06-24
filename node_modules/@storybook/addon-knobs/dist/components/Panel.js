"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.DEFAULT_GROUP_ID = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _qs = _interopRequireDefault(require("qs"));
var _global = require("global");
var _theming = require("@storybook/theming");
var _copyToClipboard = _interopRequireDefault(require("copy-to-clipboard"));
var _coreEvents = require("@storybook/core-events");
var _components = require("@storybook/components");
var _shared = require("../shared");
var _types = require("./types");
var _PropForm = _interopRequireDefault(require("./PropForm"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
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
var getTimestamp = function getTimestamp() {
  return +new Date();
};
var DEFAULT_GROUP_ID = exports.DEFAULT_GROUP_ID = 'Other';
var PanelWrapper = (0, _theming.styled)(function (_ref) {
  var children = _ref.children,
    className = _ref.className;
  return /*#__PURE__*/_react["default"].createElement(_components.ScrollArea, {
    horizontal: true,
    vertical: true,
    className: className
  }, children);
})({
  height: '100%',
  width: '100%'
});
var KnobPanel = exports["default"] = /*#__PURE__*/function (_PureComponent) {
  function KnobPanel() {
    var _this;
    _classCallCheck(this, KnobPanel);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, KnobPanel, [].concat(args));
    _defineProperty(_this, "state", {
      knobs: {}
    });
    _defineProperty(_this, "options", {});
    _defineProperty(_this, "lastEdit", getTimestamp());
    _defineProperty(_this, "loadedFromUrl", false);
    _defineProperty(_this, "mounted", false);
    _defineProperty(_this, "setOptions", function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        timestamps: false
      };
      _this.options = options;
    });
    _defineProperty(_this, "setKnobs", function (_ref2) {
      var knobs = _ref2.knobs,
        timestamp = _ref2.timestamp;
      var queryParams = {};
      var api = _this.props.api;
      if (!_this.options.timestamps || !timestamp || _this.lastEdit <= timestamp) {
        Object.keys(knobs).forEach(function (name) {
          var knob = knobs[name];
          // For the first time, get values from the URL and set them.
          if (!_this.loadedFromUrl) {
            var urlValue = api.getQueryParam("knob-".concat(name));

            // If the knob value present in url
            if (urlValue !== undefined) {
              var value = (0, _types.getKnobControl)(knob.type).deserialize(urlValue);
              knob.value = value;
              queryParams["knob-".concat(name)] = (0, _types.getKnobControl)(knob.type).serialize(value);
              api.emit(_shared.CHANGE, knob);
            }
          }
        });
        api.setQueryParams(queryParams);
        _this.setState({
          knobs: knobs
        });
        _this.loadedFromUrl = true;
      }
    });
    _defineProperty(_this, "reset", function () {
      var api = _this.props.api;
      api.emit(_shared.RESET);
    });
    _defineProperty(_this, "copy", function () {
      var location = _global.document.location;
      var query = _qs["default"].parse(location.search, {
        ignoreQueryPrefix: true
      });
      var knobs = _this.state.knobs;
      Object.entries(knobs).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          name = _ref4[0],
          knob = _ref4[1];
        query["knob-".concat(name)] = (0, _types.getKnobControl)(knob.type).serialize(knob.value);
      });
      (0, _copyToClipboard["default"])("".concat(location.origin + location.pathname, "?").concat(_qs["default"].stringify(query, {
        encode: false
      })));

      // TODO: show some notification of this
    });
    _defineProperty(_this, "emitChange", function (changedKnob) {
      var api = _this.props.api;
      api.emit(_shared.CHANGE, changedKnob);
    });
    _defineProperty(_this, "handleChange", function (changedKnob) {
      _this.lastEdit = getTimestamp();
      var api = _this.props.api;
      var knobs = _this.state.knobs;
      var name = changedKnob.name;
      var newKnobs = _objectSpread({}, knobs);
      newKnobs[name] = _objectSpread(_objectSpread({}, newKnobs[name]), changedKnob);
      _this.setState({
        knobs: newKnobs
      }, function () {
        _this.emitChange(changedKnob);
        var queryParams = {};
        Object.keys(newKnobs).forEach(function (n) {
          var knob = newKnobs[n];
          queryParams["knob-".concat(n)] = (0, _types.getKnobControl)(knob.type).serialize(knob.value);
        });
        api.setQueryParams(queryParams);
      });
    });
    _defineProperty(_this, "handleClick", function (knob) {
      var api = _this.props.api;
      api.emit(_shared.CLICK, knob);
    });
    return _this;
  }
  _inherits(KnobPanel, _PureComponent);
  return _createClass(KnobPanel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;
      this.mounted = true;
      var api = this.props.api;
      api.on(_shared.SET, this.setKnobs);
      api.on(_shared.SET_OPTIONS, this.setOptions);
      this.stopListeningOnStory = api.on(_coreEvents.STORY_CHANGED, function () {
        if (_this2.mounted) {
          _this2.setKnobs({
            knobs: {}
          });
        }
        _this2.setKnobs({
          knobs: {}
        });
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false;
      var api = this.props.api;
      api.off(_shared.SET, this.setKnobs);
      this.stopListeningOnStory();
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var knobs = this.state.knobs;
      var panelActive = this.props.active;
      if (!panelActive) {
        return null;
      }
      var groups = {};
      var groupIds = [];
      var knobKeysArray = Object.keys(knobs).filter(function (key) {
        return knobs[key].used;
      });
      knobKeysArray.forEach(function (key) {
        var knobKeyGroupId = knobs[key].groupId || DEFAULT_GROUP_ID;
        groupIds.push(knobKeyGroupId);
        groups[knobKeyGroupId] = {
          render: function render(_ref5) {
            var active = _ref5.active;
            return /*#__PURE__*/_react["default"].createElement(_components.TabWrapper, {
              key: knobKeyGroupId,
              active: active
            }, /*#__PURE__*/_react["default"].createElement(_PropForm["default"], {
              knobs: knobsArray.filter(function (knob) {
                return (knob.groupId || DEFAULT_GROUP_ID) === knobKeyGroupId;
              }),
              onFieldChange: _this3.handleChange,
              onFieldClick: _this3.handleClick
            }));
          },
          title: knobKeyGroupId
        };
      });
      var knobsArray = knobKeysArray.map(function (key) {
        return knobs[key];
      });
      if (knobsArray.length === 0) {
        return /*#__PURE__*/_react["default"].createElement(_components.Placeholder, null, /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, "No knobs found"), /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, "Learn how to\xA0", /*#__PURE__*/_react["default"].createElement(_components.Link, {
          href: "https://github.com/storybookjs/storybook/tree/master/addons/knobs",
          target: "_blank",
          withArrow: true,
          cancel: false
        }, "dynamically interact with components")));
      }

      // Always sort DEFAULT_GROUP_ID (ungrouped) tab last without changing the remaining tabs
      var sortEntries = function sortEntries(g) {
        var unsortedKeys = Object.keys(g);
        if (unsortedKeys.includes(DEFAULT_GROUP_ID)) {
          var sortedKeys = unsortedKeys.filter(function (key) {
            return key !== DEFAULT_GROUP_ID;
          });
          sortedKeys.push(DEFAULT_GROUP_ID);
          return sortedKeys.map(function (key) {
            return [key, g[key]];
          });
        }
        return Object.entries(g);
      };
      var entries = sortEntries(groups);
      return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(PanelWrapper, null, entries.length > 1 ? /*#__PURE__*/_react["default"].createElement(_components.TabsState, null, entries.map(function (_ref6) {
        var _ref7 = _slicedToArray(_ref6, 2),
          k = _ref7[0],
          v = _ref7[1];
        return /*#__PURE__*/_react["default"].createElement("div", {
          id: k,
          key: k,
          title: v.title
        }, v.render);
      })) : /*#__PURE__*/_react["default"].createElement(_PropForm["default"], {
        knobs: knobsArray,
        onFieldChange: this.handleChange,
        onFieldClick: this.handleClick
      })), /*#__PURE__*/_react["default"].createElement(_components.ActionBar, {
        actionItems: [{
          title: 'Copy',
          onClick: this.copy
        }, {
          title: 'Reset',
          onClick: this.reset
        }]
      }));
    }
  }]);
}(_react.PureComponent);
_defineProperty(KnobPanel, "propTypes", {
  active: _propTypes["default"].bool.isRequired,
  onReset: _propTypes["default"].object,
  // eslint-disable-line
  api: _propTypes["default"].shape({
    on: _propTypes["default"].func,
    off: _propTypes["default"].func,
    emit: _propTypes["default"].func,
    getQueryParam: _propTypes["default"].func,
    setQueryParams: _propTypes["default"].func
  }).isRequired
});
_defineProperty(KnobPanel, "defaultProps", {
  active: true,
  api: {
    on: function on() {
      return function () {};
    },
    off: function off() {},
    emit: function emit() {},
    getQueryParam: function getQueryParam() {
      return undefined;
    },
    setQueryParams: function setQueryParams() {}
  }
});
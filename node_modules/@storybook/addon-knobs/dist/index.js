"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  knob: true,
  text: true,
  "boolean": true,
  number: true,
  color: true,
  object: true,
  select: true,
  radios: true,
  array: true,
  date: true,
  button: true,
  files: true,
  optionsKnob: true,
  withKnobs: true
};
exports.array = array;
exports["boolean"] = _boolean;
exports.button = button;
exports.color = color;
exports.date = date;
exports.files = files;
exports.knob = knob;
exports.number = number;
exports.object = object;
exports.optionsKnob = optionsKnob;
exports.radios = radios;
exports.select = select;
exports.text = text;
exports.withKnobs = void 0;
var _previewApi = require("@storybook/preview-api");
var _shared = require("./shared");
Object.keys(_shared).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _shared[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _shared[key];
    }
  });
});
var _registerKnobs = require("./registerKnobs");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function knob(name, options) {
  return _registerKnobs.manager.knob(name, options);
}
function text(name, value, groupId) {
  return _registerKnobs.manager.knob(name, {
    type: 'text',
    value: value,
    groupId: groupId
  });
}
function _boolean(name, value, groupId) {
  return _registerKnobs.manager.knob(name, {
    type: 'boolean',
    value: value,
    groupId: groupId
  });
}
function number(name, value) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var groupId = arguments.length > 3 ? arguments[3] : undefined;
  var rangeDefaults = {
    min: 0,
    max: 10,
    step: 1
  };
  var mergedOptions = options.range ? _objectSpread(_objectSpread({}, rangeDefaults), options) : options;
  var finalOptions = _objectSpread(_objectSpread({
    type: 'number'
  }, mergedOptions), {}, {
    value: value,
    groupId: groupId
  });
  return _registerKnobs.manager.knob(name, finalOptions);
}
function color(name, value, groupId) {
  return _registerKnobs.manager.knob(name, {
    type: 'color',
    value: value,
    groupId: groupId
  });
}
function object(name, value, groupId) {
  return _registerKnobs.manager.knob(name, {
    type: 'object',
    value: value,
    groupId: groupId
  });
}
function select(name, options, value, groupId) {
  return _registerKnobs.manager.knob(name, {
    type: 'select',
    selectV2: true,
    options: options,
    value: value,
    groupId: groupId
  });
}
function radios(name, options, value, groupId) {
  return _registerKnobs.manager.knob(name, {
    type: 'radios',
    options: options,
    value: value,
    groupId: groupId
  });
}
function array(name, value) {
  var separator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ',';
  var groupId = arguments.length > 3 ? arguments[3] : undefined;
  return _registerKnobs.manager.knob(name, {
    type: 'array',
    value: value,
    separator: separator,
    groupId: groupId
  });
}
function date(name) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  var groupId = arguments.length > 2 ? arguments[2] : undefined;
  var proxyValue = value ? value.getTime() : new Date().getTime();
  return _registerKnobs.manager.knob(name, {
    type: 'date',
    value: proxyValue,
    groupId: groupId
  });
}
function button(name, callback, groupId) {
  return _registerKnobs.manager.knob(name, {
    type: 'button',
    callback: callback,
    hideLabel: true,
    groupId: groupId
  });
}
function files(name, accept) {
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var groupId = arguments.length > 3 ? arguments[3] : undefined;
  return _registerKnobs.manager.knob(name, {
    type: 'files',
    accept: accept,
    value: value,
    groupId: groupId
  });
}
function optionsKnob(name, valuesObj, value, optionsObj, groupId) {
  return _registerKnobs.manager.knob(name, {
    type: 'options',
    options: valuesObj,
    value: value,
    optionsObj: optionsObj,
    groupId: groupId
  });
}
var defaultOptions = {
  escapeHTML: true
};
var withKnobs = exports.withKnobs = (0, _previewApi.makeDecorator)({
  name: 'withKnobs',
  parameterName: 'knobs',
  skipIfNoParametersOrOptions: false,
  wrapper: function wrapper(getStory, context, _ref) {
    var options = _ref.options,
      parameters = _ref.parameters;
    var storyOptions = parameters || options;
    var allOptions = _objectSpread(_objectSpread({}, defaultOptions), storyOptions);
    var channel = _previewApi.addons.getChannel();
    _registerKnobs.manager.setChannel(channel);
    _registerKnobs.manager.setOptions(allOptions);
    channel.emit(_shared.SET_OPTIONS, allOptions);
    (0, _registerKnobs.registerKnobs)();
    return getStory(context);
  }
});
if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
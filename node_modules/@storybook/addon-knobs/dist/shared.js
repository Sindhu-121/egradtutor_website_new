"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SET_OPTIONS = exports.SET = exports.RESET = exports.PARAM_KEY = exports.PANEL_ID = exports.CLICK = exports.CHANGE = exports.ADDON_ID = void 0;
// addons, panels and events get unique names using a prefix
var PARAM_KEY = exports.PARAM_KEY = 'knobs';
var ADDON_ID = exports.ADDON_ID = 'storybookjs/knobs';
var PANEL_ID = exports.PANEL_ID = "".concat(ADDON_ID, "/panel");
var RESET = exports.RESET = "".concat(ADDON_ID, "/reset");
var SET = exports.SET = "".concat(ADDON_ID, "/set");
var CHANGE = exports.CHANGE = "".concat(ADDON_ID, "/change");
var SET_OPTIONS = exports.SET_OPTIONS = "".concat(ADDON_ID, "/set-options");
var CLICK = exports.CLICK = "".concat(ADDON_ID, "/click");
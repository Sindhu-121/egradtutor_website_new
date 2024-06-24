"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var React = _interopRequireWildcard(require("react"));
var _managerApi = require("@storybook/manager-api");
var _Panel = _interopRequireDefault(require("./components/Panel"));
var _shared = require("./shared");
var _title = require("./title");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
_managerApi.addons.register(_shared.ADDON_ID, function (api) {
  _managerApi.addons.add(_shared.PANEL_ID, {
    type: _managerApi.types.PANEL,
    title: (0, _title.createTitleListener)(api),
    render: function render(_ref) {
      var active = _ref.active;
      return /*#__PURE__*/React.createElement(_Panel["default"], {
        api: api,
        active: active
      });
    },
    paramKey: _shared.PARAM_KEY
  });
});
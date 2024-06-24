"use strict";

var _KnobManager = _interopRequireDefault(require("./KnobManager"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
jest.mock('global', function () {
  return {
    navigator: {
      userAgent: 'browser',
      platform: ''
    },
    window: {
      __STORYBOOK_CLIENT_API__: undefined,
      addEventListener: jest.fn(),
      location: {
        search: ''
      },
      history: {
        replaceState: jest.fn()
      }
    },
    document: {
      addEventListener: jest.fn(),
      getElementById: jest.fn().mockReturnValue({}),
      body: {
        classList: {
          add: jest.fn(),
          remove: jest.fn()
        }
      },
      documentElement: {},
      location: {
        search: '?id=kind--story'
      }
    }
  };
});
describe('KnobManager', function () {
  describe('knob()', function () {
    describe('when the knob is present in the knobStore', function () {
      var testManager = new _KnobManager["default"]();
      beforeEach(function () {
        testManager.knobStore = {
          set: jest.fn(),
          update: jest.fn(),
          get: function get() {
            return {
              defaultValue: 'default value',
              name: 'foo',
              type: 'string',
              value: 'current value'
            };
          }
        };
      });
      it('should return the existing knob value when types match', function () {
        var defaultKnob = {
          name: 'foo',
          type: 'string',
          value: 'default value'
        };
        var knob = testManager.knob('foo', defaultKnob);
        expect(knob).toEqual('current value');
        expect(testManager.knobStore.set).not.toHaveBeenCalled();
      });
      it('should update the existing knob options when types match', function () {
        var defaultKnob = {
          name: 'foo',
          type: 'string',
          value: 'default value',
          foo: 'foo'
        };
        testManager.knob('foo', defaultKnob);
        expect(testManager.knobStore.update).toHaveBeenCalledWith('foo', expect.objectContaining({
          foo: 'foo'
        }));
      });
      it('should return the new default knob value when type has changed', function () {
        var defaultKnob = {
          name: 'foo',
          value: true,
          type: 'boolean'
        };
        testManager.knob('foo', defaultKnob);
        var newKnob = _objectSpread(_objectSpread({}, defaultKnob), {}, {
          label: 'foo',
          defaultValue: defaultKnob.value
        });
        expect(testManager.knobStore.set).toHaveBeenCalledWith('foo', newKnob);
      });
    });
    describe('when the knob is not present in the knobStore', function () {
      var testManager = new _KnobManager["default"]();
      beforeEach(function () {
        testManager.knobStore = {
          set: jest.fn(),
          get: jest.fn()
        };
        testManager.knobStore.get.mockImplementationOnce(function () {
          return undefined;
        }).mockImplementationOnce(function () {
          return 'normal value';
        });
      });
      it('should return the new default knob value when default has changed', function () {
        var defaultKnob = {
          name: 'foo',
          value: 'normal value'
        };
        testManager.knob('foo', defaultKnob);
        var newKnob = _objectSpread(_objectSpread({}, defaultKnob), {}, {
          label: 'foo',
          defaultValue: defaultKnob.value
        });
        expect(testManager.knobStore.set).toHaveBeenCalledWith('foo', newKnob);
      });
    });
  });
});
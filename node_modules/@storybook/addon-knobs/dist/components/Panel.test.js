"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _react = _interopRequireDefault(require("react"));
var _react2 = require("@testing-library/react");
var _coreEvents = require("@storybook/core-events");
var _theming = require("@storybook/theming");
var _Panel = _interopRequireWildcard(require("./Panel"));
var _shared = require("../shared");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var createTestApi = function createTestApi() {
  return {
    on: jest.fn(function () {
      return function () {};
    }),
    off: jest.fn(),
    emit: jest.fn(),
    getQueryParam: jest.fn(function () {
      return undefined;
    }),
    setQueryParams: jest.fn()
  };
};
describe('Panel', function () {
  it('should subscribe to setKnobs event of channel', function () {
    var testApi = createTestApi();
    (0, _react2.render)( /*#__PURE__*/_react["default"].createElement(_theming.ThemeProvider, {
      theme: (0, _theming.convert)(_theming.themes.light)
    }, /*#__PURE__*/_react["default"].createElement(_Panel["default"], {
      api: testApi,
      active: true
    })));
    expect(testApi.on).toHaveBeenCalledWith(_shared.SET, expect.any(Function));
  });
  it('should subscribe to STORY_CHANGE event', function () {
    var testApi = createTestApi();
    (0, _react2.render)( /*#__PURE__*/_react["default"].createElement(_theming.ThemeProvider, {
      theme: (0, _theming.convert)(_theming.themes.light)
    }, /*#__PURE__*/_react["default"].createElement(_Panel["default"], {
      api: testApi,
      active: true
    })));
    expect(testApi.on.mock.calls).toContainEqual([_coreEvents.STORY_CHANGED, expect.any(Function)]);
    expect(testApi.on).toHaveBeenCalledWith(_shared.SET, expect.any(Function));
  });
  describe('setKnobs handler', function () {
    it('should read url params and set values for existing knobs', function () {
      var handlers = {};
      var testQueryParams = {
        'knob-foo': 'test string',
        bar: 'some other string'
      };
      var testApi = {
        on: function on(e, handler) {
          handlers[e] = handler;
          return function () {};
        },
        off: jest.fn(),
        emit: jest.fn(),
        getQueryParam: function getQueryParam(key) {
          return testQueryParams[key];
        },
        setQueryParams: jest.fn()
      };
      (0, _react2.render)( /*#__PURE__*/_react["default"].createElement(_theming.ThemeProvider, {
        theme: (0, _theming.convert)(_theming.themes.light)
      }, /*#__PURE__*/_react["default"].createElement(_Panel["default"], {
        api: testApi,
        active: true
      })));
      var setKnobsHandler = handlers[_shared.SET];
      var knobs = {
        foo: {
          name: 'foo',
          value: 'default string',
          type: 'text'
        },
        baz: {
          name: 'baz',
          value: 'another knob value',
          type: 'text'
        }
      };
      (0, _react2.act)(function () {
        setKnobsHandler({
          knobs: knobs,
          timestamp: +new Date()
        });
      });
      var knobFromUrl = {
        name: 'foo',
        value: testQueryParams['knob-foo'],
        type: 'text'
      };
      var e = _shared.CHANGE;
      expect(testApi.emit).toHaveBeenCalledWith(e, knobFromUrl);
    });
  });
  describe('handleChange()', function () {
    it.skip('should set queryParams and emit knobChange event', function () {
      var testApi = {
        getQueryParam: jest.fn(),
        setQueryParams: jest.fn(function () {
          return undefined;
        }),
        on: jest.fn(function () {
          return function () {};
        }),
        off: jest.fn(),
        emit: jest.fn()
      };
      (0, _react2.render)( /*#__PURE__*/_react["default"].createElement(_Panel["default"], {
        api: testApi,
        active: true
      }));
      var testChangedKnob = {
        name: 'foo',
        value: 'changed text',
        type: 'text'
      };
      // todo
      // wrapper.instance().handleChange(testChangedKnob);
      expect(testApi.emit).toHaveBeenCalledWith(_shared.CHANGE, testChangedKnob);

      // const paramsChange = { 'knob-foo': 'changed text' };
      // expect(testApi.setQueryParams).toHaveBeenCalledWith(paramsChange);
    });
  });
  describe('groups', function () {
    var testApi = {
      off: jest.fn(),
      emit: jest.fn(),
      getQueryParam: jest.fn(function () {
        return undefined;
      }),
      setQueryParams: jest.fn(),
      on: jest.fn(function () {
        return function () {};
      })
    };
    it.skip('should have no tabs when there are no groupIds', function () {
      // Unfortunately, a shallow render will not invoke the render() function of the groups --
      // it thinks they are unnamed function components (what they effectively are anyway).
      //
      // We have to do a full mount.

      var root = (0, _react2.render)( /*#__PURE__*/_react["default"].createElement(_theming.ThemeProvider, {
        theme: (0, _theming.convert)(_theming.themes.light)
      }, /*#__PURE__*/_react["default"].createElement(_Panel["default"], {
        api: testApi,
        active: true
      })));

      // testApi.on.mock.calls[0][1]({
      //   knobs: {
      //     foo: {
      //       name: 'foo',
      //       defaultValue: 'test',
      //       used: true,
      //       // no groupId
      //     },
      //     bar: {
      //       name: 'bar',
      //       defaultValue: 'test2',
      //       used: true,
      //       // no groupId
      //     },
      //   },
      // });

      // root.rerender();
      // const wrapper = root.find(Panel);

      // const formWrapper = wrapper.find(PropForm);
      // const knobs = formWrapper.map((formInstanceWrapper) => formInstanceWrapper.prop('knobs'));

      // expect(knobs).toMatchSnapshot();

      // root.unmount();
    });
    it.skip('should have one tab per groupId when all are defined', function () {
      var root = (0, _react2.render)( /*#__PURE__*/_react["default"].createElement(_theming.ThemeProvider, {
        theme: (0, _theming.convert)(_theming.themes.light)
      }, /*#__PURE__*/_react["default"].createElement(_Panel["default"], {
        api: testApi,
        active: true
      })));

      // testApi.on.mock.calls[0][1]({
      //   knobs: {
      //     foo: {
      //       name: 'foo',
      //       defaultValue: 'test',
      //       used: true,
      //       groupId: 'foo',
      //     },
      //     bar: {
      //       name: 'bar',
      //       defaultValue: 'test2',
      //       used: true,
      //       groupId: 'bar',
      //     },
      //   },
      // });

      // const wrapper = root.update().find(Panel);

      // const titles = wrapper
      //   .find(TabsState)
      //   .find('button')
      //   .map((child) => child.prop('children'));
      // expect(titles).toEqual(['foo', 'bar']);

      // const knobs = wrapper.find(PropForm);
      // // but it should not have its own PropForm in this case
      // expect(knobs.length).toEqual(titles.length);
      // expect(knobs).toMatchSnapshot();

      // root.unmount();
    });
    it.skip("the ".concat(_Panel.DEFAULT_GROUP_ID, " tab should have its own additional content when there are knobs both with and without a groupId"), function () {
      var root = (0, _react2.render)( /*#__PURE__*/_react["default"].createElement(_theming.ThemeProvider, {
        theme: (0, _theming.convert)(_theming.themes.light)
      }, /*#__PURE__*/_react["default"].createElement(_Panel["default"], {
        api: testApi,
        active: true
      })));

      // testApi.on.mock.calls[0][1]({
      //   knobs: {
      //     bar: {
      //       name: 'bar',
      //       defaultValue: 'test2',
      //       used: true,
      //       // no groupId
      //     },
      //     foo: {
      //       name: 'foo',
      //       defaultValue: 'test',
      //       used: true,
      //       groupId: 'foo',
      //     },
      //   },
      // });

      // const wrapper = root.update().find(Panel);

      // const titles = wrapper
      //   .find(TabsState)
      //   .find('button')
      //   .map((child) => child.prop('children'));
      // expect(titles).toEqual(['foo', DEFAULT_GROUP_ID]);

      // const knobs = wrapper.find(PropForm).map((propForm) => propForm.prop('knobs'));
      // // there are props with no groupId so Other should also have its own PropForm
      // expect(knobs.length).toEqual(titles.length);
      // expect(knobs).toMatchSnapshot();

      // root.unmount();
    });
  });
});
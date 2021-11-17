;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self), (global.Vue = factory()))
})(this, function () {
  'use strict'

  function _typeof(obj) {
    '@babel/helpers - typeof'

    if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
      _typeof = function (obj) {
        return typeof obj
      }
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj
      }
    }

    return _typeof(obj)
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function')
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps)
    if (staticProps) _defineProperties(Constructor, staticProps)
    return Constructor
  }

  var oldArrayPrototype = Array.prototype
  var arrayProto = Object.create(oldArrayPrototype)
  var methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort']
  methods.forEach(function (method) {
    arrayProto[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key]
      }

      var ret = oldArrayPrototype[method].apply(this, args)
      var inserted

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args
          break

        case 'splice':
          inserted = args.slice(3)
          break
      }

      if (inserted) this.__ob__.observeArray(inserted)
      return ret
    }
  })

  var Observer = /*#__PURE__*/ (function () {
    function Observer(data) {
      _classCallCheck(this, Observer)

      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false,
      })

      if (Array.isArray(data)) {
        data.__proto__ = arrayProto
        this.observeArray(data)
      } else {
        this.walk(data)
      }
    }

    _createClass(Observer, [
      {
        key: 'observeArray',
        value: function observeArray(arr) {
          arr.forEach(function (data) {
            return observe(data)
          })
        },
      },
      {
        key: 'walk',
        value: function walk(data) {
          Object.keys(data).forEach(function (key) {
            defineReactive(data, key, data[key])
          })
        },
      },
    ])

    return Observer
  })()

  function defineReactive(target, key, value) {
    Object.defineProperty(target, key, {
      get: function get() {
        return value
      },
      set: function set(newValue) {
        if (value !== newValue) {
          value = newValue
          observe(newValue)
        }
      },
    })
    observe(value)
  }

  function observe(data) {
    if (_typeof(data) !== 'object' || data == null) {
      return
    }

    if (data.__ob__) return
    new Observer(data)
  }

  function initState(vm) {
    var options = vm.$options

    if (options.data) {
      initData(vm)
    }
  }

  function initData(vm) {
    var data = vm.$options.data

    if (typeof data === 'function') {
      data = data.call(vm)
    }

    observe(data)
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this
      vm.$options = options
      initState(vm)
    }
  }

  function Vue(options) {
    this._init(options)
  }

  initMixin(Vue)

  return Vue
})

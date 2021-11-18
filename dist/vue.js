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

  function proxy(target, key, property) {
    Object.defineProperty(target, property, {
      get: function get() {
        return target[key][property]
      },
      set: function set(newValue) {
        target[key][property] = newValue
      },
    })
  }

  function initData(vm) {
    var data = vm.$options.data

    if (typeof data === 'function') {
      data = data.call(vm)
    }

    vm._data = data

    for (var key in vm._data) {
      proxy(vm, '_data', key)
    }

    observe(data)
  }

  function genProps(attrs) {
    var str = ''
    attrs.forEach(function (attr) {
      if (attr.name === 'style') {
        var style = {} // eslint-disable-next-line no-useless-escape

        attr.value.replace(/([^;:]+)\:([^;:]+)/g, function () {
          style[arguments[1]] = arguments[2]
        })
        attr.value = style
      }

      str += ''.concat(attr.name, ':').concat(JSON.stringify(attr.value), ',')
    })
    return '{'.concat(str.slice(0, -1), '}')
  }

  function genChildren(ast) {
    var children = ast.children

    if (children.length) {
      return children
        .map(function (child) {
          return gen(child)
        })
        .join(',')
    }

    return false
  }

  function gen(ast) {
    if (ast.type === 1) {
      return generate(ast)
    }
  }

  function generate(ast) {
    var children = genChildren(ast)
    var code = "_c('"
      .concat(ast.tag, "',")
      .concat(ast.attrs.length ? genProps(ast.attrs) : undefined)
      .concat(children ? ',' + children : '', ')')
    return code
  }

  var ncname = '[a-zA-Z_][\\-\\.0-9_a-zA-Z]*' // 匹配标签名的  aa-xxx

  var qnameCapture = '((?:'.concat(ncname, '\\:)?').concat(ncname, ')') //  aa:aa-xxx

  var startTagOpen = new RegExp('^<'.concat(qnameCapture)) //  此正则可以匹配到标签名 匹配到结果的第一个(索引第一个) [1]

  var endTag = new RegExp('^<\\/'.concat(qnameCapture, '[^>]*>')) // 匹配标签结尾的 </div>  [1]

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性的
  // [1]属性的key   [3] || [4] ||[5] 属性的值  a=1  a='1'  a=""

  var startTagClose = /^\s*(\/?)>/ // 匹配标签结束的  />    >
  // const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{   xxx  }}
  // vue3的编译原理比vue2里好很多，没有这么多正则了

  function parserHTML(html) {
    // 可以不停的截取模板，直到把模板全部解析完毕
    var stack = []
    var root = null // 我要构建父子关系

    function createASTElement(tag, attrs) {
      var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null
      return {
        tag: tag,
        type: 1,
        // 元素
        children: [],
        parent: parent,
        attrs: attrs,
      }
    }

    function start(tag, attrs) {
      // [div,p]
      // 遇到开始标签 就取栈中的最后一个作为父节点
      var parent = stack[stack.length - 1]
      var element = createASTElement(tag, attrs, parent)

      if (root == null) {
        // 说明当前节点就是根节点
        root = element
      }

      if (parent) {
        element.parent = parent // 跟新p的parent属性 指向parent

        parent.children.push(element)
      }

      stack.push(element)
    }

    function end(tagName) {
      var endTag = stack.pop()

      if (endTag.tag != tagName) {
        console.log('标签出错')
      }
    }

    function text(chars) {
      var parent = stack[stack.length - 1]
      chars = chars.replace(/\s/g, '')

      if (chars) {
        parent.children.push({
          type: 2,
          text: chars,
        })
      }
    }

    function advance(len) {
      html = html.substring(len)
    }

    function parseStartTag() {
      var start = html.match(startTagOpen) // 4.30 继续

      if (start) {
        var match = {
          tagName: start[1],
          attrs: [],
        }
        advance(start[0].length)

        var _end

        var attr

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 1要有属性 2，不能为开始的结束标签 <div>
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5],
          })
          advance(attr[0].length)
        } // <div id="app" a=1 b=2 >

        if (_end) {
          advance(_end[0].length)
        }

        return match
      }

      return false
    }

    while (html) {
      // 解析标签和文本
      var index = html.indexOf('<')

      if (index == 0) {
        // 解析开始标签 并且把属性也解析出来  </div>
        var startTagMatch = parseStartTag()

        if (startTagMatch) {
          // 开始标签
          start(startTagMatch.tagName, startTagMatch.attrs)
          continue
        }

        var endTagMatch = void 0

        if ((endTagMatch = html.match(endTag))) {
          // 结束标签
          end(endTagMatch[1])
          advance(endTagMatch[0].length)
          continue
        }
      } // 文本

      if (index > 0) {
        // 文本
        var chars = html.substring(0, index) //<div></div>

        text(chars)
        advance(chars.length)
      }
    }

    return root
  } //  <div id="app">hello wolrd <span>hello</span></div> */}

  function compileToFunction(template) {
    var ast = parserHTML(template)
    console.log(ast)
    var code = generate(ast)
    console.log(code)
    var render = new Function('with(this){'.concat(code, '}'))
    return render
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this
      vm.$options = options
      initState(vm)
    }

    Vue.prototype.$mount = function (el) {
      el = document.querySelector(el)
      var options = this.$options

      if (!options.render) {
        if (!options.template) {
          options.template = el.outerHTML
        }

        options.render = compileToFunction(options.template)
      }
    }
  }

  function Vue(options) {
    this._init(options)
  }

  initMixin(Vue)

  return Vue
})

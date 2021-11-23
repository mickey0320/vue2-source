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

  var id$1 = 0

  var Dep = /*#__PURE__*/ (function () {
    function Dep() {
      _classCallCheck(this, Dep)

      this.id = id$1++
      this.subs = []
    }

    _createClass(Dep, [
      {
        key: 'depend',
        value: function depend() {
          Dep.target.addDep(this)
        },
      },
      {
        key: 'addSub',
        value: function addSub(watcher) {
          this.subs.push(watcher)
        },
      },
      {
        key: 'notify',
        value: function notify() {
          this.subs.forEach(function (watcher) {
            return watcher.update()
          })
        },
      },
    ])

    return Dep
  })()

  var stack = []
  function pushTarget(watcher) {
    stack.push(watcher)
    Dep.target = watcher
  }
  function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length - 1]
  }

  var oldArrayPrototype = Array.prototype
  var arrayProto = Object.create(oldArrayPrototype)
  var methods$1 = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort']
  methods$1.forEach(function (method) {
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

      this.__ob__.dep.notify()

      return ret
    }
  })

  var Observer = /*#__PURE__*/ (function () {
    function Observer(data) {
      _classCallCheck(this, Observer)

      this.dep = new Dep()
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
    var dep = new Dep()
    var childOb = observe(value)
    Object.defineProperty(target, key, {
      get: function get() {
        if (Dep.target) {
          dep.depend()

          if (childOb) {
            childOb.dep.depend()
          }
        }

        return value
      },
      set: function set(newValue) {
        if (value !== newValue) {
          value = newValue
          observe(newValue)
          dep.notify()
        }
      },
    })
  }

  function observe(data) {
    if (_typeof(data) !== 'object' || data == null) {
      return
    }

    if (data.__ob__) return
    return new Observer(data)
  }

  var callbacks = []
  var waiting = false
  var timerFun

  if (typeof Promise !== 'undefined') {
    timerFun = function timerFun() {
      return Promise.resolve().then(flushCallbacks)
    }
  } else if (window.MutationObserver) {
    var observer = new window.MutationObserver(flushCallbacks)
    var textNode = document.createTextNode(1)
    observer.observe(textNode, {
      characterData: true,
    })

    timerFun = function timerFun() {
      textNode.textContent = 2
    }
  } else if (window.setImmediate) {
    timerFun = window.setImmediate(flushCallbacks)
  } else {
    timerFun = window.setTimeout(flushCallbacks)
  }

  function nextTick(callback) {
    callbacks.push(callback)

    if (!waiting) {
      timerFun(flushCallbacks)
      waiting = true
    }
  }

  function flushCallbacks() {
    callbacks.forEach(function (cb) {
      return cb()
    })
    callbacks = []
    waiting = false
  }

  var queue = []
  var has = {}
  var pending = false

  function queueWatcher(watcher) {
    if (!has[watcher.id]) {
      queue.push(watcher)
      has[watcher.id] = true

      if (!pending) {
        nextTick(flushQueue)
        pending = true
      }
    }
  }

  function flushQueue() {
    queue.forEach(function (watcher) {
      return watcher.run()
    })
    queue = []
    has = {}
    pending = false
  }

  var id = 0

  var Watcher = /*#__PURE__*/ (function () {
    function Watcher(vm, expOrFn, callback) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {}

      _classCallCheck(this, Watcher)

      this.id = id++
      this.vm = vm
      this.expOrFn = expOrFn
      this.callback = callback
      this.options = options
      this.depIds = new Set()
      this.deps = []
      this.dirty = this.options.lazy

      if (typeof expOrFn === 'function') {
        this.getter = expOrFn
      } else {
        this.getter = function () {
          return vm[expOrFn]
        }
      }

      this.value = this.options.lazy ? undefined : this.get()
    }

    _createClass(Watcher, [
      {
        key: 'addDep',
        value: function addDep(dep) {
          if (!this.depIds.has(dep.id)) {
            this.depIds.add(dep.id)
            this.deps.push(dep)
            dep.addSub(this)
          }
        },
      },
      {
        key: 'get',
        value: function get() {
          pushTarget(this)
          var value = this.getter.call(this.vm)
          popTarget()
          return value
        },
      },
      {
        key: 'update',
        value: function update() {
          if (this.options.dirty) {
            this.dirty = false
          } else {
            queueWatcher(this)
          }
        },
      },
      {
        key: 'evaluate',
        value: function evaluate() {
          this.value = this.get()
          this.dirty = false
        },
      },
      {
        key: 'depend',
        value: function depend() {
          var l = this.deps.length

          while (l) {
            this.deps[--l].depend()
          }
        },
      },
      {
        key: 'run',
        value: function run() {
          var newValue = this.get()

          if (this.options.user) {
            this.callback(newValue, this.value)
          }

          this.value = newValue
        },
      },
    ])

    return Watcher
  })()

  function initState(vm) {
    var options = vm.$options

    if (options.data) {
      initData(vm)
    }

    if (options.watch) {
      initWatch(vm)
    }

    if (options.computed) {
      initComputed(vm)
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

  function initWatch(vm) {
    var watch = vm.$options.watch

    for (var key in watch) {
      createWatcher(vm, key, watch[key])
    }
  }

  function createWatcher(vm, key, handler) {
    vm.$watch(key, handler)
  }

  function initComputed(vm) {
    var computed = vm.$options.computed
    vm._watchers = {}

    for (var key in computed) {
      var userDef = computed[key]
      vm._watchers[key] = new Watcher(vm, userDef, function () {}, {
        lazy: true,
      })
      defineComputed(vm, key)
    }
  }

  function defineComputed(vm, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        var watcher = vm._watchers[key]

        if (watcher !== null && watcher !== void 0 && watcher.dirty) {
          watcher.evaluate()
        }

        if (Dep.target) {
          watcher.depend()
        }

        return watcher.value
      },
    })
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{   xxx  }}

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

  function gen(el) {
    if (el.type === 1) {
      return generate(el)
    } else {
      var text = el.text

      if (!defaultTagRE.test(text)) {
        return '_v("'.concat(text, '")')
      } else {
        var tokens = []
        var match
        var lastIndex = (defaultTagRE.lastIndex = 0)

        while ((match = defaultTagRE.exec(text))) {
          var index = match.index

          if (index > lastIndex) {
            tokens.push(''.concat(JSON.stringify(text.slice(lastIndex, index))))
          }

          tokens.push('_s('.concat(match[1].trim(), ')'))
          lastIndex = index + match[0].length
        }

        if (lastIndex < text.length) {
          tokens.push(''.concat(JSON.stringify(text.slice(lastIndex))))
        }

        return '_v('.concat(tokens.join('+'), ')')
      }
    }
  }

  function generate(ast) {
    var children = genChildren(ast)
    var code = "_c('"
      .concat(ast.tag, "',")
      .concat(ast.attrs.length ? genProps(ast.attrs) : undefined)
      .concat(children ? ',' + '[' + children + ']' : '', ')')
    return code
  }

  var ncname = '[a-zA-Z_][\\-\\.0-9_a-zA-Z]*' // 匹配标签名的  aa-xxx

  var qnameCapture = '((?:'.concat(ncname, '\\:)?').concat(ncname, ')') //  aa:aa-xxx

  var startTagOpen = new RegExp('^<'.concat(qnameCapture)) //  此正则可以匹配到标签名 匹配到结果的第一个(索引第一个) [1]

  var endTag = new RegExp('^<\\/'.concat(qnameCapture, '[^>]*>')) // 匹配标签结尾的 </div>  [1]
  // eslint-disable-next-line no-useless-escape

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性的
  // [1]属性的key   [3] || [4] ||[5] 属性的值  a=1  a='1'  a=""

  var startTagClose = /^\s*(\/?)>/ // 匹配标签结束的  />    >
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
    var code = generate(ast)
    var render = new Function('with(this){return '.concat(code, '}'))
    return render
  }

  function createElement(vm, tag) {
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}
    var children = arguments.length > 3 ? arguments[3] : undefined
    return vnode(vm, tag, props, children, undefined, props.key)
  }
  function createTextElement(vm, text) {
    return vnode(vm, undefined, undefined, undefined, text, undefined)
  }

  function vnode(vm, tag, props, children, text, key) {
    return {
      vm: vm,
      tag: tag,
      props: props,
      children: children,
      text: text,
      key: key,
    }
  }

  function patch(oldVnode, newVnode) {
    if (oldVnode.nodeType === 1) {
      var el = createEle(newVnode)
      var parentNode = oldVnode.parentNode
      parentNode.insertBefore(el, oldVnode.nextSibling)
      parentNode.removeChild(oldVnode)
      return el
    }
  }

  function createEle(vnode) {
    if (typeof vnode.tag === 'string') {
      vnode.el = document.createElement(vnode.tag)
      vnode.children.forEach(function (childVnode) {
        vnode.el.appendChild(createEle(childVnode))
      })
    } else {
      vnode.el = document.createTextNode(vnode.text)
    }

    return vnode.el
  }

  function lifeCycleMixin(Vue) {
    Vue.prototype._c = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key]
      }

      return createElement.apply(void 0, [this].concat(args))
    }

    Vue.prototype._s = function (val) {
      if (_typeof(val) === 'object') {
        return JSON.stringify(val)
      }

      return val
    }

    Vue.prototype._v = function (text) {
      return createTextElement(this, text)
    }

    Vue.prototype._update = function (vnode) {
      this.$el = patch(this.$el, vnode)
    }

    Vue.prototype._render = function () {
      var vm = this
      var render = vm.$options.render
      var vnode = render.call(vm)
      return vnode
    }
  }
  var mountComponent = function mountComponent(vm) {
    function updateComponent() {
      vm._update(vm._render())
    }

    new Watcher(vm, updateComponent, function () {
      //
    })
  }

  var strats = {}
  var methods = ['beforeCreate', 'created', 'beforeMount', 'mounted']
  methods.forEach(function (method) {
    strats[method] = function (globalVal, instanceVal) {
      if (instanceVal) {
        if (globalVal) {
          return globalVal.concat(instanceVal)
        } else {
          return [instanceVal]
        }
      } else {
        return globalVal
      }
    }
  })

  function mergeOptions(globalOptions, instanceOptions) {
    var options = {}

    for (var key in globalOptions) {
      options[key] = mergeFiled(key)
    }

    for (var _key in instanceOptions) {
      // eslint-disable-next-line no-prototype-builtins
      if (!globalOptions.hasOwnProperty(_key)) {
        options[_key] = mergeFiled(_key)
      }
    }

    function mergeFiled(key) {
      if (strats[key]) {
        return strats[key](globalOptions[key], instanceOptions[key])
      } else {
        return instanceOptions[key] || globalOptions[key]
      }
    }

    return options
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this
      vm.$options = mergeOptions(this.constructor.options, options)
      initState(vm)
    }

    Vue.prototype.$mount = function (el) {
      el = document.querySelector(el)
      this.$el = el
      var options = this.$options

      if (!options.render) {
        if (!options.template) {
          options.template = el.outerHTML
        }

        options.render = compileToFunction(options.template)
      }

      mountComponent(this)
      return this
    }

    Vue.prototype.$watch = function (key, handler) {
      new Watcher(this, key, handler, {
        user: true,
      })
    }
  }

  function initGlobalApi(Vue) {
    Vue.options = {}

    Vue.mixin = function (options) {
      Vue.options = mergeOptions(this.options, options)
      console.log(Vue.options)
    }
  }

  function Vue(options) {
    this._init(options)
  }

  initGlobalApi(Vue)
  initMixin(Vue)
  lifeCycleMixin(Vue)

  return Vue
})

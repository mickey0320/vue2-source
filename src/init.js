import initState from './state'
import { compileToFunction } from './compile/index.js'
import { mountComponent } from './lifecycle'
import mergeOptions from './utils/mergeOptions'
import Watcher from './observer/watcher'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = mergeOptions(this.constructor.options, options)
    initState(vm)
  }
  Vue.prototype.$mount = function (el) {
    el = document.querySelector(el)
    this.$el = el
    const options = this.$options
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
    new Watcher(this, key, handler, { user: true })
  }
}

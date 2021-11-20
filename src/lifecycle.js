import { createElement, createTextElement } from './vnode/index.js'
import { patch } from './vnode/patch'
import Watcher from './observer/watcher'

export function lifeCycleMixin(Vue) {
  Vue.prototype._c = function (...args) {
    return createElement(this, ...args)
  }
  Vue.prototype._s = function (val) {
    if (typeof val === 'object') {
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
    const vm = this
    const render = vm.$options.render

    const vnode = render.call(vm)
    return vnode
  }
}

export const mountComponent = (vm) => {
  function updateComponent() {
    vm._update(vm._render())
  }
  new Watcher(updateComponent)
}

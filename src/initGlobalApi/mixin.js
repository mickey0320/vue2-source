import mergeOptions from '../utils/mergeOptions'

function initMixin(Vue) {
  Vue.mixin = function (options) {
    Vue.options = mergeOptions(this.options, options)
  }
}

export default initMixin

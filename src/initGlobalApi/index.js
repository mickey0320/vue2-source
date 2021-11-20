import mergeOptions from '../utils/mergeOptions'

export function initGlobalApi(Vue) {
  Vue.options = {}
  Vue.mixin = function (options) {
    Vue.options = mergeOptions(this.options, options)
    console.log(Vue.options)
  }
}

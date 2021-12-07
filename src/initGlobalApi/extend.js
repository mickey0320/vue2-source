import mergeOptions from '../utils/mergeOptions'

function initExtend(Vue) {
  Vue.extend = function (extendOptions) {
    const Sub = function VueComponent(options) {
      this._init(options)
    }
    Sub.prototype = Object.create(this.prototype)
    Sub.prototype.constructor = Sub
    Sub.options = mergeOptions(this.options, extendOptions)

    return Sub
  }
}

export default initExtend

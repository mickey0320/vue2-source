import initMixin from './mixin'
import initAssetsRegister from './assets'
import { ASSET_TYPES } from './const'
import initExtend from './extend'

export function initGlobalApi(Vue) {
  Vue.options = {}
  initMixin(Vue)
  ASSET_TYPES.forEach((type) => {
    Vue.options[type + 's'] = {}
  })
  Vue.options._base = Vue
  initExtend(Vue)
  initAssetsRegister(Vue)
}

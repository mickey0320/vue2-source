import { initMixin } from './init'
import { lifeCycleMixin } from './lifecycle'
import { initGlobalApi } from './initGlobalApi/index'

function Vue(options) {
  this._init(options)
}

initGlobalApi(Vue)
initMixin(Vue)
lifeCycleMixin(Vue)

export default Vue

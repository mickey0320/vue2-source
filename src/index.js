import { initMixin } from './init'
import { lifeCycleMixin } from './lifecycle'

function Vue(options) {
  this._init(options)
}

initMixin(Vue)
lifeCycleMixin(Vue)

export default Vue

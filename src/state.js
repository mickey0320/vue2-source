import { observe } from './observer/index.js'

function initState(vm) {
  const options = vm.$options
  if (options.data) {
    initData(vm)
  }
}

function initData(vm) {
  let data = vm.$options.data
  if (typeof data === 'function') {
    data = data.call(vm)
  }
  observe(data)
}

export default initState

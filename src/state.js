import { observe } from './observer/index.js'

function initState(vm) {
  const options = vm.$options
  if (options.data) {
    initData(vm)
  }
  if (options.watch) {
    initWatch(vm)
  }
}

function proxy(target, key, property) {
  Object.defineProperty(target, property, {
    get() {
      return target[key][property]
    },
    set(newValue) {
      target[key][property] = newValue
    },
  })
}

function initData(vm) {
  let data = vm.$options.data
  if (typeof data === 'function') {
    data = data.call(vm)
  }
  vm._data = data
  for (let key in vm._data) {
    proxy(vm, '_data', key)
  }
  observe(data)
}

function initWatch(vm) {
  const watch = vm.$options.watch
  for (let key in watch) {
    createWatcher(vm, key, watch[key])
  }
}

function createWatcher(vm, key, handler) {
  vm.$watch(key, handler)
}

export default initState

import Dep from './observer/dep.js'
import { observe } from './observer/index.js'
import Watcher from './observer/watcher'

function initState(vm) {
  const options = vm.$options
  if (options.data) {
    initData(vm)
  }
  if (options.watch) {
    initWatch(vm)
  }
  if (options.computed) {
    initComputed(vm)
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

function initComputed(vm) {
  const computed = vm.$options.computed
  vm._watchers = {}
  for (let key in computed) {
    const userDef = computed[key]
    vm._watchers[key] = new Watcher(vm, userDef, () => {}, { lazy: true })
    defineComputed(vm, key)
  }
}

function defineComputed(vm, key) {
  Object.defineProperty(vm, key, {
    get() {
      const watcher = vm._watchers[key]
      if (watcher?.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }

      return watcher.value
    },
  })
}

export default initState

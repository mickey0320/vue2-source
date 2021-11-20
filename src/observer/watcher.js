import Dep from './dep'
import queueWatcher from './scheduler'

let id = 0
class Watcher {
  constructor(vm, expOrFn, callback, options = {}) {
    this.id = id++
    this.vm = vm
    this.expOrFn = expOrFn
    this.callback = callback
    this.options = options
    this.depIds = new Set()
    this.deps = []
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = () => vm[expOrFn]
    }

    this.value = this.get()
  }
  addDep(dep) {
    if (!this.depIds.has(dep.id)) {
      this.depIds.add(dep.id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
  get() {
    Dep.target = this
    const value = this.getter()
    Dep.target = null

    return value
  }
  update() {
    queueWatcher(this)
  }
  run() {
    const newValue = this.get()
    if (this.options.user) {
      this.callback(newValue, this.value)
    }
    this.value = newValue
  }
}

export default Watcher

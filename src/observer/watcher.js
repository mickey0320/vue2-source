import { popTarget, pushTarget } from './dep'
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
    this.dirty = this.options.lazy
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = () => vm[expOrFn]
    }

    this.value = this.options.lazy ? undefined : this.get()
  }
  addDep(dep) {
    if (!this.depIds.has(dep.id)) {
      this.depIds.add(dep.id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
  get() {
    pushTarget(this)
    const value = this.getter.call(this.vm)
    popTarget()

    return value
  }
  update() {
    if (this.options.dirty) {
      this.dirty = false
    } else {
      queueWatcher(this)
    }
  }
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }
  depend() {
    let l = this.deps.length
    while (l) {
      this.deps[--l].depend()
    }
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

import Dep from './dep'
import queueWatcher from './scheduler'

let id = 0
class Watcher {
  constructor(fn) {
    this.id = id++
    this.getter = fn
    this.depIds = new Set()
    this.deps = []

    this.get()
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
    this.getter()
    Dep.target = null
  }
  update() {
    queueWatcher(this)
  }
  run() {
    console.log('run')
    this.get()
  }
}

export default Watcher

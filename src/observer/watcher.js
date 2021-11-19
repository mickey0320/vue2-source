import Dep from './dep'

let id = 0
class Watcher {
  constructor(vm, fn) {
    this.id = id++
    this.vm = vm
    this.getter = fn

    this.get()
  }
  get() {
    Dep.target = this
    this.getter(this.vm)
    Dep.target = null
  }
  update() {
    this.get()
  }
}

export default Watcher

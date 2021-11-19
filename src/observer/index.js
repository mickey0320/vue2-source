import { arrayProto } from './array'
import Dep from './dep'

class Observer {
  constructor(data) {
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false,
    })
    if (Array.isArray(data)) {
      data.__proto__ = arrayProto
      this.observeArray(data)
    } else {
      this.walk(data)
    }
  }
  observeArray(arr) {
    arr.forEach((data) => observe(data))
  }
  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key])
    })
  }
}

function defineReactive(target, key, value) {
  const dep = new Dep()
  Object.defineProperty(target, key, {
    get() {
      if (Dep.target) {
        dep.depend()
      }
      return value
    },
    set(newValue) {
      if (value !== newValue) {
        value = newValue
        observe(newValue)
        dep.notify()
      }
    },
  })
  observe(value)
}

export function observe(data) {
  if (typeof data !== 'object' || data == null) {
    return
  }
  if (data.__ob__) return
  new Observer(data)
}

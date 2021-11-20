const oldArrayPrototype = Array.prototype

export const arrayProto = Object.create(oldArrayPrototype)

const methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort']

methods.forEach((method) => {
  arrayProto[method] = function (...args) {
    const ret = oldArrayPrototype[method].apply(this, args)
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(3)
        break
    }
    if (inserted) this.__ob__.observeArray(inserted)
    this.__ob__.dep.notify()

    return ret
  }
})

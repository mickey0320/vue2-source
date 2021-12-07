const strats = {}
const methods = ['beforeCreate', 'created', 'beforeMount', 'mounted']
methods.forEach((method) => {
  strats[method] = function (globalVal, instanceVal) {
    if (instanceVal) {
      if (globalVal) {
        return globalVal.concat(instanceVal)
      } else {
        return [instanceVal]
      }
    } else {
      return globalVal
    }
  }
})
strats.components = mergeAssets
function mergeAssets(parentVal, childVal) {
  const ret = Object.create(parentVal)
  for (let key in childVal) {
    ret[key] = childVal[key]
  }

  return ret
}
function mergeOptions(globalOptions, instanceOptions) {
  const options = {}
  for (let key in globalOptions) {
    options[key] = mergeFiled(key)
  }
  for (let key in instanceOptions) {
    // eslint-disable-next-line no-prototype-builtins
    if (!globalOptions.hasOwnProperty(key)) {
      options[key] = mergeFiled(key)
    }
  }

  function mergeFiled(key) {
    if (strats[key]) {
      return strats[key](globalOptions[key], instanceOptions[key])
    } else {
      return instanceOptions[key] || globalOptions[key]
    }
  }

  return options
}

export default mergeOptions

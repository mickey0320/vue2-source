import { ASSET_TYPES } from './const'

function initAssetsRegister(Vue) {
  ASSET_TYPES.forEach((type) => {
    Vue[type] = function (id, defination) {
      switch (type) {
        case 'component':
          defination = this.options._base.extend(defination)
          break
        case 'directive':
          break
        case 'filter':
          break
      }
      this.options[type + 's'][id] = defination
    }
  })
}

export default initAssetsRegister

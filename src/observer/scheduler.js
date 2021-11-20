import nextTick from '../utils/nextTick'

let queue = []
let has = {}
let pending = false

function queueWatcher(watcher) {
  if (!has[watcher.id]) {
    queue.push(watcher)
    has[watcher.id] = true
    if (!pending) {
      nextTick(flushQueue)
      pending = true
    }
  }
}
function flushQueue() {
  queue.forEach((watcher) => watcher.run())
  queue = []
  has = {}
  pending = false
}

export default queueWatcher

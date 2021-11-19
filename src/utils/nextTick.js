let callbacks = []
let waiting = false
let timerFun

if (typeof Promise !== 'undefined') {
  timerFun = () => Promise.resolve().then(flushCallbacks)
} else if (window.MutationObserver) {
  const observer = new window.MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(1)
  observer.observe(textNode, { characterData: true })
  timerFun = () => {
    textNode.textContent = 2
  }
} else if (window.setImmediate) {
  timerFun = window.setImmediate(flushCallbacks)
} else {
  timerFun = window.setTimeout(flushCallbacks)
}

function nextTick(callback) {
  callbacks.push(callback)
  if (!waiting) {
    timerFun(flushCallbacks)
    waiting = true
  }
}

function flushCallbacks() {
  callbacks.forEach((cb) => cb())
  callbacks = []
  waiting = false
}

export default nextTick

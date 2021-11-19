export function createElement(vm, tag, props = {}, children) {
  return vnode(vm, tag, props, children, undefined, props.key)
}

export function createTextElement(vm, text) {
  return vnode(vm, undefined, undefined, undefined, text, undefined)
}

function vnode(vm, tag, props, children, text, key) {
  return {
    vm,
    tag,
    props,
    children,
    text,
    key,
  }
}

export function patch(oldVnode, newVnode) {
  if (oldVnode.nodeType === 1) {
    const el = createEle(newVnode)
    const parentNode = oldVnode.parentNode
    parentNode.insertBefore(el, oldVnode.nextSibling)

    parentNode.removeChild(oldVnode)
  }
}

function createEle(vnode) {
  if (typeof vnode.tag === 'string') {
    vnode.el = document.createElement(vnode.tag)
    vnode.children.forEach((childVnode) => {
      vnode.el.appendChild(createEle(childVnode))
    })
  } else {
    vnode.el = document.createTextNode(vnode.text)
  }

  return vnode.el
}

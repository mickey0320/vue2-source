function genProps(attrs) {
  let str = ``
  attrs.forEach((attr) => {
    if (attr.name === 'style') {
      const style = {}
      // eslint-disable-next-line no-useless-escape
      attr.value.replace(/([^;:]+)\:([^;:]+)/g, function () {
        style[arguments[1]] = arguments[2]
      })
      attr.value = style
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  })

  return `{${str.slice(0, -1)}}`
}

function genChildren(ast) {
  const children = ast.children
  if (children.length) {
    return children.map((child) => gen(child)).join(',')
  }
  return false
}

function gen(ast) {
  if (ast.type === 1) {
    return generate(ast)
  } else {
    //
  }
}

export function generate(ast) {
  const children = genChildren(ast)
  const code = `_c('${ast.tag}',${ast.attrs.length ? genProps(ast.attrs) : undefined}${children ? ',' + children : ''})`

  return code
}
